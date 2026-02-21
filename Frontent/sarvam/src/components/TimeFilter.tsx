import type { TimeFilter as TimeFilterType } from '../types';

interface TimeFilterProps {
  selected: TimeFilterType;
  onChange: (filter: TimeFilterType) => void;
  /** Use 'primary' for dashboard (selected = indigo), 'grey' for teacher/page view */
  variant?: 'purple' | 'grey';
}

const TimeFilter = ({ selected, onChange, variant = 'purple' }: TimeFilterProps) => {
  const filters: { value: TimeFilterType; label: string }[] = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  const selectedClass =
    variant === 'purple'
      ? 'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-200/50 hover:bg-indigo-600 hover:shadow-lg'
      : 'bg-gray-200 text-gray-800 shadow-sm hover:bg-gray-300';

  return (
    <div className="flex items-center gap-1 bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 select-none active:scale-[0.98] ${
            selected === filter.value
              ? selectedClass
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFilter;
