
import React, { useEffect, useState } from 'react';
import { fetchMatchData, fetchStandings } from '../services/geminiService';
import { MatchData, MatchInfo, TeamStanding } from '../types';
import { Calendar, Radio, CheckCircle2, Trophy, Loader2, RefreshCw, ArrowUpDown } from 'lucide-react';

type TabType = 'live' | 'upcoming' | 'recent' | 'standings';

export const MatchCenter: React.FC = () => {
  const [data, setData] = useState<MatchData | null>(null);
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('live');

  // Sort config
  const [sortConfig, setSortConfig] = useState<{ key: keyof TeamStanding; direction: 'asc' | 'desc' } | null>({ key: 'rank', direction: 'asc' });

  const loadMatches = async () => {
    setLoading(true);
    try {
      const matchData = await fetchMatchData();
      setData(matchData);
      // Auto-select tab based on content availability if currently on a match tab
      if (activeTab !== 'standings') {
        if (matchData.live.length > 0) setActiveTab('live');
        else if (matchData.upcoming.length > 0) setActiveTab('upcoming');
        else setActiveTab('recent');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStandings = async () => {
    if (standings.length > 0) return; // Cache simple
    setLoadingStandings(true);
    try {
      const data = await fetchStandings();
      setStandings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStandings(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    if (activeTab === 'standings') {
      loadStandings();
    }
  }, [activeTab]);

  const handleSort = (key: keyof TeamStanding) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedStandings = () => {
    if (!sortConfig) return standings;
    return [...standings].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedStandings = getSortedStandings();

  const renderMatchList = (matches: MatchInfo[]) => {
    if (!matches?.length) {
      return (
        <div className="text-center py-12 text-slate-400">
          <p>No matches found in this category.</p>
        </div>
      );
    }
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                ${match.status.toLowerCase().includes('live') ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-500'}
              `}>
                {match.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">{match.date}</span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span>{match.team1}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-slate-800">
                <span>{match.team2}</span>
              </div>
            </div>
            <div className="text-sm text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
              {match.score || match.result || "Match scheduled"}
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
              <span className="truncate">{match.venue}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Match Center</h2>
          <p className="text-slate-500">Global cricket schedule & results</p>
        </div>
        <button 
          onClick={loadMatches} 
          className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all"
          title="Refresh"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
        {[
          { id: 'live', label: 'Live', icon: <Radio size={16} /> },
          { id: 'upcoming', label: 'Upcoming', icon: <Calendar size={16} /> },
          { id: 'recent', label: 'Recent', icon: <CheckCircle2 size={16} /> },
          { id: 'standings', label: 'Standings', icon: <Trophy size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.id 
                ? 'bg-emerald-100 text-emerald-800 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'standings' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           {loadingStandings ? (
             <div className="flex justify-center py-12 text-slate-400"><Loader2 className="animate-spin" /></div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                   <tr>
                     {[
                       { k: 'rank', l: '#' },
                       { k: 'team', l: 'Team' },
                       { k: 'played', l: 'P' },
                       { k: 'won', l: 'W' },
                       { k: 'lost', l: 'L' },
                       { k: 'nrr', l: 'NRR' },
                       { k: 'points', l: 'Pts' }
                     ].map((col) => (
                       <th 
                        key={col.k} 
                        className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => handleSort(col.k as keyof TeamStanding)}
                       >
                         <div className="flex items-center gap-1">
                           {col.l}
                           {sortConfig?.key === col.k && <ArrowUpDown size={12} className="text-emerald-500" />}
                         </div>
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {sortedStandings.map((team) => (
                     <tr key={team.team} className="hover:bg-slate-50 transition-colors">
                       <td className="px-4 py-3 font-bold text-slate-700">{team.rank}</td>
                       <td className="px-4 py-3 font-medium text-slate-800">{team.team}</td>
                       <td className="px-4 py-3 text-slate-600">{team.played}</td>
                       <td className="px-4 py-3 text-green-600 font-medium">{team.won}</td>
                       <td className="px-4 py-3 text-red-500">{team.lost}</td>
                       <td className="px-4 py-3 text-slate-600">{team.nrr}</td>
                       <td className="px-4 py-3 font-bold text-emerald-700">{team.points}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {standings.length === 0 && !loadingStandings && (
                 <div className="p-8 text-center text-slate-500">No standings data found.</div>
               )}
             </div>
           )}
        </div>
      ) : (
        <div className="min-h-[300px]">
          {loading ? (
            <div className="flex justify-center py-12 text-slate-400"><Loader2 className="animate-spin" /></div>
          ) : (
            renderMatchList(data ? data[activeTab as keyof MatchData] as MatchInfo[] : [])
          )}
        </div>
      )}
    </div>
  );
};
