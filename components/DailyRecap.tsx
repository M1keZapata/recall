import React, { useState } from 'react';
import { Bookmark, ConnectionInsight } from '../types';
import { findConnections } from '../services/gemini';
import { SparklesIcon, LockIcon, BoltIcon } from './ui/Icons';

interface DailyRecapProps {
  bookmarks: Bookmark[];
}

const DailyRecap: React.FC<DailyRecapProps> = ({ bookmarks }) => {
  const [insights, setInsights] = useState<ConnectionInsight[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [isPro, setIsPro] = useState(false); // Mock pro state
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'quarter'>('week');

  const handleGenerateRecap = async () => {
    if (bookmarks.length === 0) return;
    setLoading(true);
    try {
      const result = await findConnections(bookmarks);
      setSummary(result.summary);
      setInsights(result.insights);
      setHasRun(true);
    } catch (e) {
      console.error(e);
      setSummary("Could not generate recap at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockPro = () => {
    setIsPro(true);
  };

  // Count items from "yesterday" (mock logic: just use length or random number for demo)
  const yesterdayCount = bookmarks.length;

  // Mock percentage change based on time period (in real app, this would be calculated from actual data)
  const getPercentageChange = () => {
    const changes = {
      week: 12,
      month: -8,
      quarter: 25
    };
    return changes[timePeriod];
  };

  const percentageChange = getPercentageChange();
  const isPositive = percentageChange > 0;

  return (
    <div className="mt-8 mb-16">
      {/* Bento Box Widget */}
      <div className="glass-card p-0 overflow-hidden flex flex-col md:flex-row h-auto md:h-72 mb-8 border-0 shadow-2xl">
        {/* Left: Profile Picture */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative p-3">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white font-bold text-3xl mb-1">Welcome back</h3>
              <p className="text-slate-300 text-base font-medium">Ready to recall your day?</p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-5">

          {/* Created Yesterday Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-[#1e1e28] border border-white/5 p-5 transition-all duration-300 hover:border-orange-500/30 hover:bg-[#252530] hover:shadow-lg hover:shadow-orange-500/5">
            {/* Orange gradient overlay in top-left corner */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-br-full pointer-events-none"></div>

            {/* Header with dropdown */}
            <div className="relative flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Created Yesterday</span>
              </div>

              {/* Time Period Dropdown */}
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value as 'week' | 'month' | 'quarter')}
                className="text-xs bg-white/5 text-slate-400 border border-white/10 rounded-lg px-2 py-1 cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            {/* Count and Percentage */}
            <div className="relative flex items-end justify-between">
              <span className="text-5xl font-bold text-white group-hover:text-orange-400 transition-colors">{yesterdayCount}</span>

              {/* Large Percentage Change */}
              <div className={`text-3xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{percentageChange}%
              </div>
            </div>

            <p className="relative text-slate-400 text-sm font-medium mt-3 group-hover:text-slate-300 transition-colors">
              {isPositive ? 'Increase' : 'Decrease'} from last {timePeriod}
            </p>
          </div>

          {/* Recap Button */}
          <button
            onClick={handleGenerateRecap}
            disabled={loading}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-red-600 p-1 text-left transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-orange-900/20"
          >
            <div className="bg-black/10 backdrop-blur-sm h-full w-full rounded-[14px] p-5 flex items-center justify-between group-hover:bg-transparent transition-colors">
              <div>
                <span className="text-orange-100 text-xs font-bold uppercase tracking-wider block mb-2 opacity-80">Daily Recap</span>
                <p className="text-white font-bold text-xl">
                  {loading ? 'Connecting dots...' : 'Generate Insights'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/20 group-hover:bg-white group-hover:text-orange-600 transition-all">
                <SparklesIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasRun && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Main Summary */}
          <div className="gradient-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="relative flex items-start gap-5">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/20">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-white">Daily Digest</h3>
                <p className="leading-relaxed text-slate-200 text-base">{summary}</p>
              </div>
            </div>
          </div>

          {/* Connections / Insights */}
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Discovered Connections</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>
            </div>

            <div className="grid gap-5">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`glass-card p-6 transition-all ${!isPro && idx > 0 ? 'blur-sm select-none opacity-40' : ''}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex gap-3 mb-3">
                    <span className="badge text-[10px] px-2.5 py-1">INSIGHT</span>
                  </div>
                  <h4 className="font-bold text-white text-xl mb-2">{insight.title}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{insight.description}</p>

                  <div className="mt-4 flex gap-2">
                    {insight.relatedBookmarkIds.map(id => {
                      const bm = bookmarks.find(b => b.id === id);
                      if (!bm) return null;
                      return (
                        <div
                          key={id}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 overflow-hidden border-2 border-white/20 shadow-lg"
                          title={bm.title}
                        >
                          {bm.mediaData ? (
                            <img src={`data:${bm.mediaType}/jpeg;base64,${bm.mediaData}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-600 to-red-600"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Paywall Overlay */}
            {!isPro && insights.length > 1 && (
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center justify-end pb-8 z-10 backdrop-blur-sm">
                <div className="glass-card p-8 text-center max-w-md mx-4 border-2 border-orange-500/30">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
                    <LockIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-white">Unlock Deep Analysis</h4>
                  <p className="text-slate-300 text-sm mb-5">Gemini found {insights.length - 1} more complex connections between your bookmarks.</p>
                  <button
                    onClick={handleUnlockPro}
                    className="btn-primary w-full"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRecap;
