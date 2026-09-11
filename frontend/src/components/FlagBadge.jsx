const colors = {
  missed_followup: 'bg-red-200 text-red-800',
  high_bp_trend: 'bg-orange-200 text-orange-800',
  high_sugar_trend: 'bg-yellow-200 text-yellow-800',
  no_recent_logs: 'bg-gray-200 text-gray-800',
  overdue_test: 'bg-purple-200 text-purple-800',
  pending_appointment_request: 'bg-blue-200 text-blue-800',
};

export default function FlagBadge({ flag }) {
  return (
    <span className={`text-xs px-2 py-1 rounded mr-1 ${colors[flag] || 'bg-gray-100'}`}>
      {flag.replace(/_/g, ' ')}
    </span>
  );
}