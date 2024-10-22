import { useEffect, useState } from 'react';
import { useDarkMode } from '../../../constants/DarkModeProvider';

const UserDiscussionCountCard = () => {
  const [totalusers, setTotalusers] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
  const {darkMode} = useDarkMode()

  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);

 
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);


  useEffect(() => {
    if (userId) {
      const fetchUserCount = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_PREFIX_BACKEND}/api/dashboard/user-discussion/${userId}`
          );
          const data = await response.json();
          if (data.success && data.status === 200) {
            setTotalusers(data.data[0].total_discussion);
          }
        } catch (error) {
          console.error("Error fetching user count:", error);
        }
      };

      fetchUserCount();
    }
  }, [userId]);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalusers / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalusers) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalusers);
      }
    };

    if (totalusers > 0) {
      animateCount();
    }
  }, [totalusers]);

  return (
    <div
      className={`${darkMode ? "bg-gray-700 text-white": "bg-white text-purple-900"} w-full h-[200px] p-6 rounded-lg shadow-lg flex flex-col justify-center items-center transition-shadow duration-300 ease-in-out hover:shadow-xl`}
      style={{
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)',
        borderRadius: '12px',
        padding: '20px'
      }}
    >
      <h1 className="text-4xl font-bold text-center">{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center">My Topic Discuss</h2>
    </div>
  );
};

export default UserDiscussionCountCard;
