import React from 'react'

export default function PostLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Grid layout matching the posts page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-pulse"
          >
            {/* Featured image placeholder */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
            
            <div className="p-5">
              {/* Author info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded opacity-60"></div>
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-3">
                <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-5 bg-gray-300 rounded w-4/5"></div>
              </div>

              {/* Description */}
              <div className="mb-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                <div className="h-6 bg-gray-100 rounded-full w-12"></div>
                {index % 3 === 0 && <div className="h-6 bg-gray-100 rounded-full w-14"></div>}
              </div>

              {/* Engagement metrics */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-6"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex justify-center items-center py-12 mt-8">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <span className="ml-3 text-gray-500 text-sm font-medium">Loading more posts...</span>
      </div>
    </div>
  )
}