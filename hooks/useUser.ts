import { useState, useEffect, useCallback } from 'react';
import type { User, RevealData } from '../types';
import { 
  DAILY_UNLOCK_LIMIT, 
  ALL_USERS_KEY, 
  CURRENT_USER_EMAIL_KEY,
  IMAGE_URL_KEY,
  GLOBAL_REVEALS_STORAGE_KEY,
  OVERLAY_OPACITY_KEY,
  DEFAULT_IMAGE_URL
} from '../constants';

const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Deserializer for hydrating Maps and Sets from JSON
const reviver = (key: string, value: any) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
    if (value.dataType === 'Set') {
      return new Set(value.value);
    }
  }
  return value;
};

// Serializer for storing Maps and Sets in JSON
const replacer = (key: string, value: any) => {
  if (value instanceof Map) {
    return { dataType: 'Map', value: Array.from(value.entries()) };
  }
  if (value instanceof Set) {
    return { dataType: 'Set', value: Array.from(value.values()) };
  }
  return value;
};


const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue, reviver) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value, replacer));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
  }
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<Record<string, User>>({});
  const [globalReveals, setGlobalReveals] = useState<Map<number, RevealData>>(new Map());
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.8);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all data on initial mount
    const loadedImageUrl = loadFromStorage(IMAGE_URL_KEY, DEFAULT_IMAGE_URL);
    setImageUrl(loadedImageUrl);

    const loadedOpacity = loadFromStorage(OVERLAY_OPACITY_KEY, 0.8);
    setOverlayOpacity(loadedOpacity);

    const loadedGlobalReveals = loadFromStorage(GLOBAL_REVEALS_STORAGE_KEY, new Map<number, RevealData>());
    setGlobalReveals(loadedGlobalReveals);
    
    let loadedUsers = loadFromStorage<Record<string, User>>(ALL_USERS_KEY, {});
    const currentUserEmail = loadFromStorage<string | null>(CURRENT_USER_EMAIL_KEY, null);
    
    if (currentUserEmail && loadedUsers[currentUserEmail]) {
      const currentUserData = loadedUsers[currentUserEmail];
      const today = getTodayDateString();

      // This is the critical fix: create new objects instead of mutating state.
      if (currentUserData.lastUnlockDate !== today) {
        const updatedCurrentUser = {
          ...currentUserData,
          dailyUnlocks: DAILY_UNLOCK_LIMIT,
          lastUnlockDate: today,
        };
        const updatedUsers = {
          ...loadedUsers,
          [currentUserEmail]: updatedCurrentUser,
        };
        
        saveToStorage(ALL_USERS_KEY, updatedUsers);
        
        setUser(updatedCurrentUser);
        setAllUsers(updatedUsers);
      } else {
        setUser(currentUserData);
        setAllUsers(loadedUsers);
      }
    } else {
        setAllUsers(loadedUsers);
    }
    
    setIsLoading(false);
  }, []);

  const saveAllUsers = useCallback((usersToSave: Record<string, User>) => {
    setAllUsers(usersToSave);
    saveToStorage(ALL_USERS_KEY, usersToSave);
  }, []);

  const saveGlobalReveals = useCallback((updatedReveals: Map<number, RevealData>) => {
    setGlobalReveals(updatedReveals);
    saveToStorage(GLOBAL_REVEALS_STORAGE_KEY, updatedReveals);
  }, []);

  const login = useCallback((email: string, username: string, profileUrl?: string) => {
    const today = getTodayDateString();
    const currentAllUsers = allUsers;
    let userToLogin = currentAllUsers[email];
    
    const isNewUser = !userToLogin;

    if (isNewUser) {
      userToLogin = {
        email,
        username,
        profileUrl: profileUrl || '',
        dailyUnlocks: DAILY_UNLOCK_LIMIT,
        lastUnlockDate: today,
        revealedBlocks: new Set(),
      };
    } else if (userToLogin.lastUnlockDate !== today) {
      // Create new object for immutability
      userToLogin = {
        ...userToLogin,
        dailyUnlocks: DAILY_UNLOCK_LIMIT,
        lastUnlockDate: today,
      };
    }
    
    if (isNewUser || userToLogin !== currentAllUsers[email]) {
        const updatedUsers = { ...currentAllUsers, [email]: userToLogin };
        saveAllUsers(updatedUsers);
    }
    
    saveToStorage(CURRENT_USER_EMAIL_KEY, email);
    setUser(userToLogin);
  }, [allUsers, saveAllUsers]);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
    setUser(null);
  }, []);

  const unlockBlock = useCallback((index: number) => {
    if (!user || user.dailyUnlocks <= 0 || globalReveals.has(index)) {
        return;
    }
    
    const updatedUser: User = {
        ...user,
        dailyUnlocks: user.dailyUnlocks - 1,
        revealedBlocks: new Set(user.revealedBlocks).add(index),
    };

    const updatedAllUsers = { ...allUsers, [user.email]: updatedUser };
    
    const updatedGlobalReveals = new Map(globalReveals);
    updatedGlobalReveals.set(index, { username: user.username, profileUrl: user.profileUrl });

    setUser(updatedUser);
    saveAllUsers(updatedAllUsers);
    saveGlobalReveals(updatedGlobalReveals);

  }, [user, allUsers, globalReveals, saveAllUsers, saveGlobalReveals]);
  
  const addBonusUnlocks = useCallback((amount: number) => {
      if (!user) return;

      const updatedUser: User = { ...user, dailyUnlocks: user.dailyUnlocks + amount };
      const updatedAllUsers = { ...allUsers, [user.email]: updatedUser };
      
      setUser(updatedUser);
      saveAllUsers(updatedAllUsers);
  }, [user, allUsers, saveAllUsers]);

  const updateProfileUrl = useCallback((url: string) => {
    if (!user) return;
    
    const updatedUser: User = { ...user, profileUrl: url };
    const updatedAllUsers = { ...allUsers, [user.email]: updatedUser };

    const updatedGlobalReveals = new Map(globalReveals);
    let changed = false;
    for (const blockIndex of updatedUser.revealedBlocks) {
        const revealData = updatedGlobalReveals.get(blockIndex);
        if (revealData && revealData.username === updatedUser.username) {
             updatedGlobalReveals.set(blockIndex, { username: updatedUser.username, profileUrl: url });
             changed = true;
        }
    }
    
    setUser(updatedUser);
    saveAllUsers(updatedAllUsers);
    if (changed) {
        saveGlobalReveals(updatedGlobalReveals);
    }
  }, [user, allUsers, globalReveals, saveAllUsers, saveGlobalReveals]);

  // --- Admin Functions ---
  const updateImageAndReset = useCallback((newImageUrl: string) => {
    if (!newImageUrl) return;
    saveToStorage(IMAGE_URL_KEY, newImageUrl);
    const newGlobalReveals = new Map();
    saveGlobalReveals(newGlobalReveals);
    
    const currentAllUsers = allUsers;
    const updatedUsers = {...currentAllUsers};
    for (const email in updatedUsers) {
      updatedUsers[email] = { ...updatedUsers[email], revealedBlocks: new Set() };
    }
    saveAllUsers(updatedUsers);

    setImageUrl(newImageUrl);

    alert("Image updated and all progress has been reset! The page will now reload.");
    window.location.hash = '';
    window.location.reload();
  }, [allUsers, saveAllUsers, saveGlobalReveals]);
  
  const getAllUsersForAdmin = useCallback((): User[] => {
     return Object.values(loadFromStorage<Record<string, User>>(ALL_USERS_KEY, {}));
  }, []);

  const updateOverlayOpacity = useCallback((opacity: number) => {
    setOverlayOpacity(opacity);
    saveToStorage(OVERLAY_OPACITY_KEY, opacity);
  }, []);

  return { user, login, logout, unlockBlock, addBonusUnlocks, updateProfileUrl, globalReveals, imageUrl, overlayOpacity, isLoading, updateImageAndReset, getAllUsersForAdmin, updateOverlayOpacity };
};