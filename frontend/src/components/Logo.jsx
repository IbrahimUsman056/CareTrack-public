import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Logo({ to = '/', className = '', showWordmark = true }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="CareTrack home">
      <img
        src={logo}
        alt="CareTrack"
        className="h-10 w-10 rounded-lg object-contain sm:h-11 sm:w-11"
      />
      {showWordmark && (
        <span className="hidden leading-tight sm:block">
          <span className="block text-lg font-bold tracking-tight text-navy">
            Care<span className="text-care-blue">Track</span>
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Better care. Better follow-up.
          </span>
        </span>
      )}
    </Link>
  );
}
