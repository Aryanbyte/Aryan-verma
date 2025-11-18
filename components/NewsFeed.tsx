import React, { useEffect, useState } from 'react';
import { fetchCricketNews } from '../services/geminiService';
import { NewsResponse } from '../types';
import { Loader2, ExternalLink, Newspaper } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchCricketNews();
        setNews(data);
      } catch (err) {
        setError("Unable to load live news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Scouring the web for live cricket updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-700">
          <Newspaper size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cricket Pulse</h1>
          <p className="text-slate-500">Real-time insights grounded by Google Search</p>
        </div>
      </header>

      {news && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="prose prose-slate max-w-none">
                  {/* Simple rendering of the text with whitespace preservation */}
                  {news.text.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && <p key={idx} className="mb-4 leading-relaxed text-slate-700">{paragraph}</p>
                  ))}
               </div>
            </div>
          </div>

          {/* Sources / Grounding Chips */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 sticky top-24">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <ExternalLink size={16} />
                Sources
              </h3>
              
              {news.groundingChunks && news.groundingChunks.length > 0 ? (
                <ul className="space-y-3">
                  {news.groundingChunks.map((chunk, idx) => {
                     // Sometimes grounding chunks might be empty or differently structured depending on the query type
                     // We safely access web.uri
                     if (!chunk.web?.uri) return null;
                     return (
                      <li key={idx}>
                        <a 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group"
                        >
                          <div className="text-sm font-medium text-slate-800 group-hover:text-emerald-700 truncate">
                            {chunk.web.title || "Web Source"}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 truncate">
                            {new URL(chunk.web.uri).hostname}
                          </div>
                        </a>
                      </li>
                     );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-400 italic">No direct source links returned.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};