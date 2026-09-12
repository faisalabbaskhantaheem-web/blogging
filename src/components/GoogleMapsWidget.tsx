import React, { useState } from 'react';
import { MapPin, Globe, Compass, Phone, Clock, Mail } from 'lucide-react';

interface BranchOffice {
  city: string;
  country: string;
  address: string;
  coordinates: string;
  phone: string;
  hours: string;
  email: string;
  mapX: number; // For rendering visual pin on physical vector SVG map
  mapY: number;
}

export const GoogleMapsWidget: React.FC = () => {
  const offices: BranchOffice[] = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '100 Pine Street, Suite 2400, San Francisco, CA 94111',
      coordinates: '37.7925° N, 122.4014° W',
      phone: '+1 (415) 555-0192',
      hours: '09:00 AM - 06:00 PM (PST)',
      email: 'sf.office@jbblogging.com',
      mapX: 120,
      mapY: 105
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '42 Canary Wharf, Level 18, London E14 5LQ',
      coordinates: '51.5054° N, 0.0210° W',
      phone: '+44 (20) 7946 0852',
      hours: '09:00 AM - 05:30 PM (GMT)',
      email: 'london.hq@jbblogging.com',
      mapX: 350,
      mapY: 82
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      address: 'Shibuya Crossing Tower, 12F, Shibuya, Tokyo 150-0002',
      coordinates: '35.6580° N, 139.7016° E',
      phone: '+81 (3) 5555-1234',
      hours: '10:00 AM - 07:00 PM (JST)',
      email: 'tokyo.hub@jbblogging.com',
      mapX: 580,
      mapY: 120
    }
  ];

  const [activeOffice, setActiveOffice] = useState<BranchOffice>(offices[0]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Office Selection list cards */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="px-2.5 py-1 text-[9px] font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/10 rounded-full tracking-wider uppercase">
              Global Headquarters
            </span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mt-2 leading-tight">
              Visit JB Blogging Offices
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select an office branch to see directions, coordinates, contact logs, and operating regimes.
            </p>
          </div>

          <div className="space-y-2">
            {offices.map((office) => (
              <button
                key={office.city}
                onClick={() => setActiveOffice(office)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  activeOffice.city === office.city
                    ? 'border-blue-600 bg-white dark:bg-slate-800/80 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/30'
                    : 'border-slate-100 bg-slate-100/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-850'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeOffice.city === office.city ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                    {office.city} HQ
                    <span className="text-[10px] text-slate-400 font-normal">({office.country})</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{office.address}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Display Info stats */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-500" />
              <span className="font-mono text-[10px]">{activeOffice.coordinates}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-500" />
              <span>{activeOffice.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-[11px]">{activeOffice.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-blue-600 dark:text-blue-400">{activeOffice.email}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Physical SVG styled interactive Vector Map */}
        <div className="lg:col-span-7 flex flex-col justify-center bg-slate-900 dark:bg-slate-950 rounded-2xl overflow-hidden p-6 relative border border-slate-800 h-80 lg:h-auto">
          
          <div className="absolute top-4 left-4 z-10">
            <span className="font-mono text-[9px] text-slate-400 flex items-center gap-1">
              <Globe className="h-3 w-3 animate-spin text-blue-400" /> VECTOR ORBIT SYSTEM: ACTIVE
            </span>
          </div>

          {/* SVG representation of stylized global map */}
          <svg viewBox="0 0 700 240" className="w-full h-full text-slate-800 opacity-80" xmlns="http://www.w3.org/2000/svg">
            {/* Soft grid background */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated continents nodes (stylized circles representing land) */}
            {/* North America */}
            <circle cx="100" cy="90" r="40" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            <circle cx="130" cy="110" r="30" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            
            {/* South America */}
            <circle cx="160" cy="190" r="35" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            
            {/* Eurasia / Africa */}
            <circle cx="340" cy="80" r="50" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            <circle cx="440" cy="90" r="45" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            <circle cx="330" cy="150" r="40" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            
            {/* East Asia / Australia */}
            <circle cx="560" cy="100" r="35" fill="currentColor" className="text-slate-850 dark:text-slate-800" />
            <circle cx="590" cy="180" r="28" fill="currentColor" className="text-slate-850 dark:text-slate-800" />

            {/* Connections */}
            <path d="M 120 105 Q 235 90 350 82" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 350 82 Q 465 100 580 120" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="3,3" />

            {/* Pins */}
            {offices.map((office) => {
              const isSelected = activeOffice.city === office.city;
              return (
                <g key={office.city} className="cursor-pointer" onClick={() => setActiveOffice(office)}>
                  {/* Ripple pulse element */}
                  {isSelected && (
                    <circle cx={office.mapX} cy={office.mapY} r="18" fill="rgba(59, 130, 246, 0.25)" className="animate-ping" style={{ transformOrigin: `${office.mapX}px ${office.mapY}px` }} />
                  )}
                  {/* Stable Core pin */}
                  <circle cx={office.mapX} cy={office.mapY} r="6" fill={isSelected ? '#3b82f6' : '#64748b'} className="transition-all duration-300" />
                  <circle cx={office.mapX} cy={office.mapY} r="2" fill="#ffffff" />
                  
                  {/* Text labels */}
                  <text x={office.mapX} y={office.mapY - 12} textAnchor="middle" className="text-[9px] font-extrabold fill-slate-300 select-none">
                    {office.city}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Overlay office detail card inside coordinate sphere */}
          <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[9px] text-slate-400 font-mono">
            <span>PINGING TARGET DIRECTORY</span><br/>
            <span className="text-blue-400">SUCCESS ({activeOffice.city})</span>
          </div>

        </div>

      </div>
    </div>
  );
};
