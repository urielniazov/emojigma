import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, fetchUserPosition } from '../services/apiService';
import { getDeviceId } from '../utils/deviceUtils';
import { X, Clock } from 'lucide-react';


const LeaderboardModal = ({ isOpen, onClose }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const deviceId = getDeviceId();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);

        // Fetch leaderboard data
        const { leaderboard } = await fetchLeaderboard();
        setLeaderboard(leaderboard);

        // Fetch user's position
        if (deviceId) {
          const { position } = await fetchUserPosition(deviceId);
          setUserPosition(position);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        setError('Failed to load leaderboard data');
        setLoading(false);
      }
    };

    if (isOpen) {
      loadLeaderboard();
    }
    // Refresh every minute?
    // const intervalId = setInterval(loadLeaderboard, 60000);
    // return () => clearInterval(intervalId);
  }, [isOpen, deviceId]);

  if (!isOpen) return null;

  // Format time as mm:ss
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Today's Leaderboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-3"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
              <button
                onClick={() => setLoading(true)}
                className="mt-2 text-indigo-600 hover:text-indigo-800"
              >
                Try again
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No one has solved today's puzzle yet.</p>
              <p className="mt-1">Be the first to make the leaderboard!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Player</th>
                  <th className="p-2 text-center">Attempts</th>
                  <th className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Clock size={16} />
                      <span>Time</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`border-t ${entry.device_id === deviceId ? 'bg-indigo-50 font-medium' : ''}`}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">
                      {entry.device_id === deviceId ? 'You' : `Player ${index+1}`}
                    </td>
                    <td className="p-2 text-center">{entry.attempts_count}</td>
                    <td className="p-2 text-right">{formatTime(entry.time_to_solve)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t text-center text-gray-600 text-sm">
          {userPosition && !userPosition.onLeaderboard && userPosition.position && <span className="mb-1">  You're Possition is <b>#{userPosition.position}</b>.</span>}
          <span className="flex items-center justify-center gap-1">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Coming Soon</span>
            Sign in to customize your display name and save your progress across devices.

          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;