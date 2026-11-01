import React from 'react';
import {
  LayoutDashboard,
  IndianRupee,
  MessageCircle,
  CalendarCheck2,
  Users,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'fees', label: 'Fees & Dues', icon: IndianRupee },
    {
      id: 'whatsapp',
      label: 'WhatsApp Reminders',
      icon: MessageCircle,
      badge: pendingCount > 0 ? pendingCount : null,
      highlight: pendingCount > 0,
    },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Sub-Header Nav */}
      <nav className="hidden md:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[11px] rounded-full font-bold ${
                      isActive
                        ? 'bg-white text-amber-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 shadow-lg pb-[env(safe-area-inset-bottom,4px)]">
        <div className="grid grid-cols-5 gap-0.5">
          {[
            { id: 'overview', label: 'Home', icon: LayoutDashboard },
            { id: 'fees', label: 'Fees', icon: IndianRupee },
            {
              id: 'whatsapp',
              label: 'WhatsApp',
              icon: MessageCircle,
              badge: pendingCount > 0 ? pendingCount : null,
            },
            { id: 'attendance', label: 'Attend', icon: CalendarCheck2 },
            { id: 'students', label: 'Students', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-amber-600 font-bold'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-amber-600' : 'text-slate-500'}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
