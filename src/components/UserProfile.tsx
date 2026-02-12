'use client';

import { useEffect, useState } from 'react';

interface UserInfo {
  user_id: string;
  nickname: string;
  avatar: string;
}

interface Shade {
  name: string;
  description?: string;
  color?: string;
}

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [shades, setShades] = useState<Shade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user info
      const infoResponse = await fetch('/api/user/info');
      const infoData = await infoResponse.json();
      if (infoData.code === 0) {
        setUserInfo(infoData.data);
      }

      // Fetch user shades
      const shadesResponse = await fetch('/api/user/shades');
      const shadesData = await shadesResponse.json();
      if (shadesData.code === 0) {
        setShades(shadesData.data.shades || []);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-slate-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-slate-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
      <div className="flex items-center gap-4 mb-6">
        {userInfo?.avatar && (
          <img
            src={userInfo.avatar}
            alt={userInfo.nickname}
            className="w-20 h-20 rounded-full border-4 border-purple-500/50 shadow-lg"
          />
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">
            {userInfo?.nickname || '未知用户'}
          </h2>
          <p className="text-slate-400 text-sm">
            用户ID: {userInfo?.user_id || 'N/A'}
          </p>
        </div>
      </div>

      {shades.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            我的兴趣领域
          </h3>
          <div className="flex flex-wrap gap-2">
            {shades.map((shade, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 hover:from-blue-600/50 hover:to-purple-600/50 text-white rounded-full text-sm border border-blue-500/30 hover:border-purple-500/50 transition-all duration-300 cursor-default"
              >
                {shade.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
