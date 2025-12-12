import React from 'react';
import { LayoutDashboard, FileText, Calendar, CheckCircle, Settings, Play, CloudLightning, List, ChevronDown, User, Layers, Bell } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onImport: () => void;
  notificationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onImport, notificationCount }) => {
  const coreItems = [
    { id: Tab.LOGS, label: 'Logs', icon: List },
    { id: Tab.DRAFTS, label: 'Drafts', icon: FileText },
  ];

  const publishItems = [
    { id: Tab.SCHEDULED, label: 'Scheduled', icon: Calendar },
    { id: Tab.POSTED, label: 'Posted', icon: CheckCircle },
    { id: Tab.ANALYTICS, label: 'Analytics', icon: LayoutDashboard },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;
    return (
      <button
        onClick={() => onTabChange(item.id)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
          isActive 
            ? 'bg-[#1A1D23] text-white font-medium' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]/50'
        }`}
      >
        <Icon size={16} className={isActive ? 'text-[#3B82F6]' : ''} />
        {item.label}
      </button>
    );
  };

  return (
    <div className="w-64 bg-[#0F1115] border-r border-[#262A33] flex flex-col h-screen fixed left-0 top-0 font-inter">
      {/* Organization Switcher (Competitor Style) */}
      <div className="p-4 border-b border-[#262A33]">
        <div className="w-full flex items-center justify-between hover:bg-[#1A1D23] p-2 rounded-lg transition-colors group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-200">MicroSaaS Space</div>
              <div className="text-[10px] text-gray-500">Free Plan</div>
            </div>
          </div>
          <ChevronDown size={14} className="text-gray-500 group-hover:text-gray-300" />
        </div>
        
        {/* Notification Bell Area */}
        {notificationCount > 0 && (
           <div className="mt-4 bg-[#1A1D23] rounded-md p-3 border border-[#262A33] flex items-start gap-3 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]"></div>
              <Bell size={16} className="text-[#10B981] mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-gray-200">{notificationCount} New Trend{notificationCount > 1 ? 's' : ''}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Gemini detected new opportunities.</div>
              </div>
           </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        
        {/* Core Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase font-bold text-gray-600 tracking-wider">Core</div>
          <div className="space-y-0.5">
            {coreItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>
        </div>

        {/* Publish Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase font-bold text-gray-600 tracking-wider">Publish</div>
          <div className="space-y-0.5">
            {publishItems.map(item => <NavItem key={item.id} item={item} />)}
          </div>
        </div>

        {/* Settings Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase font-bold text-gray-600 tracking-wider">Configuration</div>
          <div className="space-y-0.5">
            <button
              onClick={() => onTabChange(Tab.INTEGRATIONS)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all ${
                activeTab === Tab.INTEGRATIONS 
                  ? 'bg-[#1A1D23] text-white font-medium' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]/50'
              }`}
            >
              <CloudLightning size={16} />
              Integrations
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]/50 transition-all">
              <User size={16} />
              Audience
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-[#1A1D23]/50 transition-all">
              <Layers size={16} />
              Product Areas
            </button>
          </div>
        </div>
      </div>

      {/* Import Action (Moved to bottom for easy access) */}
      <div className="p-4 border-t border-[#262A33]">
        <button 
          onClick={onImport}
          className="w-full bg-[#1A1D23] hover:bg-[#262A33] border border-[#262A33] text-gray-200 py-2 rounded-md flex items-center justify-center gap-2 transition-all text-sm font-medium"
        >
          <CloudLightning size={14} className="text-[#3B82F6]" />
          Import Logs
        </button>
      </div>
    </div>
  );
};