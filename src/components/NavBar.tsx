import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Products', end: true },
  { to: '/records', label: 'All Records' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/settings', label: 'Settings' },
];

export function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-brand-700">UbatLog</span>
          <div className="flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
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
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
