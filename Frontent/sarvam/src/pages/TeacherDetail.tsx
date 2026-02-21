import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Search, ChevronDown, BookOpen, FileQuestion, ClipboardCheck, AlertTriangle, Download, Calendar, FileText } from 'lucide-react';
import { getTeacherById, getGrades, getSubjects } from '../services/api';
import type { TeacherDetail as TeacherDetailType } from '../types';
import { TimeFilter } from '../components';
import type { TimeFilter as TimeFilterType } from '../types';

const TeacherDetail = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<TeacherDetailType | null>(null);
  const [grades, setGrades] = useState<number[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) return;
      try {
        setLoading(true);
        const [teacherData, gradesData, subjectsData] = await Promise.all([
          getTeacherById(teacherId),
          getGrades(),
          getSubjects(),
        ]);
        setTeacher(teacherData);
        setGrades(gradesData.grades);
        setSubjects(subjectsData.subjects);
      } catch (error) {
        console.error('Error fetching teacher:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherId]);

  // Transform grade breakdown for chart
  const chartData = teacher?.gradeBreakdown.reduce((acc: any[], item) => {
    const existing = acc.find((a) => a.grade === `Class ${item.grade}`);
    if (existing) {
      if (item.activity_type === 'Lesson Plan') existing.lessons = item.count;
      if (item.activity_type === 'Quiz') existing.quizzes = item.count;
      if (item.activity_type === 'Question Paper') existing.assessments = item.count;
    } else {
      acc.push({
        grade: `Class ${item.grade}`,
        lessons: item.activity_type === 'Lesson Plan' ? item.count : 0,
        quizzes: item.activity_type === 'Quiz' ? item.count : 0,
        assessments: item.activity_type === 'Question Paper' ? item.count : 0,
      });
    }
    return acc;
  }, []) || [];

  // Get unique subjects and grades for this teacher
  const teacherSubjects = [...new Set(teacher?.subjectBreakdown.map((s) => s.subject) || [])];
  const teacherGrades = [...new Set(teacher?.gradeBreakdown.map((g) => g.grade) || [])];

  // Calculate engagement score
  const avgScore = teacher ? Math.round((teacher.teacher.total_activities / 15) * 100) : 0;
  const isLowEngagement = avgScore < 50;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Teacher not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header - match screenshot: back arrow + name + Performance Overview, search + Grade 7 (purple) + All Subjects (grey) */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/teachers')}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{teacher.teacher.teacher_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Performance Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {/* <input
              type="text"
              placeholder="Ask Savra Ai"
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200 shadow-sm"
            /> */}
          </div>
          <div className="relative">
            <select
              value={selectedGrade || ''}
              onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
              className="appearance-none bg-indigo-500 text-white px-4 py-2.5 pr-10 rounded-xl text-sm font-medium cursor-pointer shadow-sm hover:bg-indigo-600 transition-colors"
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
          <div className="relative">
            <select className="appearance-none bg-gray-100 border border-gray-200 px-4 py-2.5 pr-10 rounded-xl text-sm font-medium text-gray-700 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200">
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

      {/* Teacher Info */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          <span className="text-gray-400">Subject:</span>{' '}
          <span className="font-medium">{teacherSubjects.join(', ')}</span>
        </p>
        <p className="text-sm text-gray-600">
          <span className="text-gray-400">Grade Taught:</span>{' '}
          <span className="font-medium">{teacherGrades.map((g) => `Class ${g}`).join(', ')}</span>
        </p>
      </div>

      {/* Time Filter - grey variant for teacher page */}
      <div className="flex justify-end mb-6">
        <TimeFilter selected={timeFilter} onChange={setTimeFilter} variant="grey" />
      </div>

      {/* Stats Cards - match screenshot: Lessons (light purple), Quizzes (light green), Assessments (light yellow), Low Engagement (white) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Lessons</p>
            <BookOpen size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Created</p>
          <p className="text-3xl font-bold text-gray-800">{teacher.teacher.total_lesson_plans}</p>
        </div>

        <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Quizzes</p>
            <FileQuestion size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Conducted</p>
          <p className="text-3xl font-bold text-gray-800">{teacher.teacher.total_quizzes}</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Assessments</p>
            <ClipboardCheck size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-1">Assigned</p>
          <p className="text-3xl font-bold text-gray-800">{teacher.teacher.total_question_papers}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Low Engagement Note</p>
            <AlertTriangle size={18} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-700">
            {isLowEngagement
              ? `Average score is ${avgScore}%. Consider reviewing teaching methods.`
              : `Good engagement at ${avgScore}%`}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Class-wise Breakdown - legend: Avg Score (blue), Completion (orange) */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Class-wise Breakdown</h3>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-500">Avg Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              <span className="text-sm text-gray-500">Completion</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="lessons" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avg Score" />
              <Bar dataKey="quizzes" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Completion" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity - empty state in light purple/pink box per screenshot */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>

          {teacher.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {teacher.recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.activity_type === 'Lesson Plan'
                        ? 'bg-indigo-100'
                        : activity.activity_type === 'Quiz'
                        ? 'bg-amber-100'
                        : 'bg-teal-100'
                    }`}
                  >
                    {activity.activity_type === 'Lesson Plan' && <BookOpen size={14} className="text-indigo-500" />}
                    {activity.activity_type === 'Quiz' && <FileQuestion size={14} className="text-amber-500" />}
                    {activity.activity_type === 'Question Paper' && <ClipboardCheck size={14} className="text-teal-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{activity.activity_type}</p>
                    <p className="text-xs text-gray-400">
                      {activity.subject} - Grade {activity.grade}
                    </p>
                  </div>
                  <Calendar size={14} className="text-gray-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <FileText size={24} className="text-indigo-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">No Recent Activity</p>
              <p className="text-xs text-gray-500 mt-0.5">No lessons or quizzes created yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Button - orange/red per screenshot */}
      <div className="flex justify-end mt-6">
        <button className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Download size={16} />
          Export Report (CSV)
        </button>
      </div>
    </div>
  );
};

export default TeacherDetail;
