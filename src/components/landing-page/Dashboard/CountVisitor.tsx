import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../constants/DarkModeProvider';

const VisitorCountCard = () => {
  const [totalvisitors, setTotalvisitors] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const {darkMode} = useDarkMode()

  useEffect(() => {
    const fetchvisitorCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/dashboard/count-visitor`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalvisitors(data.data[0].total_visit);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };

    fetchvisitorCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalvisitors / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalvisitors) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalvisitors);
      }
    };

    if (totalvisitors > 0) {
      animateCount();
    }
  }, [totalvisitors]);

  return (
    <div
      className={`${darkMode ? "bg-gray-700 text-white": "bg-white text-blue-500"} w-full h-[200px] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center transition-shadow duration-300 ease-in-out hover:shadow-xl`}
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px'
      }}
    >
      <h1 className="text-4xl font-bold text-center">{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center">Jumlah visitor</h2>
    </div>
  );
};

export default VisitorCountCard;
