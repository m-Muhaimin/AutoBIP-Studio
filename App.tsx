import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { ImportWizard } from './components/ImportWizard'; 
import { ActivityLog } from './components/ActivityLog';
import { NotificationToast } from './components/NotificationToast';
import { Analytics } from './components/Analytics';
import { Tab, Draft, PostTone, Activity, ContentStrategy, Notification } from './types';
import { generateDraftFromActivity, findTrendsAndGenerateDraft, detectIndustryTrends } from './services/geminiService';
import { Search, Github, Trello, CreditCard, Rss, Loader2, FileText, Calendar, CheckCircle } from 'lucide-react';

// Integrations Component
const IntegrationsView: React.FC = () => (
  <div className="flex-1 bg-[#0B0F12] p-8 overflow-y-auto">
    <h2 className="text-2xl font-bold text-white mb-6">Integration Hub</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#1A1D23] border border-[#262A33] p-6 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#262A33] rounded-lg">
            <Github className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">GitHub</h3>
            <p className="text-sm text-[#10B981]">Connected • Syncing hourly</p>
          </div>
        </div>
        <button className="text-xs border border-[#262A33] text-gray-400 px-3 py-1 rounded hover:bg-[#262A33]">Configure</button>
      </div>
      
      <div className="bg-[#1A1D23] border border-[#262A33] p-6 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#262A33] rounded-lg">
            <Trello className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Jira / Linear</h3>
            <p className="text-sm text-[#10B981]">Connected • Syncing daily</p>
          </div>
        </div>
        <button className="text-xs border border-[#262A33] text-gray-400 px-3 py-1 rounded hover:bg-[#262A33]">Configure</button>
      </div>

       <div className="bg-[#1A1D23] border border-[#262A33] p-6 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#262A33] rounded-lg">
            <Rss className="text-orange-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Industry News</h3>
            <p className="text-sm text-[#10B981]">Active • 5 sources</p>
          </div>
        </div>
        <button className="text-xs border border-[#262A33] text-gray-400 px-3 py-1 rounded hover:bg-[#262A33]">Configure</button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LOGS);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isListVisible, setIsListVisible] = useState(true);

  // Raw Activities State
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', date: 'Sep 19', description: 'fix: update pnpm-lock.yaml to match package.json', type: 'fix', source: 'github', repoOrProject: 'frontend-core', selected: false },
    { id: '2', date: 'Sep 18', description: 'Rename KeedoStream to Skeedo Stream and update styles', type: 'chore', source: 'github', repoOrProject: 'frontend-core', selected: false },
    { id: '3', date: 'Sep 17', description: 'Major checkpoint: UI/branding overhaul, Garet font, accent color', type: 'feature', source: 'github', repoOrProject: 'design-system', selected: false },
  ]);

  // Effect to simulate background trend detection
  useEffect(() => {
    const timer = setTimeout(async () => {
        // Simulate a delay for "detection"
        const trends = await detectIndustryTrends("SaaS & Developer Tools");
        if (trends.length > 0) {
            setNotifications(prev => [...prev, ...trends]);
        }
    }, 5000); // Check 5 seconds after mount
    return () => clearTimeout(timer);
  }, []);

  const handleImportComplete = () => {
    setIsImportOpen(false);
    // Simulate finding new items
    const newItems: Activity[] = [
        { id: Math.random().toString(), date: 'Today', description: 'Added Stripe Webhook integration', type: 'feature', source: 'github', repoOrProject: 'backend-api', selected: false },
        { id: Math.random().toString(), date: 'Today', description: 'Fixed race condition in auth provider', type: 'fix', source: 'github', repoOrProject: 'frontend-core', selected: false }
    ];
    setActivities(prev => [...newItems, ...prev]);
    setActiveTab(Tab.LOGS);
  };

  const toggleActivitySelection = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const generateDraftFromLogs = async (selectedIds: string[], strategy: ContentStrategy) => {
    setIsGenerating(true);
    const selectedActivities = activities.filter(a => selectedIds.includes(a.id));
    const descriptions = selectedActivities.map(a => a.description);
    
    // Pass strategy to service
    const generated = await generateDraftFromActivity(descriptions, PostTone.HUMBLE_BUILDER, strategy);

    const newDraft: Draft = {
        id: Date.now().toString(),
        title: generated.title,
        source: selectedActivities.length > 1 ? `${selectedActivities.length} updates` : 'GitHub Activity',
        sourceIcon: 'github',
        content: [{ id: '1', content: generated.content, isMain: true }],
        status: 'draft',
        createdAt: new Date(),
        relatedActivities: selectedActivities
    };

    setDrafts(prev => [newDraft, ...prev]);
    setActiveDraftId(newDraft.id);
    setActiveTab(Tab.DRAFTS);
    setIsGenerating(false);
    
    // Clear selections
    setActivities(prev => prev.map(a => ({...a, selected: false})));
  };

  // Triggered by manual search button
  const handleResearchTrend = async () => {
    setIsResearching(true);
    const result = await findTrendsAndGenerateDraft("SaaS & AI");
    const newDraft: Draft = {
        id: Date.now().toString(),
        title: result.title,
        source: 'Trend Alert',
        sourceIcon: 'news',
        content: [{ id: '1', content: result.content + (result.url ? `\n\nSource: ${result.url}` : ''), isMain: true}],
        status: 'draft',
        createdAt: new Date()
    };
    setDrafts(prev => [newDraft, ...prev]);
    setActiveDraftId(newDraft.id);
    setIsResearching(false);
  };

  // Triggered by Notification click
  const handleNotificationAction = async (notif: Notification) => {
    setIsGenerating(true);
    // Remove notification
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    
    const result = await findTrendsAndGenerateDraft(notif.actionQuery);
     const newDraft: Draft = {
        id: Date.now().toString(),
        title: result.title,
        source: 'Trend Alert',
        sourceIcon: 'news',
        content: [{ id: '1', content: result.content + (result.url ? `\n\nSource: ${result.url}` : ''), isMain: true}],
        status: 'draft',
        createdAt: new Date()
    };
    setDrafts(prev => [newDraft, ...prev]);
    setActiveDraftId(newDraft.id);
    setActiveTab(Tab.DRAFTS);
    setIsGenerating(false);
  };

  const updateDraft = (updated: Draft) => {
    setDrafts(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const publishDraft = (id: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: 'posted' } : d));
    setActiveTab(Tab.POSTED);
    setActiveDraftId(null);
  };

  const getVisibleDrafts = () => {
    if (activeTab === Tab.DRAFTS) return drafts.filter(d => d.status === 'draft');
    if (activeTab === Tab.SCHEDULED) return drafts.filter(d => d.status === 'scheduled');
    if (activeTab === Tab.POSTED) return drafts.filter(d => d.status === 'posted');
    return [];
  };

  const activeDraft = drafts.find(d => d.id === activeDraftId) || null;

  return (
    <div className="flex h-screen bg-[#0B0F12] text-gray-200 font-inter relative">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onImport={() => setIsImportOpen(true)}
        notificationCount={notifications.length}
      />

      <div className="ml-64 flex-1 flex relative">
        {/* Loading Overlay for Generation */}
        {isGenerating && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
                <Loader2 size={40} className="text-[#3B82F6] animate-spin" />
                <p className="text-white font-medium">Ghostwriter is composing your post...</p>
            </div>
        )}

        {/* Main Content Area Switcher */}
        {activeTab === Tab.LOGS ? (
            <ActivityLog 
                activities={activities}
                onGenerateDraft={generateDraftFromLogs}
                onToggleSelection={toggleActivitySelection}
            />
        ) : activeTab === Tab.ANALYTICS ? (
          <Analytics />
        ) : activeTab === Tab.INTEGRATIONS ? (
          <IntegrationsView />
        ) : (
          <>
            {/* Split View for Drafts */}
            {isListVisible && (
              <div className="w-80 bg-[#0B0F12] border-r border-[#262A33] flex flex-col shrink-0">
                <div className="p-4 border-b border-[#262A33] flex justify-between items-center bg-[#0B0F12]">
                  <h2 className="font-semibold text-gray-200 capitalize flex items-center gap-2">
                      {activeTab === Tab.DRAFTS && <FileText size={16} className="text-gray-400" />}
                      {activeTab === Tab.SCHEDULED && <Calendar size={16} className="text-yellow-400" />}
                      {activeTab === Tab.POSTED && <CheckCircle size={16} className="text-green-400" />}
                      {activeTab.toLowerCase()}
                  </h2>
                  {activeTab === Tab.DRAFTS && (
                      <button 
                          onClick={handleResearchTrend} 
                          disabled={isResearching}
                          className="p-2 hover:bg-[#1A1D23] rounded-full text-[#3B82F6] transition-colors" 
                          title="Research Trends"
                      >
                          <Search size={16} className={isResearching ? 'animate-spin' : ''} />
                      </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {getVisibleDrafts().length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center justify-center h-40">
                          <div className="w-12 h-12 rounded-full bg-[#1A1D23] flex items-center justify-center mb-3">
                              <FileText size={20} className="text-gray-600" />
                          </div>
                          <p className="text-gray-500 text-sm">No {activeTab.toLowerCase()} found.</p>
                      </div>
                  ) : (
                      getVisibleDrafts().map(draft => {
                        const isTrend = draft.sourceIcon === 'news';
                        return (
                          <div 
                              key={draft.id}
                              onClick={() => setActiveDraftId(draft.id)}
                              className={`
                                  group p-4 border-b border-[#262A33] cursor-pointer transition-all relative
                                  ${activeDraftId === draft.id 
                                      ? 'bg-[#15171B] border-l-[3px] border-l-[#3B82F6]' 
                                      : 'hover:bg-[#15171B] border-l-[3px] border-l-transparent'}
                              `}
                          >
                              {isTrend ? (
                                <>
                                  <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-2">
                                          <Rss size={12} className="text-orange-400" />
                                          <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                                              TREND ALERT
                                          </span>
                                      </div>
                                      <span className="text-[10px] text-gray-500">
                                          {draft.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </span>
                                  </div>
                                  <h3 className={`text-sm font-semibold line-clamp-2 mb-1 ${activeDraftId === draft.id ? "text-white" : "text-gray-200"}`}>
                                      {draft.title || "Untitled Trend"}
                                  </h3>
                                  <p className={`text-xs line-clamp-2 ${activeDraftId === draft.id ? "text-gray-400" : "text-gray-500"}`}>
                                      {draft.content[0]?.content || "No content..."}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                          {draft.sourceIcon === 'github' && <Github size={12} className={activeDraftId === draft.id ? "text-gray-300" : "text-gray-500"} />}
                                          {draft.sourceIcon === 'linear' && <Trello size={12} className="text-blue-400" />}
                                          <span className={`text-[10px] uppercase font-bold tracking-wider ${activeDraftId === draft.id ? "text-gray-400" : "text-gray-600"}`}>
                                              {draft.source}
                                          </span>
                                      </div>
                                      <span className="text-[10px] text-gray-600">
                                          {draft.createdAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                      </span>
                                  </div>
                                  <h3 className={`text-sm font-medium line-clamp-1 mb-1 ${activeDraftId === draft.id ? "text-white" : "text-gray-300"}`}>
                                      {draft.title || "Untitled Draft"}
                                  </h3>
                                  <p className={`text-xs line-clamp-2 ${activeDraftId === draft.id ? "text-gray-400" : "text-gray-500"}`}>
                                      {draft.content[0]?.content || "No content..."}
                                  </p>
                                </>
                              )}
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {/* Editor View */}
            <Editor 
              draft={activeDraft} 
              onUpdateDraft={updateDraft}
              onPublish={publishDraft}
              isListVisible={isListVisible}
              onToggleList={() => setIsListVisible(!isListVisible)}
            />
          </>
        )}
      </div>

      <ImportWizard 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)}
        onComplete={handleImportComplete}
      />

      <NotificationToast 
        notifications={notifications}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onAction={handleNotificationAction}
      />
    </div>
  );
};

export default App;