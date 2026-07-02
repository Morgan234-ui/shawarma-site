'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ClipboardList, Package, Settings, LogOut, ChefHat, Menu, X, Circle } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/orders',   label: 'Orders',   Icon: ClipboardList },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function closeSidebar() { setSidebarOpen(false); }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  }

  const pageTitle = NAV_ITEMS.find(i => pathname.startsWith(i.href))?.label ?? 'Dashboard';

  return (
    <div className="adm-wrapper">
      {sidebarOpen && <div className="adm-overlay" onClick={closeSidebar} aria-hidden="true" />}

      <aside className={`adm-sidebar ${sidebarOpen ? 'adm-sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="adm-brand">
          <div className="adm-brand-icon-wrap">
            <ChefHat size={22} color="#fff" strokeWidth={1.8} />
          </div>
          <div>
            <div className="adm-brand-name">MimiRichies</div>
            <div className="adm-brand-sub">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`adm-nav-item ${active ? 'adm-nav-active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-footer">
          <div className="adm-admin-badge">
            <Circle size={8} fill="#4ade80" color="#4ade80" style={{ filter: 'drop-shadow(0 0 4px #4ade80)' }} />
            <span>Administrator</span>
          </div>
          <button className="adm-logout-btn" onClick={handleLogout}>
            <LogOut size={15} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="adm-body">
        <header className="adm-topbar">
          <button
            className="adm-menu-btn"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="adm-topbar-title">{pageTitle}</div>
          <div className="adm-topbar-brand">MimiRichies Bite</div>
        </header>

        <main className="adm-content">{children}</main>
      </div>
    </div>
  );
}
