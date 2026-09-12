import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { Button } from './ui';

const marketingLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#for-doctors', label: 'For Doctors' },
  { href: '/#for-patients', label: 'For Patients' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setOpen(false);
    nav('/');
  };

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="ct-container flex h-[4.5rem] items-center justify-between gap-4">
        <Logo to={user ? (user.role === 'doctor' ? '/doctor' : '/me') : '/'} />

        {!user && isLanding && (
          <div className="hidden items-center gap-6 lg:flex">
            <Link to="/" className="text-sm font-semibold text-ink-muted transition hover:text-care-teal">
              Home
            </Link>
            {marketingLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-ink-muted transition hover:text-care-teal"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-control px-4 py-2 text-sm font-semibold text-ink-muted transition hover:bg-slate-50 hover:text-care-blue sm:inline-flex"
              >
                Login
              </Link>
              <Button as={Link} to="/register" variant="navy" className="!py-2.5 !text-sm">
                Get Started
              </Button>
              {isLanding && (
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-line text-navy lg:hidden"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="text-lg leading-none">{open ? '×' : '☰'}</span>
                </button>
              )}
            </>
          ) : (
            <>
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-care-teal-light font-semibold text-care-teal">
                  {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-navy">{user.full_name}</p>
                  <p className="text-xs capitalize text-ink-muted">{user.role}</p>
                </div>
              </div>

              {user.role === 'doctor' && (
                <>
                  <NavLink
                    to="/doctor"
                    className={({ isActive }) =>
                      `rounded-control px-3 py-2 text-sm font-semibold transition ${
                        isActive ? 'bg-care-teal-light text-care-teal' : 'text-ink-muted hover:bg-slate-50'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/add-patient"
                    className={({ isActive }) =>
                      `hidden rounded-control px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                        isActive ? 'bg-care-teal-light text-care-teal' : 'text-ink-muted hover:bg-slate-50'
                      }`
                    }
                  >
                    Add Patient
                  </NavLink>
                </>
              )}

              {user.role === 'patient' && (
                <>
                  <NavLink
                    to="/me"
                    className={({ isActive }) =>
                      `rounded-control px-3 py-2 text-sm font-semibold transition ${
                        isActive ? 'bg-care-teal-light text-care-teal' : 'text-ink-muted hover:bg-slate-50'
                      }`
                    }
                  >
                    My Health
                  </NavLink>
                  <NavLink
                    to="/log"
                    className={({ isActive }) =>
                      `hidden rounded-control px-3 py-2 text-sm font-semibold transition sm:inline-flex ${
                        isActive ? 'bg-care-teal-light text-care-teal' : 'text-ink-muted hover:bg-slate-50'
                      }`
                    }
                  >
                    Log Reading
                  </NavLink>
                </>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-control border border-line px-4 py-2.5 text-sm font-semibold text-ink-muted transition hover:border-red-200 hover:bg-red-50 hover:text-danger"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {open && !user && isLanding && (
        <div className="border-t border-line bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={close} className="rounded-control px-3 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50">
              Home
            </Link>
            {marketingLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-control px-3 py-2.5 text-sm font-semibold text-ink-muted hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" onClick={close} className="rounded-control px-3 py-2.5 text-sm font-semibold text-care-blue">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
