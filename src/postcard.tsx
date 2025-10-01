import React, { useState, useEffect } from 'react'

import { HeartIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';


import PostLoading from './pages/postLoading';
import { Link } from 'react-router-dom';







interface Post {
  id: number;
  userId: number;
  user: {
    name: string;
    avatarUrl: string;
  };
  title: string;
  body: string;
  imageUrl: string;
  timestamp: string;
  postType: "text" | "image" | "mix";
}


 

export default function Postcard({dataa =[] , isAuth, user} ) {





  
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
   const loadposts= async ()=> {
    try{
      const response = await fetch("https://posts-a6aaf-default-rtdb.firebaseio.com/posts.json");
      
      if (response.ok){

    const data = await response.json()
      setData(data.filter(post => post !== null && post !== undefined).reverse());
      setLoading(false);
      console.log(data);
      console.log(dataa);
      }
    }
    catch(e){
      console.error(e);
      setError("Failed to load posts");


    }

   }

    loadposts();
  }, []);

  



  const deletepost = async (id: number) => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    
    if (!confirmed) {
      return; // User cancelled, don't delete
    }

    try {
      // Remove post from local state immediately
      const updatedData = data.filter(post => post.id !== id);
      setData(updatedData);
      
      // Update the entire posts collection in Firebase
      const response = await fetch("https://posts-a6aaf-default-rtdb.firebaseio.com/posts.json", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        console.log('Posts updated successfully after deletion');
      } else {
        // If Firebase update fails, revert local state
        setData(data);
        console.error('Failed to update posts in Firebase');
      }
    } catch (e) {
      // If error occurs, revert local state
      setData(data);
      console.error('Error deleting post:', e);
    }
  };

  const startEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditTitle(post.title);
    setEditBody(post.body);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditBody('');
  };

  const saveEdit = async (id: number) => {
    try {
      // Update the post in local state
      const updatedData = data.map(post => 
        post.id === id 
          ? { ...post, title: editTitle, body: editBody }
          : post
      );
      setData(updatedData);
      
      // Update the entire posts collection in Firebase
      const response = await fetch("https://posts-a6aaf-default-rtdb.firebaseio.com/posts.json", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (response.ok) {
        console.log('Post updated successfully');
        setEditingPost(null);
        setEditTitle('');
        setEditBody('');
      } else {
        // If Firebase update fails, revert local state
        setData(data);
        console.error('Failed to update post in Firebase');
      }
    } catch (e) {
      // If error occurs, revert local state
      setData(data);
      console.error('Error updating post:', e);
    }
  };

  if (loading) {
    return <PostLoading />;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-8">No posts found.</div>;
  }

 return (
    <>
     <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        {/* Posts Feed */}
        <div className="space-y-6">
          {data.filter(post => post !== null && post !== undefined).map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <img 
                    className="w-10 h-10 rounded-full object-cover" 
                    src={post.user.avatarUrl} 
                    alt={`${post.user.name}'s avatar`} 
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{post.user.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {/* Edit and Delete buttons - only show for post owner */}
                {user && user.id === post.userId && (
                  <div className="flex items-center space-x-2">
                    {/* Edit button */}
                    <button 
                      onClick={() => startEdit(post)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    {/* Delete button */}
                    <button onClick={()=>deletepost(post.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Text Content Section - for text and mix types */}
              {(post.postType === "text" || post.postType === "mix") && (post.title || post.body) && (
                <div className="px-4 pb-3">
                  {editingPost === post.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Post title..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        placeholder="What's on your mind?"
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(post.id)}
                          className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      {post.title && (
                        <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      )}
                      {post.body && (
                        <p className="text-gray-700 text-sm leading-relaxed">{post.body}</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Image Container - for image and mix types */}
              {(post.postType === "image" || post.postType === "mix") && post.imageUrl && (
                <div className="relative bg-gray-100">
                  <img 
                    className="w-full object-cover" 
                    style={{ aspectRatio: '16/10' }}
                    src={post.imageUrl} 
                    alt={post.title || 'Post image'} 
                  />
                </div>
              )}

             

            </div>
          ))}
        </div>

       
      </div>

      {/* Floating Action Button */}
      {isAuth ? <div className="fixed bottom-6 right-6 z-50">
        <Link to="/addpost" className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </div> : null}
    </div>
    </>
  );
}
