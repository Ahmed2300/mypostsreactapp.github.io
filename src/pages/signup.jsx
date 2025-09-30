import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    confirmPassword: '',
    avatarUrl: ''
  });
  const [errors, setErrors] = useState({ 
    name: false,
    email: false, 
    password: false,
    confirmPassword: false,
    avatarUrl: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [signupError, setSignupError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const IMGBB_API_KEY = "eaba1bc0300ab3681e35e1eef62d2503";
const [users, setUsers] = useState([]);
useEffect(() => {

  async function getusers(){
    try {
      const response = await fetch("https://posts-a6aaf-default-rtdb.firebaseio.com/users.json");
      if (response.ok){
        
        setUsers(await response.json());
       
      }
    }
    catch (error){
      console.log(error);
    }
  }
  getusers();
  
    
    
    
}, [])



const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });



  const uploadToImgbb = async (file) => {
    // 1. convert to data url
    const dataUrl = await fileToDataUrl(file); // e.g. "data:image/png;base64,...."
    const base64Str = dataUrl.split(",")[1]; // remove "data:*/*;base64,"

    // 2. prepare request
    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const form = new FormData();
    form.append("image", base64Str);
    // optional: form.append("name", "my-avatar");

    // 3. send with axios
    const resp = await axios.post(url, form);
    // resp.data matches example: { data: { display_url: "...", url: "...", ... }, success: true }
    return resp.data?.data?.display_url || resp.data?.data?.url;
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
   
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
   
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Store the file path/name (in a real app, you'd upload to a server)
      setFormData(prev => ({ ...prev, avatarUrl: previewUrl }));
      
      // Clear error
      if (errors.avatarUrl) {
        setErrors(prev => ({ ...prev, avatarUrl: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation
    const newErrors = {
      name: !formData.name || formData.name.length < 2,
      email: !formData.email || !formData.email.includes('@'),
      password: !formData.password || formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword,
      avatarUrl: !formData.avatarUrl
    };
    
    setErrors(newErrors);
    
    if (!Object.values(newErrors).some(error => error)) {
      // Create new user object
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        name: formData.name,
        email: formData.email,
        passwordHash: formData.password, // In real app, this would be hashed
        avatarUrl: formData.avatarUrl
      };

      try {
        

        let existinguser = users.find(user => user.email === formData.email);

        if(typeof existinguser !== "undefined"){
          setIsLoading(false);
          setSignupError(`This email is already registered please use another email`);
          console.error("User Already Registered");
        }
        else{
          setIsLoading(true);
          uploadToImgbb(selectedFile).then((url) => {
            newUser.avatarUrl = url;
            console.log(newUser);
            adduser(newUser);
            setIsLoading(false);
          });
        }
        
      } catch (error) {
        console.error("Signup failed:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };



  const adduser =async(Addeduser)=>{
    try {
 
      const response =await axios.put(`https://posts-a6aaf-default-rtdb.firebaseio.com/users/${users.length}.json`,Addeduser);
      if(response.status === 200){
        console.log("User added successfully");
        localStorage.setItem("user", JSON.stringify(Addeduser));
        navigate("/");
        onLogin(Addeduser);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setIsLoading(false);
    }
  }


  return (

    
    <div className="mt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="./../src/assets/Hyicon.png" 
              alt="HELLOLY Logo" 
              className="w-12 h-12 rounded-lg"
            />
           


           
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our community today</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">

            
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <label htmlFor="avatar" className="w-24 h-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:border-blue-300 transition-colors"  >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </label>
                <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500">Upload your profile picture</p>
              {errors.avatarUrl && (
                <p className="text-red-500 text-sm">Please select a profile picture</p>
              )}
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">Name must be at least 2 characters long</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">Password must be at least 6 characters long</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>


             {/* Login Error Display */}
             {signupError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{signupError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/sigin_page" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>This app is created by  <span className='text-blue-600 hover:text-blue-700 font-medium'>Ahmed Amr</span> &copy; 2025 I hope you Like it</p>
        </div>
      </div>
    </div>
  );
}
