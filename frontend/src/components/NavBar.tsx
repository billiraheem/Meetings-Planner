import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomButton } from './Button';
import { faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { CalendarWidget } from './CalendarWidget';
// import { authAPI } from '../APIs/api';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = localStorage.getItem('accessToken') !== null;

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken');
      // await authAPI.logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Don't show nav on landing, login or signup pages
  if (!isAuthenticated ||
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className='navbar-left'>
        <CustomButton
          className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
          onClick={handleHomeClick}
        >
          <FontAwesomeIcon icon={faHome} />
          <span>Home</span>
        </CustomButton>
      </div>

      <div className="navbar-menu">
        <CalendarWidget />
        <CustomButton
          className="nav-item logout"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </CustomButton>
      </div>
    </nav>
  );
};



// const isLoggedIn = !!localStorage.getItem('accessToken');
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     navigate('/');
//   };


//   return (
//     <nav className="navbar">
//       {isLoggedIn ? (
//         <>
//             <Link className='home' to="/home">
//               <FontAwesomeIcon icon={faHome} size='lg' /> Home
//             </Link>

//           <div>
//             <CustomButton onClick={handleLogout} className='logout-btn'>
//               Logout
//             </CustomButton>
//           </div>
//         </>
//       ) : (
//         <div className='auth'>
//           <p>You have to sign up or log in to access your meetings</p>
//         </div>
//       )}
//     </nav>
//   );