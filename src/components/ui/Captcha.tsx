import React, { useState } from 'react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify }) => {
  const [num1, setNum1] = useState<number>(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState<number>(Math.floor(Math.random() * 10));
  const [userInput, setUserInput] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const verifyCaptcha = () => {
    const correctAnswer = num1 + num2;
    const isValid = parseInt(userInput) === correctAnswer;
    setIsVerified(isValid);
    setError(isValid ? '' : 'Captcha salah, coba lagi.');
    onVerify(isValid);
  };

  const regenerateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setUserInput('');
    setIsVerified(false);
    setError('');
    onVerify(false);
  };

  return (
    <div className="flex flex-col items-start p-4 border rounded shadow-md">
      <div className="mb-2">
        <p className="text-lg">Jawab Pertanyaan:</p>
        <strong className="text-xl">{num1} + {num2} = ?</strong>
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isVerified}
        placeholder="Masukkan Jawaban"
        className="border rounded px-3 py-2 mt-2 text-center w-full"
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={verifyCaptcha}
          disabled={isVerified}
          className={`px-4 py-2 rounded ${isVerified ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          Verifikasi
        </button>
        <button
          onClick={regenerateCaptcha}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Perbarui Captcha
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isVerified && <p className="text-green-500 mt-2">Captcha Terverifikasi!</p>}
    </div>
  );
};

export default Captcha;
