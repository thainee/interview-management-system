import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  

const useUserScope = () => {
  const [scope, setScope] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setScope(decoded.scope);
      } catch (error) {
        console.error("Invalid token:", error);
        setScope(null);
      }
    }
  }, []);

  return scope;
};

export default useUserScope;