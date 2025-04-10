import React from 'react';
import { Navigate } from 'react-router-dom';

// Private route component
export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};


// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
// };

// export default ProtectedRoute;