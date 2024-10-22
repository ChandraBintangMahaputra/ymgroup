import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../constants/DarkModeProvider';

const CourseCountCard = () => {
  const [totalcourses, setTotalcourses] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const {darkMode} = useDarkMode()

  useEffect(() => {
    const fetchcourseCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/dashboard/count-course`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalcourses(data.data[0].total_course);
        }
      } catch (error) {
        console.error('Error fetching course count:', error);
      }
    };

    fetchcourseCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalcourses / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalcourses) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalcourses);
      }
    };

    if (totalcourses > 0) {
      animateCount();
    }
  }, [totalcourses]);

  return (
    <div
      className={`${darkMode ? "bg-gray-700 text-white": "bg-white text-yellow-900"} w-full h-[200px] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center transition-shadow duration-300 ease-in-out hover:shadow-xl`}
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px'
      }}
    >
      <h1 className="text-4xl font-bold text-center">{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center">Jumlah Course Publish</h2>
    </div>
  );
};

export default CourseCountCard;
