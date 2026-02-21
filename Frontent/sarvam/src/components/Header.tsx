import { Search, ChevronDown } from 'lucide-react';

interface HeaderProps {
  grades: number[];
  subjects: string[];
  selectedGrade: number | null;
  selectedSubject: string | null;
  onGradeChange: (grade: number | null) => void;
  onSubjectChange: (subject: string | null) => void;
}

const Header = ({
  grades,
  subjects,
  selectedGrade,
  selectedSubject,
  onGradeChange,
  onSubjectChange,
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between mb-14 min-h-[4.5rem] flex-wrap gap-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Companion</h1>
        <p className="text-sm text-gray-500 mt-0.5">See What's Happening Across your School</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          {/* <input
            type="text"
            placeholder=""
            className="pl-10 pr-4 py-2.5 w-[220px] bg-white border border-gray-200 rounded-xl text-sm focus:outline-none  focus:ring-indigo-200 focus:border-indigo-400 transition-all shadow-sm"
          /> */}
        </div>

        {/* Grade Filter - interactive */}
        <div className="relative group">
          <select
            value={selectedGrade || ''}
            onChange={(e) => onGradeChange(e.target.value ? parseInt(e.target.value) : null)}
            className="appearance-none bg-indigo-500 text-white px-4 py-2.5 pr-10 rounded-xl text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-md hover:bg-indigo-600 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
        </div>

        {/* Subject Filter - interactive */}
        <div className="relative group">
          <select
            value={selectedSubject || ''}
            onChange={(e) => onSubjectChange(e.target.value || null)}
            className="appearance-none bg-gray-100 border border-gray-200 px-4 py-2.5 pr-10 rounded-xl text-sm font-medium text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:border-indigo-400 shadow-sm hover:bg-gray-200 hover:border-gray-300 active:scale-[0.98] transition-all duration-200"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </header>
  );
};

export default Header;
