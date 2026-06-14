'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavTab = 'home' | 'inbox' | 'settings';

const tabs: { id: NavTab; emoji: string; label: string; href: string }[] = [
  { id: 'home',     emoji: '🏠', label: 'الرئيسية', href: '/home' },
  { id: 'inbox',    emoji: '💬', label: 'الرسائل',  href: '/inbox' },
  { id: 'settings', emoji: '⚙️', label: 'الإعدادات', href: '/settings' },
];

interface OMGBottomNavProps {
  active?: NavTab;
}

export function OMGBottomNav({ active }: OMGBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="omg-bot-nav sticky bottom-0 left-0 right-0 z-50">
      {tabs.map((tab) => {
        const isActive = active ? active === tab.id : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className="flex flex-col items-center gap-1 flex-1 py-1"
          >
            <span className="text-[20px]">{tab.emoji}</span>
            <span
              className="font-grotesk text-[9px] font-black uppercase tracking-[0.5px]"
              style={{ color: isActive ? 'var(--omg-purple)' : 'var(--omg-muted)' }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
