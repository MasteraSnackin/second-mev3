'use client';

import { useState } from 'react';

export default function MessageDrafter() {
  const [context, setContext] = useState('');
  const [draftedMessage, setDraftedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDraft = async () => {
    if (!context.trim() || loading) return;

    setLoading(true);
    setDraftedMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `请帮我起草一条消息,背景如下:\n${context}\n\n请直接给出消息内容,不需要额外解释。`,
        }),
      });

      if (!response.ok) {
        throw new Error('Draft request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let message = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.chunk) {
              message += data.chunk;
              setDraftedMessage(message);
            }

            if (data.error) {
              console.error('Streaming error:', data.error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Draft error:', error);
      setDraftedMessage('抱歉,起草消息失败。请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draftedMessage);
    alert('已复制到剪贴板!');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-purple-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        消息起草助手
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            描述消息背景或目的
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="例如: 我想邀请某人参加下周的技术分享会..."
            className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleDraft}
          disabled={loading || !context.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? '正在起草...' : '生成消息'}
        </button>

        {draftedMessage && (
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              生成的消息
            </label>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-white whitespace-pre-wrap">{draftedMessage}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="absolute top-0 right-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              复制
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
