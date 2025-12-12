import React, { useState } from 'react';
import { Github, ArrowRight, ArrowLeft, Check, Plus, Moon, Sun } from 'lucide-react';
import { OnboardingData } from '../types';

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    hasConnectedGithub: false,
    productAreas: ['Auth', 'Settings', 'Payments', 'Dashboard'],
    logTypes: ['Feature', 'Bug Fix', 'Improvement']
  });

  const [customArea, setCustomArea] = useState('');
  const [customType, setCustomType] = useState('');

  const suggestedAreas = [
    { label: 'Auth', color: 'bg-blue-500' },
    { label: 'Settings', color: 'bg-emerald-500' },
    { label: 'Payments', color: 'bg-yellow-500' },
    { label: 'Dashboard', color: 'bg-indigo-500' },
    { label: 'Console', color: 'bg-purple-500' },
    { label: 'Web', color: 'bg-cyan-500' },
    { label: 'iOS', color: 'bg-green-500' },
    { label: 'Android', color: 'bg-green-600' },
    { label: 'Desktop', color: 'bg-slate-500' },
    { label: 'Blog', color: 'bg-purple-400' },
    { label: 'API', color: 'bg-blue-600' },
    { label: 'Analytics', color: 'bg-indigo-400' },
    { label: 'Notifications', color: 'bg-pink-500' },
    { label: 'Search', color: 'bg-teal-500' },
    { label: 'UI', color: 'bg-pink-400' },
  ];

  const suggestedTypes = [
    { label: 'Feature', icon: '✨' },
    { label: 'Bug Fix', icon: '🐛' },
    { label: 'Improvement', icon: '🚀' },
    { label: 'Documentation', icon: '📚' },
    { label: 'Chore', icon: '🧹' },
    { label: 'WIP', icon: '🚧' },
    { label: 'Refactor', icon: '♻️' },
    { label: 'Test', icon: '🧪' },
  ];

  const toggleArea = (area: string) => {
    setData(prev => ({
      ...prev,
      productAreas: prev.productAreas.includes(area)
        ? prev.productAreas.filter(a => a !== area)
        : [...prev.productAreas, area]
    }));
  };

  const toggleType = (type: string) => {
    setData(prev => ({
      ...prev,
      logTypes: prev.logTypes.includes(type)
        ? prev.logTypes.filter(t => t !== type)
        : [...prev.logTypes, type]
    }));
  };

  const addCustomArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (customArea && !data.productAreas.includes(customArea)) {
        setData(prev => ({...prev, productAreas: [...prev.productAreas, customArea]}));
        setCustomArea('');
    }
  };

  const addCustomType = (e: React.FormEvent) => {
    e.preventDefault();
    if (customType && !data.logTypes.includes(customType)) {
        setData(prev => ({...prev, logTypes: [...prev.logTypes, customType]}));
        setCustomType('');
    }
  };

  // Step 1: Connect GitHub
  const renderStep1 = () => (
    <div className="max-w-xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1A1D23] border border-[#262A33] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
            <Github size={28} className="text-white" />
            <h2 className="text-2xl font-bold text-white">Connect GitHub</h2>
        </div>
        <p className="text-gray-400 mb-8">Automatically track commits and generate logs from your repositories.</p>

        <div className="bg-[#0B0F12] border border-[#262A33] rounded-lg p-4 flex items-center justify-between mb-8">
            <div className="flex flex-col">
                <span className="font-medium text-white">GitHub App</span>
                <span className="text-xs text-gray-500 mt-1">Install our GitHub App to automatically track commits pushed to your production branches</span>
            </div>
            {data.hasConnectedGithub ? (
                 <button className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-default">
                    <Check size={16} /> Installed
                 </button>
            ) : (
                <button 
                    onClick={() => setData(prev => ({...prev, hasConnectedGithub: true}))}
                    className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-[#333] transition-colors"
                >
                    Install GitHub App <ArrowRight size={14} />
                </button>
            )}
        </div>

        <div className="flex items-center justify-between pt-4">
            <button className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={14} /> Back
            </button>
            <div className="flex items-center gap-4">
                 <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-white transition-colors">
                    Skip for now
                 </button>
                 <button 
                    onClick={() => setStep(2)}
                    disabled={!data.hasConnectedGithub}
                    className={`
                        flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${data.hasConnectedGithub 
                            ? 'bg-white text-black hover:bg-gray-200' 
                            : 'bg-[#262A33] text-gray-500 cursor-not-allowed'}
                    `}
                 >
                    Connect a repository to continue <ArrowRight size={16} />
                 </button>
            </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Product Areas
  const renderStep2 = () => (
    <div className="max-w-2xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1A1D23] border border-[#262A33] rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Set up product areas</h2>
        <p className="text-gray-400 mb-8">Organize your changelog by product areas. This step is optional.</p>

        <div className="mb-6">
            <span className="text-sm text-gray-500 block mb-3">Quick add suggested areas:</span>
            <div className="flex flex-wrap gap-2">
                {suggestedAreas.map(area => {
                    const isSelected = data.productAreas.includes(area.label);
                    return (
                        <button
                            key={area.label}
                            onClick={() => toggleArea(area.label)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-all
                                ${isSelected 
                                    ? 'bg-[#0B0F12] border-gray-500 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                                    : 'bg-[#0B0F12] border-[#262A33] text-gray-400 hover:border-gray-600 hover:text-gray-300'}
                            `}
                        >
                            <div className={`w-2 h-2 rounded-full ${area.color}`}></div>
                            {area.label}
                        </button>
                    );
                })}
            </div>
        </div>

        <form onSubmit={addCustomArea} className="mb-8">
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Plus size={16} />
                </div>
                <input 
                    type="text" 
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    placeholder="Add product area"
                    className="w-full bg-[#0B0F12] border border-[#262A33] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6]"
                />
            </div>
        </form>

        <div className="bg-white/5 rounded-lg p-6 border border-dashed border-[#262A33] text-center mb-8">
             {data.productAreas.length === 0 ? (
                 <span className="text-gray-500 text-sm">No product areas yet. Add areas or skip this step.</span>
             ) : (
                 <div className="flex flex-wrap gap-2 justify-center">
                    {data.productAreas.map(area => (
                        <span key={area} className="px-2 py-1 bg-[#262A33] rounded text-xs text-gray-300 border border-[#333]">
                            {area}
                        </span>
                    ))}
                 </div>
             )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#262A33]">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={14} /> Back
            </button>
            <button 
                onClick={() => setStep(3)}
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                Continue <ArrowRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );

  // Step 3: Log Types
  const renderStep3 = () => (
    <div className="max-w-2xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1A1D23] border border-[#262A33] rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Set up log types</h2>
        <p className="text-gray-400 mb-8">Categorize your logs with custom types. Add at least one type to continue.</p>

        <div className="mb-6">
            <span className="text-sm text-gray-500 block mb-3">Quick add suggested types:</span>
            <div className="flex flex-wrap gap-2">
                 <button
                    onClick={() => setData(prev => ({...prev, logTypes: [...suggestedTypes.map(t => t.label)]}))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border bg-[#262A33] border-[#333] text-white hover:bg-[#333] transition-colors"
                >
                    <Plus size={14} /> Add All
                </button>
                {suggestedTypes.map(type => {
                    const isSelected = data.logTypes.includes(type.label);
                    return (
                        <button
                            key={type.label}
                            onClick={() => toggleType(type.label)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-all
                                ${isSelected 
                                    ? 'bg-[#0B0F12] border-gray-500 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' 
                                    : 'bg-[#0B0F12] border-[#262A33] text-gray-400 hover:border-gray-600 hover:text-gray-300'}
                            `}
                        >
                            <span>{type.label === 'Feature' || type.label === 'Bug Fix' ? '' : '+'}</span>
                            {type.label}
                            <span className="opacity-50 text-[10px] ml-1">
                                {(type.label === 'Chore' || type.label === 'WIP' || type.label === 'Refactor' || type.label === 'Test') ? '(private)' : ''}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>

        <form onSubmit={addCustomType} className="mb-8">
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Plus size={16} />
                </div>
                <input 
                    type="text" 
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Add type"
                    className="w-full bg-[#0B0F12] border border-[#262A33] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6]"
                />
            </div>
        </form>

         <div className="bg-white/5 rounded-lg p-6 border border-dashed border-[#262A33] text-center mb-8 min-h-[100px] flex items-center justify-center">
             {data.logTypes.length === 0 ? (
                 <span className="text-gray-500 text-sm">No types yet. Add your first type to continue.</span>
             ) : (
                 <div className="flex flex-wrap gap-2 justify-center">
                    {data.logTypes.map(type => (
                        <span key={type} className="px-3 py-1 bg-[#262A33] rounded text-xs text-gray-300 border border-[#333]">
                            {type}
                        </span>
                    ))}
                 </div>
             )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#262A33]">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                <ArrowLeft size={14} /> Back
            </button>
            <button 
                onClick={() => onComplete(data)}
                className="bg-[#666] hover:bg-[#777] text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
                Continue <ArrowRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F12] flex flex-col">
       {/* Minimal Nav */}
       <div className="h-16 flex items-center justify-between px-8 border-b border-[#262A33]">
           <div className="w-20"></div> {/* Spacer */}
           <div className="flex gap-1">
                <div className={`w-16 h-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-[#262A33]'}`}></div>
                <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-[#262A33]'}`}></div>
                <div className={`w-16 h-1 rounded-full ${step >= 3 ? 'bg-white' : 'bg-[#262A33]'}`}></div>
           </div>
           <div className="flex items-center gap-4 w-20 justify-end">
               <Sun size={18} className="text-gray-600" />
               <Moon size={18} className="text-white" />
           </div>
       </div>

       <div className="flex-1 flex items-center justify-center p-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
       </div>
    </div>
  );
};