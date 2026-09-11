import { Link } from 'react-router-dom';
import FlagBadge from './FlagBadge';

export default function PatientCard({ patient }) {
  const flagged = patient.flags?.length > 0;
  return (
    <div className={`p-4 rounded shadow border ${flagged ? 'bg-red-50 border-red-300' : 'bg-white'}`}>
      <h3 className="font-semibold text-lg">{patient.users?.full_name}</h3>
      <p className="text-sm text-gray-600">{patient.condition}</p>
      <p className="text-xs text-gray-500">Next: {patient.next_checkup_date}</p>
      <div className="mt-2">
        {patient.flags?.map((f) => <FlagBadge key={f} flag={f} />)}
      </div>
      <Link to={`/patient/${patient.id}`} className="text-blue-600 text-sm mt-2 inline-block">
        View →
      </Link>
    </div>
  );
}