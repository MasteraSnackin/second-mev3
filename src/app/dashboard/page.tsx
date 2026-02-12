import { redirect } from 'next/navigation';
import { getCurrentUser, clearUserSession } from '@/lib/auth';
import UserProfile from '@/components/UserProfile';
import ChatWindow from '@/components/ChatWindow';
import MessageDrafter from '@/components/MessageDrafter';
import IntentClassifier from '@/components/IntentClassifier';

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  async function handleLogout() {
    'use server';
    await clearUserSession();
    redirect('/');
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SocialLinker 仪表盘
            </h1>
            <p className="text-slate-400 mt-2">
              欢迎回来, {user.nickname || '用户'}
            </p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              退出登录
            </button>
          </form>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile and Tools */}
          <div className="space-y-6">
            <UserProfile />
            <MessageDrafter />
            <IntentClassifier />
          </div>

          {/* Right Column - Chat Window */}
          <div className="lg:col-span-2">
            <ChatWindow />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© 2024 SocialLinker. Powered by SecondMe</p>
        </div>
      </div>
    </div>
  );
}
