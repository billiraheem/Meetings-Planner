import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomInput } from './Input';
import { CustomButton } from './Button';

interface NavBarProps {
  onSearch: (term: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        🏠 Home
      </Link>

      <div className='search-container'>
        <CustomInput
          className='search-input'
          type="text"
          placeholder="🔍 Search Meetings..."
          value={searchTerm}
          onChange={(e) => {
          const trimmedValue = e.target.value.trim();
          setSearchTerm(trimmedValue);
          onSearch(trimmedValue);
        }}
        />
      </div>

      <Link to="/create" className="nav-link">
        <CustomButton text='New Meeting' className='add-meeting-btn' icon='+'/>
          {/* ➕ Create */}
      </Link>
    </nav>
  );
};