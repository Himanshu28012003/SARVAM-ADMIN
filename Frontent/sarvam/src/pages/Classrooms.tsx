import { School } from 'lucide-react';

const Classrooms = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full">
      <School size={64} className="text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Classrooms</h2>
      <p className="text-gray-500">Classroom management coming soon...</p>
    </div>
  );
};

export default Classrooms;
