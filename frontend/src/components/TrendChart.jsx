import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function TrendChart({ readings, type }) {
  const data = readings
    .filter((r) => r.type === type)
    .map((r) => ({
      date: new Date(r.logged_at).toLocaleDateString(),
      value: Number(r.value),
    }));

  if (!data.length) return <p className="text-sm text-gray-400">No {type} data yet.</p>;

  return (
    <div className="my-4">
      <h4 className="text-sm font-semibold mb-2">{type.toUpperCase()}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}