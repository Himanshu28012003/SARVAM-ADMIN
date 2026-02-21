import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, BookOpen, FileQuestion, ClipboardCheck } from 'lucide-react';
import { getSummary, getGrades, getSubjects } from '../services/api';
import type { TeacherSummary } from '../types';
import { Header, TimeFilter } from '../components';
import type { TimeFilter as TimeFilterType } from '../types';

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryData, gradesData, subjectsData] = await Promise.all([
          getSummary(),
          getGrades(),
          getSubjects(),
        ]);
        setTeachers(summaryData.summary);
        setGrades(gradesData.grades);
        setSubjects(subjectsData.subjects);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (id: string) => {
    const colors = [
      'from-indigo-400 to-indigo-500',
      'from-teal-400 to-teal-500',
      'from-amber-400 to-amber-500',
      'from-sky-400 to-sky-500',
      'from-violet-400 to-violet-500',
    ];
    const index = parseInt(id.replace('T', '')) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Header
        grades={grades}
        subjects={subjects}
        selectedGrade={selectedGrade}
        selectedSubject={selectedSubject}
        onGradeChange={setSelectedGrade}
        onSubjectChange={setSelectedSubject}
      />

      {/* Teachers Section Header - margin-top to prevent collision with main header (Ask Savra Ai row) */}
      <div className="flex items-center justify-between mb-6 mt-8 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Teachers</h2>
          <p className="text-sm text-gray-500">View and analyze teacher performance</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none "
            />
          </div>
          <TimeFilter selected={timeFilter} onChange={setTimeFilter} variant="purple" />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.teacher_id}
            onClick={() => navigate(`/teachers/${teacher.teacher_id}`)}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full  ${getRandomColor(
                    teacher.teacher_id
                  )} flex items-center justify-center text-white font-semibold`}
                >
                  {getInitials(teacher.teacher_name)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {teacher.teacher_name}
                  </h3>
                  <p className="text-sm text-gray-400">{teacher.teacher_id}</p>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <BookOpen size={16} className="mx-auto text-indigo-500 mb-1" />
                <p className="text-lg font-bold text-gray-800">{teacher.total_lesson_plans}</p>
                <p className="text-xs text-gray-500">Lessons</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <FileQuestion size={16} className="mx-auto text-amber-500 mb-1" />
                <p className="text-lg font-bold text-gray-800">{teacher.total_quizzes}</p>
                <p className="text-xs text-gray-500">Quizzes</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-3 text-center">
                <ClipboardCheck size={16} className="mx-auto text-teal-500 mb-1" />
                <p className="text-lg font-bold text-gray-800">{teacher.total_question_papers}</p>
                <p className="text-xs text-gray-500">Assessments</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
