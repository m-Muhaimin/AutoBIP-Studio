import React, { useEffect, useState, useRef } from 'react';
import { X, Terminal } from 'lucide-react';
import { LogEntry } from '../types';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      runSequence();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Math.floor(Math.random() * 999),
      message,
      type
    }]);
  };

  const runSequence = async () => {
    addLog('Initializing AutoBIP Sequence v2.4.0...');
    await delay(600);
    addLog('Connecting to secure Integration Hub...', 'info');
    await delay(800);
    addLog('Successfully authenticated with GitHub (OAuth2).', 'success');
    await delay(400);
    addLog('Scanning repository: AutoBIP-Frontend...', 'info');
    await delay(700);
    addLog('Found 3 new commits in last 24h.', 'success');
    await delay(300);
    addLog('Analyzing diffs for semantic meaning...', 'info');
    await delay(1200);
    addLog('Detected Feature: "Dark Mode implementation".', 'success');
    addLog('Detected Fix: "Auth token race condition".', 'success');
    await delay(500);
    addLog('Fetching Jira tickets from board "SaaS-V1"...', 'info');
    await delay(600);
    addLog('Found 1 completed ticket: "Integrate Stripe Webhooks".', 'success');
    await delay(800);
    addLog('Engaging Gemini 2.5 Flash for draft synthesis...', 'warning');
    await delay(1500);
    addLog('Draft generation complete. 3 artifacts created.', 'success');
    await delay(800);
    addLog('Sequence finished. Closing session.', 'info');
    await delay(500);
    onComplete();
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-[#0B0F12] border border-[#262A33] rounded-lg shadow-2xl overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262A33] bg-[#0F1115]">
          <div className="flex items-center gap-2 text-gray-400">
            <Terminal size={18} />
            <span className="text-sm font-mono">AutoBIP Ingestion Engine</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 bg-[#0B0F12]"
        >
          {logs.map((log, index) => (
            <div key={index} className="flex gap-3">
              <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`
                ${log.type === 'info' ? 'text-gray-300' : ''}
                ${log.type === 'success' ? 'text-[#10B981]' : ''}
                ${log.type === 'warning' ? 'text-[#3B82F6]' : ''}
                ${log.type === 'error' ? 'text-red-500' : ''}
              `}>
                {log.type === 'info' && '> '}
                {log.type === 'success' && '✔ '}
                {log.type === 'warning' && '⚡ '}
                {log.message}
              </span>
            </div>
          ))}
          <div className="animate-blink text-[#3B82F6] font-bold">_</div>
        </div>
      </div>
    </div>
  );
};