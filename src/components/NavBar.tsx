import { Calculator, LogOut, Package, Settings, Table } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Products', end: true, icon: Package },
  { to: '/records', label: 'All Records', icon: Table },
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-extrabold tracking-tight">
            <span className="text-brand-600">Ubat</span>
            <span className="text-gray-900">Log</span>
          </span>
          <div className="flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`
                }
              >
                <link.icon size={15} />
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.displayName}</span>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
