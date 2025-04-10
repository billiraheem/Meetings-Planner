import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('accessToken')
  );
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    navigate('/login')
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// import React, { createContext, useContext, useReducer, useEffect } from 'react';
// import axios from 'axios';
// import { User, AuthState } from '../types';

// interface AuthContextType {
//   authState: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
//   isAdmin: false,
//   loading: true,
//   error: null
// };

// type AuthAction =
//   | { type: 'LOGIN_SUCCESS'; payload: { user: User; isAdmin: boolean } }
//   | { type: 'LOGIN_FAILURE'; payload: string }
//   | { type: 'LOGOUT' }
//   | { type: 'CLEAR_ERROR' }
//   | { type: 'SET_LOADING'; payload: boolean };

// const authReducer = (state: AuthState, action: AuthAction): AuthState => {
//   switch (action.type) {
//     case 'LOGIN_SUCCESS':
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//         isAdmin: action.payload.isAdmin,
//         loading: false,
//         error: null
//       };
//     case 'LOGIN_FAILURE':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         isAdmin: false,
//         loading: false,
//         error: action.payload
//       };
//     case 'LOGOUT':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         isAdmin: false,
//         loading: false,
//         error: null
//       };
//     case 'CLEAR_ERROR':
//       return {
//         ...state,
//         error: null
//       };
//     case 'SET_LOADING':
//       return {
//         ...state,
//         loading: action.payload
//       };
//     default:
//       return state;
//   }
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [authState, dispatch] = useReducer(authReducer, initialState);

//   // Configure axios
//   axios.defaults.baseURL = 'http://localhost:8080/api';

//   // Set auth token for every request if present
//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [authState.isAuthenticated]);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('accessToken');
//       if (token) {
//         try {
//           // Verify token validity or get user info
//           const response = await axios.get('/auth/me'); // Create this endpoint on your backend
//           dispatch({
//             type: 'LOGIN_SUCCESS',
//             payload: {
//               user: response.data.data,
//               isAdmin: response.data.isAdmin || false
//             }
//           });
//         } catch (error) {
//           localStorage.removeItem('accessToken');
//           dispatch({ type: 'LOGOUT' });
//         }
//       } else {
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const response = await axios.post('/auth/login', { email, password });

//       if (response.data.Success) {
//         localStorage.setItem('accessToken', response.data.accessToken);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;

//         // Get user details
//         const userResponse = await axios.get('/auth/me'); // Create this endpoint on your backend

//         dispatch({
//           type: 'LOGIN_SUCCESS',
//           payload: {
//             user: userResponse.data.data,
//             isAdmin: response.data.isAdmin || false
//           }
//         });
//       } else {
//         dispatch({ type: 'LOGIN_FAILURE', payload: response.data.errorMessage || 'Login failed' });
//       }
//     } catch (error: any) {
//       dispatch({
//         type: 'LOGIN_FAILURE',
//         payload: error.response?.data?.errorMessage || 'Login failed. Please check your credentials.'
//       });
//     }
//   };

//   const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       const response = await axios.post('/auth/signup', {
//         name,
//         email,
//         password,
//         confirmPassword
//       });

//       if (response.data.Success) {
//         // Auto login after signup
//         await login(email, password);
//       } else {
//         dispatch({ type: 'LOGIN_FAILURE', payload: response.data.errorMessage || 'Registration failed' });
//       }
//     } catch (error: any) {
//       dispatch({
//         type: 'LOGIN_FAILURE',
//         payload: error.response?.data?.errorMessage || 'Registration failed. Please try again.'
//       });
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('accessToken');
//       delete axios.defaults.headers.common['Authorization'];
//       dispatch({ type: 'LOGOUT' });
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ authState, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // import React, { createContext, useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import authAPI from '../APIs/authAPI';

// // interface AuthContextType {
// //   user: any;
// //   token: string | null;
// //   signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => void;
// // }

// // export const AuthContext = createContext<AuthContextType | null>(null);

// // export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// //     const [user, setUser] = useState<any>(null);
// //     const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         const storedUser = localStorage.getItem('user');
// //         if (storedUser && token) {
// //             setUser(JSON.parse(storedUser));
// //         }
// //     }, [token]);

// //     const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
// //         console.log('Signup function called');
// //         try {
// //           const response = await authAPI.signup({ name, email, password, confirmPassword });
// //           console.log('Signup response:', response);
// //           setUser(response.user);
// //           setToken(response.token);
// //           localStorage.setItem('user', JSON.stringify(response.user));
// //           localStorage.setItem('token', response.token);
// //           navigate('/');
// //         } catch (error) {
// //           console.error('Signup failed:', error);
// //         }
// //     };

// //     const login = async (email: string, password: string) => {
// //         try {
// //           const response = await authAPI.login({ email, password });
// //           console.log('Login response:', response); // Debugging

// //             if (!response.token || !response.user) {
// //               throw new Error('Invalid login response from server');
// //         }
// //           setUser(response.user);
// //           setToken(response.token);
// //           localStorage.setItem('user', JSON.stringify(response.user));
// //           localStorage.setItem('token', response.token);
// //           setTimeout(() => navigate('/'), 0);
// //         //   navigate('/');
// //         } catch (error) {
// //           console.error('Login failed:', error);
// //         }
// //     };

// //     const logout = () => {
// //         authAPI.logout();
// //         setUser(null);
// //         setToken(null);
// //         navigate('/login');
// //     };

// //     return (
// //         <AuthContext.Provider value={{ user, token, signup, login, logout }}>
// //           {children}
// //         </AuthContext.Provider>
// //       );
// // }