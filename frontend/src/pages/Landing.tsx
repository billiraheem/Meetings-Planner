import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../components/Button';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSignUpClick = () => {
    navigate('/signup');
  };
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Bills Scheduler</h1>
        <p className="landing-description">
          An easy way to manage your meetings and stay organized.
          Schedule, track, and manage your meetings all in one place.
        </p>
        
        <div className="landing-buttons">
          <CustomButton 
            onClick={handleSignUpClick}
            className="signup-btn"
          >
            Sign Up
          </CustomButton>
          
          <CustomButton 
            onClick={handleLoginClick}
            className="login-btn"
          >
            Login
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
