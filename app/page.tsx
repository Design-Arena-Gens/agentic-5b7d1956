'use client';

import { useState } from 'react';

interface ShortIdea {
  hookText: string;
  visualDescription: string;
  styleMood: string;
  onScreenText: string;
  loopMechanism: string;
  viralTriggers: string[];
}

export default function Home() {
  const [ideas, setIdeas] = useState<ShortIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const [customPrompt, setCustomPrompt] = useState('');

  const generateShorts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, customPrompt }),
      });

      const data = await response.json();
      setIdeas(data.ideas);
    } catch (error) {
      console.error('Error generating shorts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            🎬 VIRAL SHORTS GENERATOR
          </h1>
          <p className="text-xl text-gray-300">AI-Powered YouTube Shorts & TikTok Ideas</p>
        </div>

        {/* Controls */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-purple-300">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/50 border border-purple-500/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="general">🔥 General Viral</option>
                <option value="animals">🐶 Animals</option>
                <option value="brainrot">🧠 Brain Rot</option>
                <option value="horror">👻 Horror</option>
                <option value="motivation">💪 Motivation</option>
                <option value="satisfying">😌 Satisfying</option>
                <option value="memes">😂 Memes</option>
                <option value="kids">👶 Kids Content</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-purple-300">CUSTOM IDEA (OPTIONAL)</label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., cat does backflip"
                className="w-full bg-black/50 border border-purple-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <button
            onClick={generateShorts}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black text-xl py-4 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-pink-500/50"
          >
            {loading ? '⚡ GENERATING...' : '🚀 GENERATE 5 VIRAL SHORTS'}
          </button>
        </div>

        {/* Results */}
        {ideas.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30 hover:border-pink-500/50 transition-all transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black px-4 py-2 rounded-full text-sm">
                    IDEA #{index + 1}
                  </div>
                  <div className="flex gap-2">
                    {idea.viralTriggers.map((trigger, i) => (
                      <span
                        key={i}
                        className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/50"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-3xl font-black mb-4 text-white">
                  {idea.hookText}
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-bold text-purple-300 mb-1">VISUAL:</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{idea.visualDescription}</p>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-pink-300 mb-1">STYLE & MOOD:</div>
                    <p className="text-sm text-gray-300">{idea.styleMood}</p>
                  </div>

                  {idea.onScreenText && (
                    <div>
                      <div className="text-xs font-bold text-cyan-300 mb-1">ON-SCREEN TEXT:</div>
                      <p className="text-sm text-white font-bold">{idea.onScreenText}</p>
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-yellow-300 mb-1">LOOP MECHANISM:</div>
                    <p className="text-sm text-gray-300">{idea.loopMechanism}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {ideas.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-20">
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-xl">Generate your first viral Shorts ideas!</p>
          </div>
        )}
      </div>
    </div>
  );
}
