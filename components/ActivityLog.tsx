import React, { useState } from 'react';
import { Activity, ActivityType, ContentStrategy } from '../types';
import { GitCommit, Tag, CheckSquare, Square, Wand2, Filter, MoreHorizontal, Sparkles } from 'lucide-react';

interface ActivityLogProps {
  activities: Activity[];
  onGenerateDraft: (selectedIds: string[], strategy: ContentStrategy) => void;
  onToggleSelection: (id: string) => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities, onGenerateDraft, onToggleSelection }) => {
  const selectedCount = activities.filter(a => a.selected).length;
  const [strategy, setStrategy] = useState<ContentStrategy>(ContentStrategy.BUILD_IN_PUBLIC);

  const TypeBadge = ({ type }: { type: ActivityType }) => {
    let colors = "";
    switch(type) {
        case 'feature': colors = "bg-purple-500/10 text-purple-400 border-purple-500/20"; break;
        case 'fix': colors = "bg-red-500/10 text-red-400 border-red-500/20"; break;
        case 'chore': colors = "bg-gray-500/10 text-gray-400 border-gray-500/20"; break;
        default: colors = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
    
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wide ${colors}`}>
            {type}
        </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F12]">
      {/* Header / Actions */}
      <div className="h-16 border-b border-[#262A33] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Logs</h2>
            <div className="flex bg-[#1A1D23] rounded-md p-1 border border-[#262A33]">
                <button className="px-3 py-1 text-xs font-medium bg-[#262A33] text-white rounded shadow-sm">New</button>
                <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-300">Linked</button>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-[#1A1D23] px-2 py-1.5 rounded-md border border-[#262A33]">
                <Sparkles size={14} className="text-purple-400" />
                <select 
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value as ContentStrategy)}
                    className="bg-transparent text-xs text-gray-200 outline-none border-none cursor-pointer pr-2"
                >
                    <option value={ContentStrategy.BUILD_IN_PUBLIC}>Build in Public Mode</option>
                    <option value={ContentStrategy.STANDARD_UPDATE}>Standard Update</option>
                </select>
            </div>

            <div className="w-[1px] h-6 bg-[#262A33] mx-1"></div>
            
            <button 
                disabled={selectedCount === 0}
                onClick={() => onGenerateDraft(activities.filter(a => a.selected).map(a => a.id), strategy)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedCount > 0 
                    ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-[#1A1D23] text-gray-600 cursor-not-allowed'
                }`}
            >
                <Wand2 size={14} />
                {selectedCount > 0 ? `Draft Post (${selectedCount})` : 'Select logs'}
            </button>
        </div>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto p-6">
        {activities.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <p>No logs found. Import from Git to get started.</p>
            </div>
        ) : (
            <div className="space-y-1">
                {activities.map((activity, index) => {
                    // Date Separator logic
                    const showDate = index === 0 || activities[index - 1].date !== activity.date;
                    
                    return (
                        <div key={activity.id}>
                            {showDate && (
                                <div className="mt-6 mb-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {activity.date}
                                </div>
                            )}
                            <div 
                                onClick={() => onToggleSelection(activity.id)}
                                className={`group flex items-center gap-4 p-3 rounded-lg border border-transparent transition-all cursor-pointer ${
                                    activity.selected ? 'bg-[#1A1D23] border-[#3B82F6]/30' : 'hover:bg-[#1A1D23] hover:border-[#262A33]'
                                }`}
                            >
                                <button className="text-gray-600 hover:text-[#3B82F6] transition-colors">
                                    {activity.selected ? <CheckSquare size={18} className="text-[#3B82F6]" /> : <Square size={18} />}
                                </button>
                                
                                <div className="p-2 bg-[#0B0F12] border border-[#262A33] rounded-md">
                                    <GitCommit size={16} className="text-gray-400" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm text-gray-200 font-medium line-clamp-1">{activity.description}</span>
                                        <span className="text-xs text-gray-600 flex items-center gap-1">
                                            <GitCommit size={10} /> {activity.id.substring(0, 7)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TypeBadge type={activity.type} />
                                        <span className="text-[10px] text-gray-500">{activity.repoOrProject}</span>
                                    </div>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                     <button className="p-1.5 hover:bg-[#262A33] rounded text-gray-400"><Tag size={14} /></button>
                                     <button className="p-1.5 hover:bg-[#262A33] rounded text-gray-400"><MoreHorizontal size={14} /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};