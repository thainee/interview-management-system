export const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return true;
    
    return new Date().getTime() > parseInt(expirationTime, 10);
  };
  
  export const removeExpiredToken = () => {
    if (isTokenExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
    }
  };