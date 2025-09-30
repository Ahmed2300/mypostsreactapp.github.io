import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './navbar'
import Postcard from './postcard'
import SiginPage from './pages/sigin_page'
import Error from './pages/Error'
import { Routes, Route } from 'react-router-dom';
import Signup from './pages/signup';
import AddPost from './pages/addpost';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("user") ? true : false);
  const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) :  null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    console.log(storedUser);
    if (storedUser == null || storedUser == undefined) {
      setUser(null);
      setIsAuth(false);
    } else { 
      setIsAuth(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to update auth state after login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuth(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuth(false);
  };
  return (
    <div className="app-container">
      <Navbar isAuth={isAuth} user={user} onLogout={handleLogout}/>
      <Routes>
        <Route path="/" element={
          <div className='postcards-scrollable flex flex-col gap-4 p-4 justify-center items-center pt-20'>
            <Postcard isAuth={isAuth} user={user} />
          </div>
        } />
        
        <Route path="/sigin_page" element={<SiginPage onLogin={handleLogin} />} />
        <Route path="/signup_page" element={<Signup onLogin={handleLogin} />} />
        <Route path="/addpost" element={<AddPost />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}


export default App
