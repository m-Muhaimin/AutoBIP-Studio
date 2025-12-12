import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, FileText, Calendar, CheckCircle, Settings, Play, CloudLightning, List, ChevronDown, User, Layers, Bell, Linkedin, LogOut, Plus, Users, Check } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onImport: () => void;
  notificationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onImport, notificationCount }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const coreItems = [
    { id: Tab.LOGS, label: 'Logs', icon: List },
    { id: Tab.DRAFTS, label: 'Drafts', icon: FileText },
  ];

  const publishItems = [
    { id: Tab.SCHEDULED, label: 'Scheduled', icon: Calendar },
    { id: Tab.POSTED, label: 'Posted', icon: CheckCircle },
    { id: Tab.ANALYTICS, label: 'Analytics', icon: LayoutDashboard },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
    <div className="w-64 bg-[#0F1115] border-r border-[#262A33] flex flex-col h-screen fixed left-0 top-0 font-inter z-20">
      {/* Organization Switcher (Competitor Style) */}
      <div className="p-4 border-b border-[#262A33] relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${isDropdownOpen ? 'bg-[#1A1D23]' : 'hover:bg-[#1A1D23]'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-900/20">
              M
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-200">MicroSaaS Space</div>
              <div className="text-[10px] text-gray-500">Early Access</div>
            </div>
          </div>
          <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-2 bg-[#1A1D23] border border-[#262A33] rounded-xl shadow-2xl shadow-black/50 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                <div className="px-2 py-2 mb-1 border-b border-[#262A33]">
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Workspace</div>
                    <div className="flex items-center gap-2 p-1.5 rounded bg-[#0B0F12] border border-[#262A33]">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[8px]">M</div>
                         <span className="text-xs font-medium text-gray-200">MicroSaaS Space</span>
                         <Check size={12} className="text-[#3B82F6] ml-auto" />
                    </div>
                </div>

                 <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#262A33] transition-colors">
                    <Settings size={14} /> Settings
                </button>
                 <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#262A33] transition-colors">
                    <Users size={14} /> Invite members
                </button>
                
                <div className="my-1 border-t border-[#262A33]"></div>
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Handle LinkedIn Connect Logic here
                    onTabChange(Tab.INTEGRATIONS);
                  }}
                  className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors font-medium"
                >
                    <Linkedin size={14} /> Connect LinkedIn
                </button>

                 <div className="my-1 border-t border-[#262A33]"></div>

                <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-[#262A33] transition-colors">
                    <Plus size={14} /> Add workspace
                </button>
                 <button className="w-full text-left flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut size={14} /> Log out
                </button>
            </div>
        )}

        {/* Notification Bell Area */}
        {notificationCount > 0 && !isDropdownOpen && (
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