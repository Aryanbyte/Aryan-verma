
import React, { useState } from 'react';
import { fetchPlayerProfile } from '../services/geminiService';
import { PlayerProfileData } from '../types';
import { Search, Award, Users, Trophy, Loader2, AlertCircle, TrendingUp, BarChart2 } from 'lucide-react';

export const PlayerProfile: React.FC = () => {
  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState<PlayerProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const data = await fetchPlayerProfile(query);
      setProfile(data);
    } catch (err) {
      setError("Player not found. Please try a specific name (e.g., 'Sachin Tendulkar').");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Player Encyclopedia</h2>
        <p className="text-slate-500">Comprehensive AI-generated profiles with real-time form analysis</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter player name (e.g. Virat Kohli)"
            className="w-full pl-5 pr-14 py-4 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-4 rounded-lg max-w-md mx-auto mb-8">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Card */}
      {profile && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{profile.name}</h1>
                <div className="flex flex-wrap gap-3 text-sm font-medium uppercase tracking-wider">
                  <span className="bg-white/20 px-3 py-1 rounded-full border border-white/10">{profile.country}</span>
                  <span className="bg-emerald-500 text-emerald-950 px-3 py-1 rounded-full">{profile.role}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Left Column: Bio, Teams, Personal */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Profile</h3>
                <div className="space-y-4">
                   <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Batting Style</div>
                      <div className="font-semibold text-slate-800">{profile.battingStyle || 'N/A'}</div>
                   </div>
                   <div>
                      <div className="text-xs text-slate-500 uppercase mb-1">Bowling Style</div>
                      <div className="font-semibold text-slate-800">{profile.bowlingStyle || 'N/A'}</div>
                   </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Users size={14} /> Teams
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {profile.majorTeams?.map((team, i) => (
                        <span key={i} className="text-xs font-medium bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-700 shadow-sm">
                            {team}
                        </span>
                    ))}
                 </div>
              </div>

               <div className="prose prose-slate prose-sm">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <Users className="text-blue-500" size={20} /> Bio
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
               </div>
            </div>

            {/* Middle/Right: Stats & Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Statistics */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart2 className="text-emerald-600" size={24} />
                  Career Statistics
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Batting Stats */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-semibold text-slate-700 text-sm">Batting</div>
                    <div className="p-4 grid grid-cols-2 gap-y-4">
                      <div>
                        <div className="text-xs text-slate-400">Matches</div>
                        <div className="text-lg font-bold text-slate-800">{profile.battingStats?.matches || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Runs</div>
                        <div className="text-lg font-bold text-slate-800">{profile.battingStats?.runs || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Average</div>
                        <div className="text-lg font-bold text-slate-800">{profile.battingStats?.average || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Strike Rate</div>
                        <div className="text-lg font-bold text-slate-800">{profile.battingStats?.strikeRate || '-'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Bowling Stats */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-semibold text-slate-700 text-sm">Bowling</div>
                    <div className="p-4 grid grid-cols-2 gap-y-4">
                       <div>
                        <div className="text-xs text-slate-400">Matches</div>
                        <div className="text-lg font-bold text-slate-800">{profile.bowlingStats?.matches || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Wickets</div>
                        <div className="text-lg font-bold text-slate-800">{profile.bowlingStats?.wickets || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Average</div>
                        <div className="text-lg font-bold text-slate-800">{profile.bowlingStats?.average || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Economy</div>
                        <div className="text-lg font-bold text-slate-800">{profile.bowlingStats?.economy || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Form */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Recent Form
                </h3>
                <p className="text-amber-900/80 leading-relaxed">
                  {profile.recentForm}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Award className="text-purple-500" size={24} />
                    Career Highlights
                </h3>
                <div className="grid gap-3">
                  {profile.careerHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-slate-700 font-medium pt-1">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
