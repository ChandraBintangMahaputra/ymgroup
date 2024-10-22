import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../constants/DarkModeProvider';

const ArticleCountCard = () => {
  const [totalarticles, setTotalarticles] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const {darkMode} = useDarkMode()

  useEffect(() => {
    const fetcharticleCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/dashboard/count-article`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalarticles(data.data[0].total_article);
        }
      } catch (error) {
        console.error('Error fetching article count:', error);
      }
    };

    fetcharticleCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalarticles / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalarticles) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalarticles);
      }
    };

    if (totalarticles > 0) {
      animateCount();
    }
  }, [totalarticles]);

  return (
    <div
      className={`${darkMode ? "bg-gray-700 text-white": "bg-white text-green-700"} w-full h-[200px] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center transition-shadow duration-300 ease-in-out hover:shadow-xl`}
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px'
      }}
    >
      <h1 className="text-4xl font-bold text-center">{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center">Jumlah Artikel Publish</h2>
    </div>
  );
};

export default ArticleCountCard;
