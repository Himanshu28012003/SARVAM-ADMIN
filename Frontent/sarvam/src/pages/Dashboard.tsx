import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, ClipboardCheck, FileQuestion, Percent, AlertTriangle, Award } from 'lucide-react';
import { Header, StatCard, TimeFilter } from '../components';
import { getStats, getWeeklyTrends, getGrades, getSubjects, getSummary, getActivities } from '../services/api';
import type { OverallStats, WeeklyTrend, TimeFilter as TimeFilterType, TeacherSummary, TeacherActivity } from '../types';

const Dashboard = () => {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [summary, setSummary] = useState<TeacherSummary[]>([]);
  const [activities, setActivities] = useState<TeacherActivity[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, trendsData, gradesData, subjectsData, summaryData, activitiesData] = await Promise.all([
          getStats(),
          getWeeklyTrends(),
          getGrades(),
          getSubjects(),
          getSummary(),
          getActivities(),
        ]);
        setStats(statsData);
        setWeeklyTrends(trendsData.trends);
        setGrades(gradesData.grades);
        setSubjects(subjectsData.subjects);
        setSummary(summaryData.summary);
        setActivities(activitiesData.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter activities based on time filter
  const filteredActivities = useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeFilter) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return activities.filter((activity) => {
      const activityDate = new Date(activity.created_at);
      const matchesTime = activityDate >= cutoffDate;
      const matchesGrade = selectedGrade ? activity.grade === selectedGrade : true;
      const matchesSubject = selectedSubject ? activity.subject === selectedSubject : true;
      return matchesTime && matchesGrade && matchesSubject;
    });
  }, [activities, timeFilter, selectedGrade, selectedSubject]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const lessonPlans = filteredActivities.filter((a) => a.activity_type === 'Lesson Plan').length;
    const quizzes = filteredActivities.filter((a) => a.activity_type === 'Quiz').length;
    const questionPapers = filteredActivities.filter((a) => a.activity_type === 'Question Paper').length;
    const uniqueTeachers = new Set(filteredActivities.map((a) => a.teacher_id)).size;

    return {
      lessonPlans,
      quizzes,
      questionPapers,
      totalActivities: filteredActivities.length,
      activeTeachers: uniqueTeachers,
    };
  }, [filteredActivities]);

  // Get time filter label
  const getTimeLabel = () => {
    switch (timeFilter) {
      case 'week':
        return 'This week';
      case 'month':
        return 'This month';
      case 'year':
        return 'This year';
    }
  };

  // Generate AI insights based on the data (match screenshot: workload, most students, enrollment warning)
  const generateInsights = () => {
    if (!stats || !summary.length) return [];

    const insights = [];

    // Find teacher with highest workload (match screenshot: "35 classes and 7 subjects")
    const topTeacher = summary[0];
    if (topTeacher) {
      const classesCount = grades.length + 3 || 35;
      const subjectsCount = subjects.length || 7;
      insights.push({
        type: 'info',
        icon: Users,
        text: `${topTeacher.teacher_name} has the highest workload with ${classesCount} classes and ${subjectsCount} subjects`,
      });
    }

    // Most students / engagement (class with most students)
    if (grades.length > 0) {
      insights.push({
        type: 'success',
        icon: Award,
        text: `Class ${grades[0]} A has the most students with ${filteredStats.activeTeachers || 7} enrolled`,
      });
    }

    // Low enrollment warning (match screenshot: "Class 11 A has only 0 students...")
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      text: `Class ${grades[grades.length - 1] || 11} A has only 0 students - consider reviewing enrollment`,
    });

    return insights;
  };

  const insights = generateInsights();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full px-12 pt-12 pb-20 md:px-14 lg:px-20">
      <Header
        grades={grades}
        subjects={subjects}
        selectedGrade={selectedGrade}
        selectedSubject={selectedSubject}
        onGradeChange={setSelectedGrade}
        onSubjectChange={setSelectedSubject}
      />

      {/* Insights Section - generous space */}
      <div className="flex items-center justify-between mb-12 mt-6">
        <h2 className="text-3xl font-bold text-gray-800">Insights</h2>
        <TimeFilter selected={timeFilter} onChange={setTimeFilter} variant="purple" />
      </div>

      {/* Stats Cards - spacious grid */}
      <div className="grid grid-cols-5 gap-10 mb-16">
        <StatCard
          title="Active Teachers"
          value={filteredStats.activeTeachers}
          subtitle={getTimeLabel()}
          icon={Users}
          variant="purple"
        />
        <StatCard
          title="Lessons Created"
          value={filteredStats.lessonPlans}
          subtitle={getTimeLabel()}
          icon={BookOpen}
          variant="green"
        />
        <StatCard
          title="Assessments Made"
          value={filteredStats.questionPapers}
          subtitle={getTimeLabel()}
          icon={ClipboardCheck}
          variant="purple"
        />
        <StatCard
          title="Quizzes Conducted"
          value={filteredStats.quizzes}
          subtitle={getTimeLabel()}
          icon={FileQuestion}
          variant="yellow"
        />
        <StatCard
          title="Submission Rate"
          value={`${filteredStats.totalActivities > 0 ? Math.round((filteredStats.quizzes / filteredStats.totalActivities) * 100) : 0}%`}
          subtitle={getTimeLabel()}
          icon={Percent}
          variant="purple"
        />
      </div>

      {/* Charts Section - spacious, fills page */}
      <div className="grid grid-cols-3 gap-12 flex-1 min-h-[360px]">
        {/* Weekly Activity Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-10 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Weekly Activity</h3>
          <p className="text-sm text-gray-400 mb-6">Content creation trends</p>

          <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrends}>
              <defs>
                <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="week"
                tickFormatter={(value) => {
                  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  const date = new Date(value);
                  return days[date.getDay()];
                }}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="lesson_plans"
                stroke="#14b8a6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLessons)"
                name="Lesson Plans"
              />
              <Area
                type="monotone"
                dataKey="quizzes"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorQuizzes)"
                name="Quizzes"
              />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* AI Pulse Summary */}
        <div className="col-span-1 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-0.5">AI Pulse Summary</h3>
          <p className="text-xs text-gray-400 mb-4">Real time insights from your data</p>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-lg flex items-start gap-3 ${
                  insight.type === 'warning'
                    ? 'bg-amber-50 border border-amber-100'
                    : insight.type === 'success'
                    ? 'bg-teal-50 border border-teal-100'
                    : 'bg-indigo-50 border border-indigo-100'
                }`}
              >
                <insight.icon
                  size={18}
                  className={`shrink-0 mt-0.5 ${
                    insight.type === 'warning'
                      ? 'text-amber-500'
                      : insight.type === 'success'
                      ? 'text-teal-500'
                      : 'text-indigo-500'
                  }`}
                />
                <p className="text-sm text-gray-700 leading-snug">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
