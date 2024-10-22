export const checkSessionExpiry = () => {
    const userData = localStorage.getItem("userData");
    if (!userData) return false;
  
    const { timestamp } = JSON.parse(userData);
    const currentTime = new Date().getTime();
  
    // 5 jam dalam milidetik = 5 * 60 * 60 * 1000
    const fiveHours = 5 * 60 * 60 * 1000;
  
    return currentTime - timestamp > fiveHours;
  };
  
  export const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("currentUser");
  };
  