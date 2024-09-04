import { useEffect, useState } from 'react';

const FirstPaymentCountCard = () => {
  const [totalFirstPayment, setTotalFirstPayment] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    const fetchFirstPaymentCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/first-payment`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalFirstPayment(data.data[0].totalFirstPayment);
        }
      } catch (error) {
        console.error('Error fetching FirstPayment count:', error);
      }
    };

    fetchFirstPaymentCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalFirstPayment / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalFirstPayment) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalFirstPayment);
      }
    };

    if (totalFirstPayment > 0) {
      animateCount();
    }
  }, [totalFirstPayment]);

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
      <h1 className="text-4xl font-bold text-center" style={{color:'#facc15'}}>{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center" style={{color:'#facc15'}}>Jumlah Mahsiswa yang Bayar Cicilan Pertama</h2>
    </div>
  );
};

export default FirstPaymentCountCard;
