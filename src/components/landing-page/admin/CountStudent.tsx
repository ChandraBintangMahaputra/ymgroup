import { useEffect, useState } from 'react';

const StudentCountCard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/count-student`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalStudents(data.data[0].totalStudents);
        }
      } catch (error) {
        console.error('Error fetching student count:', error);
      }
    };

    fetchStudentCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalStudents / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalStudents) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalStudents);
      }
    };

    if (totalStudents > 0) {
      animateCount();
    }
  }, [totalStudents]);

  return (
    <div
      className="w-full h-[200px] p-6 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center transition-shadow duration-300 ease-in-out hover:shadow-xl"
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#ffffff',
      }}
    >
      <h1 className="text-4xl font-bold text-blue-600 text-center">{displayedCount}</h1>
      <h2 className="text-xl font-semibold text-blue-600 mt-6 text-center">Jumlah Mahasiswa Aktif</h2>
    </div>
  );
};

export default StudentCountCard;
