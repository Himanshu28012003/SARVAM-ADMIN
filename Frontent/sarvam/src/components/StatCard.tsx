import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'purple' | 'orange' | 'green' | 'yellow';
}

const StatCard = ({ title, value, subtitle = 'This week', icon: Icon, variant = 'default' }: StatCardProps) => {
  const variantStyles = {
    default: 'bg-white border border-gray-100 hover:shadow-md',
    purple: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 hover:shadow-md',
    orange: 'bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 hover:shadow-md',
    green: 'bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100 hover:shadow-md',
    yellow: 'bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 hover:shadow-md',
  };

  const iconColors = {
    default: 'text-gray-400',
    purple: 'text-indigo-400',
    orange: 'text-amber-500',
    green: 'text-teal-500',
    yellow: 'text-amber-500',
  };

  return (
    <div className={`rounded-2xl p-9 transition-all duration-200 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-6">
        <p className="text-base font-medium text-gray-500">{title}</p>
        {Icon && <Icon size={24} className={`shrink-0 ${iconColors[variant]}`} />}
      </div>
      <p className="text-5xl font-bold text-gray-800 mb-2">{value}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
};

export default StatCard;
