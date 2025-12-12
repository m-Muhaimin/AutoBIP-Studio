import React, { useState } from 'react';
import { X, Github, Check, Calendar, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ImportWizard: React.FC<ImportWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsImporting(false);
    setStep(1); // Reset for next time
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0B0F12] border border-[#262A33] rounded-xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262A33]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Import from Git</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-4">
                <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-white' : 'text-gray-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 1 ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#262A33]'}`}>
                        {step > 1 ? <Check size={14} /> : '1'}
                    </div>
                    <span className="text-xs">Select Repo</span>
                </div>
                <div className="w-16 h-[1px] bg-[#262A33]"></div>
                <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-white' : 'text-gray-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 2 ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#262A33]'}`}>
                         {step > 2 ? <Check size={14} /> : '2'}
                    </div>
                    <span className="text-xs">Select Period</span>
                </div>
                <div className="w-16 h-[1px] bg-[#262A33]"></div>
                <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-white' : 'text-gray-600'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${step >= 3 ? 'bg-[#3B82F6] border-[#3B82F6]' : 'border-[#262A33]'}`}>
                        3
                    </div>
                    <span className="text-xs">Import</span>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-12 py-4">
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white text-center mb-6">Connect GitHub</h3>
                    <div className="bg-[#1A1D23] border border-[#262A33] rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-[#3B82F6] transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-black rounded-full text-white">
                                <Github size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">micro-saas/frontend</h4>
                                <p className="text-sm text-gray-500">Last updated 2h ago</p>
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border border-[#262A33] group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6]"></div>
                    </div>
                    
                    <div className="bg-[#1A1D23] border border-[#262A33] rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-[#3B82F6] transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-black rounded-full text-white">
                                <Github size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">micro-saas/backend</h4>
                                <p className="text-sm text-gray-500">Last updated 1d ago</p>
                            </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border border-[#262A33] group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6]"></div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">How much history?</h3>
                    <p className="text-gray-400 text-sm mb-6">Select how far back you'd like to import commits to scan for content.</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <button className="p-4 border border-[#3B82F6] bg-[#3B82F6]/10 rounded-lg text-white font-medium text-sm">1 Week</button>
                        <button className="p-4 border border-[#262A33] hover:bg-[#1A1D23] rounded-lg text-gray-400 font-medium text-sm">2 Weeks</button>
                        <button className="p-4 border border-[#262A33] hover:bg-[#1A1D23] rounded-lg text-gray-400 font-medium text-sm">1 Month</button>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-gray-500 mt-4 cursor-pointer hover:text-white">
                        <Calendar size={16} />
                        <span className="text-sm">Custom Range</span>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                    {isImporting ? (
                         <>
                            <Loader2 size={48} className="text-[#3B82F6] animate-spin" />
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-white">Analyzing Repository...</h3>
                                <p className="text-sm text-gray-500 mt-2">Scanning diffs for features and bug fixes</p>
                            </div>
                         </>
                    ) : (
                         <>
                            <div className="w-16 h-16 bg-[#10B981]/20 rounded-full flex items-center justify-center text-[#10B981] mb-2">
                                <Check size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Ready to Import</h3>
                            <p className="text-gray-400 text-center max-w-sm">
                                We found 12 commits and 3 tickets from the selected period.
                            </p>
                         </>
                    )}
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#262A33] flex justify-between items-center">
            {step > 1 ? (
                <button 
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            ) : (
                <div></div>
            )}

            {step < 3 ? (
                <button 
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Continue <ArrowRight size={16} />
                </button>
            ) : (
                !isImporting && (
                    <button 
                        onClick={handleImport}
                        className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Start Import
                    </button>
                )
            )}
        </div>
      </div>
    </div>
  );
};