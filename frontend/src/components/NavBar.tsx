import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomInput } from './UI/Input';

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

      <CustomInput
        label="Search"
        type="text"
        placeholder="🔍 Search Meetings..."
        value={searchTerm}
        onChange={(e) => {
          const trimmedValue = e.target.value.trim();
          setSearchTerm(trimmedValue);
          onSearch(trimmedValue);
        }}
      />

      <Link to="/create" className="nav-link">
        ➕ Create
      </Link>
    </nav>
  );
};

// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { CustomInput } from './UI/Input';

// export const NavBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   return (
//     <nav className="navbar">
//         <Link to="/">🏠 Home</Link>
//         <CustomInput label='Search'
//         type='text' 
//         placeholder='🔍 Search Meetings...' 
//         value='searchTerm' 
//         onChange={(e) => {
//             setSearchTerm(e.target.value);
//             onSearch(e.target.value)
//         }}>

//         </CustomInput>
//         <Link to="/create">➕ Create</Link>
//     </nav>
//   );
// };

{/* <input 
        type="text" 
        placeholder="🔍 Search Meetings..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }} 
      /> */}