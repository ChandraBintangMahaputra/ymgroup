import { useEffect, useState } from 'react';

const DonePaymentCountCard = () => {
  const [totalDonePayment, setTotalDonePayment] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    const fetchDonePaymentCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/done-payment`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalDonePayment(data.data[0].totalDonePayment);
        }
      } catch (error) {
        console.error('Error fetching DonePayment count:', error);
      }
    };

    fetchDonePaymentCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalDonePayment / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalDonePayment) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalDonePayment);
      }
    };

    if (totalDonePayment > 0) {
      animateCount();
    }
  }, [totalDonePayment]);

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
      <h1 className="text-4xl font-bold text-center" style={{color:'#22c55e'}}>{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center" style={{color:'#22c55e'}}>Jumlah Mahsiswa yang Lunas</h2>
    </div>
  );
};

export default DonePaymentCountCard;
