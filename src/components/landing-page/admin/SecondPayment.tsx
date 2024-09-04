import { useEffect, useState } from 'react';

const SecondPaymentCountCard = () => {
  const [totalSecondPayment, setTotalSecondPayment] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    const fetchSecondPaymentCount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PREFIX_BACKEND}/api/fieldtrip/second-payment`);
        const data = await response.json();
        if (data.success && data.status === 200) {
          setTotalSecondPayment(data.data[0].totalSecondPayment);
        }
      } catch (error) {
        console.error('Error fetching Second Payment count:', error);
      }
    };

    fetchSecondPaymentCount();
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = totalSecondPayment / (duration / 16.67);

    const animateCount = () => {
      start += increment;
      if (start < totalSecondPayment) {
        setDisplayedCount(Math.floor(start));
        requestAnimationFrame(animateCount);
      } else {
        setDisplayedCount(totalSecondPayment);
      }
    };

    if (totalSecondPayment > 0) {
      animateCount();
    }
  }, [totalSecondPayment]);

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
      <h1 className="text-4xl font-bold text-center" style={{color:'#84cc16'}}>{displayedCount}</h1>
      <h2 className="text-xl font-semibold mt-6 text-center" style={{color:'#84cc16'}}>Jumlah Mahsiswa yang Bayar Cicilan Kedua</h2>
    </div>
  );
};

export default SecondPaymentCountCard;
