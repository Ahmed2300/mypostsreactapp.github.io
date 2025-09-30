import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-6 py-12 max-w-lg">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Go Back Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? <span className="text-indigo-600 hover:text-indigo-700 cursor-pointer">Contact support</span></p>
        </div>
      </div>
    </div>
  )
}
