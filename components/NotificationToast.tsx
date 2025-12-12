import React from 'react';
import { Notification } from '../types';
import { X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onAction: (notification: Notification) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss, onAction }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className="w-80 bg-[#1A1D23] border border-[#262A33] shadow-2xl rounded-lg p-4 pointer-events-auto animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-start justify-between mb-2">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
                {notif.type === 'trend' ? <TrendingUp size={12} /> : <Sparkles size={12} />}
                {notif.type === 'trend' ? 'Trend Alert' : 'Content Gap'}
             </div>
             <button onClick={() => onDismiss(notif.id)} className="text-gray-500 hover:text-white">
                <X size={14} />
             </button>
          </div>
          
          <h4 className="text-sm font-semibold text-white mb-1">{notif.title}</h4>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">{notif.message}</p>
          
          <button 
            onClick={() => onAction(notif)}
            className="w-full bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#3B82F6] py-1.5 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            Draft Post <ArrowRight size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};