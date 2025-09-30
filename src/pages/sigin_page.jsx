import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HyiconLogo from '../assets/Hyicon.png'

export default function SiginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loginError, setLoginError] = useState('');
  

useEffect(() => {
async function loadusers() {
  try {
    const response = await fetch("https://posts-a6aaf-default-rtdb.firebaseio.com/users.json");

    if (response.ok){
    
      setUsers(await response.json());
      console.log(users.length);
    }
  }
  catch (error){
    console.log(error);
  }
}
loadusers();
}, []);





  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    let newErrors = {
      email: !formData.email || !formData.email.includes('@'),
      password: !formData.password || formData.password.length < 6
    };
    
    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password) {
     let user = users.find(user => user.email === formData.email && user.passwordHash === formData.password
     );
    
setTimeout(()=>{if(typeof user == "undefined"){
  setIsLoading(false);
  setLoginError(`This user not found in our database please signup first`);
  console.error("User Not Found");
}
else{
 localStorage.setItem("user", JSON.stringify(user));
 
 // Update the App component's state immediately

 
 setTimeout(() => {
   setIsLoading(false);
   navigate("/");
   onLogin(user);  
 }, 1500);
}},1500)
     

    
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <img 
              src={HyiconLogo} 
              alt="HELLOLY Logo" 
              className="w-20 h-20 rounded-xl mb-4 shadow-lg mx-auto"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sign in to your HELLOLY account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">Please enter a valid email address</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-left">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 animate-pulse">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Login Error Display */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{loginError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>


          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup_page')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center justify-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  )
} 
