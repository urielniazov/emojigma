// src/components/game/UserStats.js
import React, { useEffect, useState } from 'react';
import { fetchUserStreak } from '../services/apiService';
import { useGame } from '../context/GameContext';

const UserStats = ({ deviceId }) => {
  const { statsTimestamp } = useGame();
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalCompleted: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const { streak } = await fetchUserStreak(deviceId);
        setStats(streak || {
          currentStreak: 0,
          totalCompleted: 0,
          completionRate: 0
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading stats:', error);
        // On error, keep using default values
        setLoading(false);
      }
    };
    
    if (deviceId) {
      loadStats();
    }
  }, [deviceId, statsTimestamp]);
  
  if (loading) {
    return <div className="text-center">Loading stats...</div>;
  }
  
  return (
    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
      <h4 className="text-indigo-800 font-medium mb-2">Your Stats</h4>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-xl font-bold text-indigo-700">{stats.currentStreak || 0}</div>
          <div className="text-xs text-indigo-600">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-indigo-700">{stats.totalCompleted || 0}</div>
          <div className="text-xs text-indigo-600">Puzzles Solved</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-indigo-700">{stats.completionRate || 0}%</div>
          <div className="text-xs text-indigo-600">Success Rate</div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;