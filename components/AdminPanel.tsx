import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../hooks/useUser';
import type { User } from '../types';

const AdminPanel: React.FC = () => {
    const { 
      updateImageAndReset, 
      getAllUsersForAdmin, 
      updateOverlayOpacity,
      imageUrl: currentImageUrl, 
      overlayOpacity: currentOpacity 
    } = useUser();
    
    const [users, setUsers] = useState<User[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [opacity, setOpacity] = useState(0.8);

    useEffect(() => {
        setUsers(getAllUsersForAdmin());
        setNewImageUrl(currentImageUrl);
        setOpacity(currentOpacity);
    }, [getAllUsersForAdmin, currentImageUrl, currentOpacity]);
    
    const handleUpdateAndReset = () => {
        if (!newImageUrl.startsWith('http')) {
            alert('Please enter a valid image URL.');
            return;
        }
        if (window.confirm('Are you sure? This will set the new image and reset ALL user progress. This action cannot be undone.')) {
            updateImageAndReset(newImageUrl);
        }
    };

    const handleSaveSettings = () => {
        updateOverlayOpacity(opacity);
        alert('Display settings saved!');
    };

    const goBackToApp = () => {
        window.location.hash = '';
    }

    return (
        <div className="min-h-screen bg-slate-800 text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-cyan-400">Admin Panel</h1>
                    <button
                        onClick={goBackToApp}
                        className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        &larr; Back to App
                    </button>
                </div>

                {/* Settings Section */}
                <div className="bg-slate-900/50 p-6 rounded-lg shadow-lg mb-8 border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-4">Display Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="opacity-slider" className="block text-slate-300 text-sm font-bold mb-2">
                                Overlay Opacity: {Math.round(opacity * 100)}%
                            </label>
                            <input
                                id="opacity-slider"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>

                {/* Image Management Section */}
                <div className="bg-slate-900/50 p-6 rounded-lg shadow-lg mb-8 border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-4">Image of the Month</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="imageUrl" className="block text-slate-300 text-sm font-bold mb-2">
                                New Image URL
                            </label>
                            <input
                                id="imageUrl"
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="https://example.com/straykids.jpg"
                                className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-2">Current Image Preview:</p>
                            {currentImageUrl && <img src={currentImageUrl} alt="Current preview" className="max-w-xs rounded-lg shadow-md" />}
                        </div>
                        <button
                            onClick={handleUpdateAndReset}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Save New Image & Reset All Progress
                        </button>
                    </div>
                </div>

                {/* User List Section */}
                <div className="bg-slate-900/50 p-6 rounded-lg shadow-lg border border-slate-700">
                    <h2 className="text-2xl font-semibold mb-4">Registered Users ({users.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left table-auto">
                            <thead className="border-b border-slate-600">
                                <tr>
                                    <th className="p-3">Username</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Profile URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map(user => (
                                    <tr key={user.email} className="border-b border-slate-700 hover:bg-slate-800/50">
                                        <td className="p-3">{user.username}</td>
                                        <td className="p-3 font-mono text-sm">{user.email}</td>
                                        <td className="p-3 text-sm text-cyan-400 truncate max-w-xs">
                                          {user.profileUrl && <a href={user.profileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{user.profileUrl}</a>}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center p-6 text-slate-400">No users have registered yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
