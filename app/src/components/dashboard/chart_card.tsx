

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <select className="text-sm bg-transparent">
          <option>7 days</option>
          <option>30 days</option>
        </select>
      </div>
      <div className="h-36">{children}</div>
    </div>
  );
}
