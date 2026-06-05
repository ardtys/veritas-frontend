'use client';

import { HourlyEvent } from '@/lib/mockData';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function EventsChart({ data }: { data: HourlyEvent[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <defs>
          <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CC38A" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#4CC38A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }}
          axisLine={false} tickLine={false} interval={2}
        />
        <YAxis
          tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }}
          axisLine={false} tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#191D18', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 6, fontFamily: 'var(--font-jetbrains)', fontSize: 11.5,
            color: '#E4E1D8',
          }}
          labelStyle={{ color: '#6B6E68', marginBottom: 3 }}
          cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }}
          formatter={(val) => [`${val} events`, '']}
        />
        <Area
          type="monotone" dataKey="events"
          stroke="#4CC38A" strokeWidth={2}
          fill="url(#eventsGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#4CC38A', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
