import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="ct-container py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo to="/" showWordmark={false} className="mb-4 [&_img]:brightness-110" />
            <p className="text-lg font-semibold">CareTrack</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Clinic patient follow-up & chronic disease management between visits.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
            <a href="/#features" className="transition hover:text-white">Features</a>
            <a href="/#how-it-works" className="transition hover:text-white">How It Works</a>
            <a href="/#for-doctors" className="transition hover:text-white">For Doctors</a>
            <a href="/#for-patients" className="transition hover:text-white">For Patients</a>
            <Link to="/login" className="transition hover:text-white">Login</Link>
            <Link to="/register" className="transition hover:text-white">Get Started</Link>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} CareTrack. Built for continuous chronic care.
        </div>
      </div>
    </footer>
  );
}
