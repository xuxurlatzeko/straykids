import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { 
  DAILY_UNLOCK_LIMIT, 
  ALL_USERS_KEY, 
  CURRENT_USER_EMAIL_KEY,
  IMAGE_URL_KEY,
  GLOBAL_REVEALS_STORAGE_KEY
} from '../constants';

const DEFAULT_IMAGE_URL = 'https://www.rollingstone.co.uk/wp-content/uploads/sites/2/2024/09/sh05_Group_RollingStoneUK_StrayKids-4272-e1726578700988.jpg';

const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// --- Helper functions for localStorage ---
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage`, error);
  }
};


export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<Record<string, User>>({});
  const [globalReveals, setGlobalReveals] = useState<Map<number, string>>(new Map());
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_IMAGE_URL);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all data on initial mount
    const loadedImageUrl = loadFromStorage(IMAGE_URL_KEY, DEFAULT_IMAGE_URL);
    setImageUrl(loadedImageUrl);

    const loadedGlobalReveals = new Map<number, string>(loadFromStorage(GLOBAL_REVEALS_STORAGE_KEY, []));
    setGlobalReveals(loadedGlobalReveals);
    
    const loadedUsers = loadFromStorage<Record<string, User>>(ALL_USERS_KEY, {});
    // Hydrate Sets after parsing from JSON
    for(const email in loadedUsers){
      loadedUsers[email].revealedBlocks = new Set(loadedUsers[email].revealedBlocks || []);
    }
    setAllUsers(loadedUsers);

    const currentUserEmail = loadFromStorage<string | null>(CURRENT_USER_EMAIL_KEY, null);
    
    if (currentUserEmail && loadedUsers[currentUserEmail]) {
      const currentUser = loadedUsers[currentUserEmail];
      const today = getTodayDateString();

      if (currentUser.lastUnlockDate !== today) {
        currentUser.dailyUnlocks = DAILY_UNLOCK_LIMIT;
        currentUser.lastUnlockDate = today;
      }
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const saveAllUsers = useCallback((updatedUsers: Record<string, User>) => {
    setAllUsers(updatedUsers);
    const usersToStore: Record<string, any> = {};
     for(const email in updatedUsers){
        usersToStore[email] = {
            ...updatedUsers[email],
            revealedBlocks: Array.from(updatedUsers[email].revealedBlocks)
        }
    }
    saveToStorage(ALL_USERS_KEY, usersToStore);
  }, []);

  const saveGlobalReveals = useCallback((updatedReveals: Map<number, string>) => {
    setGlobalReveals(updatedReveals);
    saveToStorage(GLOBAL_REVEALS_STORAGE_KEY, Array.from(updatedReveals.entries()));
  }, []);

  const login = useCallback((email: string, username: string) => {
    const today = getTodayDateString();
    const updatedUsers = { ...allUsers };
    let userToLogin = updatedUsers[email];

    if (!userToLogin) {
      // Create new user
      userToLogin = {
        email,
        username,
        dailyUnlocks: DAILY_UNLOCK_LIMIT,
        lastUnlockDate: today,
        revealedBlocks: new Set(),
      };
    } else {
      // Existing user, check for daily reset
      if (userToLogin.lastUnlockDate !== today) {
        userToLogin.dailyUnlocks = DAILY_UNLOCK_LIMIT;
        userToLogin.lastUnlockDate = today;
      }
    }
    
    updatedUsers[email] = userToLogin;
    saveAllUsers(updatedUsers);
    
    saveToStorage(CURRENT_USER_EMAIL_KEY, email);
    setUser(userToLogin);
  }, [allUsers, saveAllUsers]);

  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
    setUser(null);
  }, []);

  const unlockBlock = useCallback((index: number) => {
    if (user && user.dailyUnlocks > 0 && !globalReveals.has(index)) {
      const updatedUser: User = {
        ...user,
        dailyUnlocks: user.dailyUnlocks - 1,
        revealedBlocks: new Set(user.revealedBlocks).add(index),
      };
      setUser(updatedUser);

      const updatedUsers = { ...allUsers, [user.email]: updatedUser };
      saveAllUsers(updatedUsers);

      const newGlobalReveals = new Map(globalReveals);
      newGlobalReveals.set(index, user.username);
      saveGlobalReveals(newGlobalReveals);
    }
  }, [user, allUsers, globalReveals, saveAllUsers, saveGlobalReveals]);
  
  const addBonusUnlocks = useCallback((amount: number) => {
      if (user) {
        const updatedUser: User = { ...user, dailyUnlocks: user.dailyUnlocks + amount };
        setUser(updatedUser);
        
        const updatedUsers = { ...allUsers, [user.email]: updatedUser };
        saveAllUsers(updatedUsers);
      }
  }, [user, allUsers, saveAllUsers]);

  // --- Admin Functions ---
  const updateImageAndReset = useCallback((newImageUrl: string) => {
    if (!newImageUrl) return;

    // Reset global reveals
    saveGlobalReveals(new Map());
    
    // Reset all users' progress
    const loadedUsers = loadFromStorage<Record<string, User>>(ALL_USERS_KEY, {});
    for (const email in loadedUsers) {
      loadedUsers[email].revealedBlocks = new Set();
    }
    saveAllUsers(loadedUsers);

    // Set new image URL
    setImageUrl(newImageUrl);
    saveToStorage(IMAGE_URL_KEY, newImageUrl);

    // Reload to apply all changes cleanly
    alert("Image updated and all progress has been reset! The page will now reload.");
    window.location.hash = '';
    window.location.reload();
  }, [saveAllUsers, saveGlobalReveals]);
  
  const getAllUsersForAdmin = useCallback(() => {
     return Object.values(loadFromStorage<Record<string, User>>(ALL_USERS_KEY, {}));
  }, []);


  return { user, login, logout, unlockBlock, addBonusUnlocks, globalReveals, imageUrl, isLoading, updateImageAndReset, getAllUsersForAdmin };
};