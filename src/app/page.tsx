import LoginButton from '@/components/LoginButton';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            SocialLinker
          </h1>
          <p className="text-2xl text-slate-300 mb-2">AI驱动的社交连接平台</p>
          <p className="text-lg text-slate-400">
            基于 SecondMe 智能技术,让社交连接更加智能和高效
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="text-blue-400 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">个人档案</h3>
            <p className="text-slate-400 text-sm">
              展示您的兴趣爱好和专业技能
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="text-purple-400 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">AI 聊天</h3>
            <p className="text-slate-400 text-sm">
              与智能助手进行自然对话
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="text-pink-400 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">消息起草</h3>
            <p className="text-slate-400 text-sm">
              AI辅助撰写专业消息
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="text-green-400 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">意图分类</h3>
            <p className="text-slate-400 text-sm">
              智能识别交流意图
            </p>
          </div>
        </div>

        {/* Login Button */}
        <div className="flex justify-center">
          <LoginButton />
        </div>

        {/* Footer */}
        <div className="mt-16 text-slate-500 text-sm">
          <p>Powered by SecondMe & Next.js</p>
        </div>
      </div>
    </div>
  );
}
