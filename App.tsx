
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NewsFeed } from './components/NewsFeed';
import { PlayerProfile } from './components/PlayerProfile';
import { ChatAnalyst } from './components/ChatAnalyst';
import { MatchCenter } from './components/MatchCenter';
import { Activity, User, MessageSquare, Info, Calendar } from 'lucide-react';

// Simple view router state
export type ViewState = 'news' | 'matches' | 'player' | 'chat' | 'about';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('news');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {currentView === 'news' && <NewsFeed />}
        {currentView === 'matches' && <MatchCenter />}
        {currentView === 'player' && <PlayerProfile />}
        {currentView === 'chat' && <ChatAnalyst />}
        {currentView === 'about' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <Info size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">About CricAI Pulse</h2>
            <p className="text-slate-600 leading-relaxed">
              CricAI Pulse leverages the power of Google's Gemini API to bring you a next-generation cricket experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-8">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                  <Activity className="text-emerald-500" size={20} />
                  <span>Live Grounding</span>
                </div>
                <p className="text-sm text-slate-500">Real-time news and match updates fetched via Google Search.</p>
              </div>
               <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                  <Calendar className="text-orange-500" size={20} />
                  <span>Match Center</span>
                </div>
                <p className="text-sm text-slate-500">Live scores, schedules, and results.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                  <User className="text-blue-500" size={20} />
                  <span>Player Intel</span>
                </div>
                <p className="text-sm text-slate-500">Deep-dive profiles generated on demand.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
                  <MessageSquare className="text-purple-500" size={20} />
                  <span>AI Analyst</span>
                </div>
                <p className="text-sm text-slate-500">Chat with an AI trained on cricket strategy and history.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CricAI Pulse. Powered by Gemini 2.5.</p>
        </div>
      </footer>
    </div>
  );
}
