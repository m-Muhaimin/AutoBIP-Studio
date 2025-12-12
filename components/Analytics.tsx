import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AnalyticsMetric } from '../types';

const data = [
  { name: 'Mon', views: 4000, likes: 240 },
  { name: 'Tue', views: 3000, likes: 139 },
  { name: 'Wed', views: 2000, likes: 980 },
  { name: 'Thu', views: 2780, likes: 390 },
  { name: 'Fri', views: 1890, likes: 480 },
  { name: 'Sat', views: 2390, likes: 380 },
  { name: 'Sun', views: 3490, likes: 430 },
];

const metrics: AnalyticsMetric[] = [
  { label: 'Total Impressions', value: '142.5K', trend: 12, trendDirection: 'up' },
  { label: 'Profile Visits', value: '3,402', trend: 8, trendDirection: 'up' },
  { label: 'Engagement Rate', value: '4.2%', trend: 2, trendDirection: 'down' },
  { label: 'Inbound Leads', value: '24', trend: 150, trendDirection: 'up' },
];

export const Analytics: React.FC = () => {
  return (
    <div className="flex-1 bg-[#0B0F12] p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Performance Dashboard</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-[#1A1D23] border border-[#262A33] p-5 rounded-lg">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{m.label}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-white">{m.value}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                m.trendDirection === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {m.trendDirection === 'up' ? '+' : '-'}{m.trend}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1A1D23] border border-[#262A33] p-6 rounded-lg h-[400px] flex flex-col min-w-0">
          <h3 className="text-white font-semibold mb-6 shrink-0">Impression Trend</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262A33" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1115', borderColor: '#262A33', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#262A33', opacity: 0.4 }}
                />
                <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1A1D23] border border-[#262A33] p-6 rounded-lg h-[400px] flex flex-col min-w-0">
          <h3 className="text-white font-semibold mb-6 shrink-0">Engagement Quality</h3>
          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262A33" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1115', borderColor: '#262A33', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="likes" stroke="#10B981" strokeWidth={3} dot={{ fill: '#0B0F12', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};