'use client';

import { useState } from 'react';

interface IntentResult {
  hiring?: number;
  collaboration?: number;
  learning?: number;
  business?: number;
}

export default function IntentClassifier() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<IntentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/act', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Classification failed');
      }

      const data = await response.json();
      if (data.code === 0) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('Classification error:', error);
      alert('分类失败,请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      hiring: '招聘意图',
      collaboration: '合作意图',
      learning: '学习意图',
      business: '商业意图',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      hiring: 'from-green-600 to-emerald-600',
      collaboration: 'from-blue-600 to-cyan-600',
      learning: 'from-purple-600 to-pink-600',
      business: 'from-orange-600 to-red-600',
    };
    return colors[category] || 'from-gray-600 to-gray-600';
  };

  const getPercentage = (value: number) => {
    return Math.round(value * 100);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-purple-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        意图分类器
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            输入要分析的文本
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例如: 我们正在寻找有经验的前端开发工程师加入团队..."
            className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={4}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleClassify}
          disabled={loading || !text.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
        >
          {loading ? '分析中...' : '分析意图'}
        </button>

        {result && (
          <div className="space-y-3 mt-6">
            <h3 className="text-sm font-medium text-slate-300 mb-3">分类结果</h3>
            {Object.entries(result).map(([category, value]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{getCategoryLabel(category)}</span>
                  <span className="text-white font-semibold">
                    {getPercentage(value)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getCategoryColor(
                      category
                    )} transition-all duration-500 rounded-full`}
                    style={{ width: `${getPercentage(value)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
