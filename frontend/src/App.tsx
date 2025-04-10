import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/HomePage';
import { MeetingDetails } from './pages/MeetingsDetails';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import { Navbar } from './components/NavBar';
import { Landing } from './pages/Landing';
import { PrivateRoute } from './components/PrivateRoutes';
import { Calendar } from './pages/Calendar';
import { MeetingForm } from './pages/MeetingForm';


export const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              }
            />

            <Route
              path="/meeting/:id"
              element={
                <PrivateRoute>
                  <MeetingDetails />
                </PrivateRoute>
              }
            />

            <Route
              path="/meeting/new"
              element={
                <PrivateRoute>
                  <MeetingForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/meeting/edit/:id"
              element={
                <PrivateRoute>
                  <MeetingForm />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;


{/* <Router>
<div className="app">
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<Home />} /> {/*<ProtectedRoute><Home /></ProtectedRoute> */}
//     <Route path="/create-meeting" element={<CreateMeeting />} />
//     <Route path="/meeting/:id" element={<MeetingDetails />} />
//   </Routes>
//   <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
// </div>
// </Router> */}

{/* <Router> */ }
{/* <AuthProvider> */ }
// <NavBar />
// <Routes>
// <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
// <Route path="/login" element={<Login />} />
// <Route path="/signup" element={<Signup />} />
// <Route path="/meeting/:id" element={<MeetingDetails />} />
// <Route path="/create" element={<MeetingCreate />} />
// <Route path="/search" element={<SearchPage />} />
// </Routes>
{/* </AuthProvider> */ }
// </Router>

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Home } from './pages/HomePage';
// import { MeetingDetails } from './pages/MeetingsDetails';

// export const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/meeting/:id" element={<MeetingDetails />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
