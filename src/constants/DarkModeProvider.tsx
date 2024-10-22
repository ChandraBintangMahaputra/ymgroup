import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Buat context
const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

// Buat provider
export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cek apakah dark mode sudah disimpan di localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; // Konversi string 'true' ke boolean
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Simpan status dark mode ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Buat custom hook untuk menggunakan context
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};
