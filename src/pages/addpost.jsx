import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function AddPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    postType: 'mix'
  });
  const [errors, setErrors] = useState({
    title: false,
    body: false,
    imageUrl: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const IMGBB_API_KEY = "eaba1bc0300ab3681e35e1eef62d2503";
const [posts, setPosts] = useState([]);

useEffect(() => {
    async function getposts() {
       try {
        const response = await fetch("https://posts-a6aaf-default-rtdb.firebaseio.com/posts.json");
        const data = await response.json();
        setPosts(data);
        console.log(data);
       } catch (error) {
        console.log(error);
       }
    }
    getposts();
}, []);

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
  // optional: form.append("name", "my-post-image");

  // 3. send with axios
  const resp = await axios.post(url, form);
  // resp.data matches example: { data: { display_url: "...", url: "...", ... }, success: true }
  return resp.data?.data?.display_url || resp.data?.data?.url;
};



const addpost =async(Addedpost)=>{
    try {
 
      const response =await axios.put(`https://posts-a6aaf-default-rtdb.firebaseio.com/posts/${posts.length}.json`,Addedpost);
      if(response.status === 200){
        console.log("Post added successfully");
        navigate("/");
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }

    // Auto-determine post type based on content
    const updatedFormData = { ...formData, [name]: value };
    let newPostType = 'mix';
    
    if (updatedFormData.title || updatedFormData.body) {
      if (updatedFormData.imageUrl) {
        newPostType = 'mix';
      } else {
        newPostType = 'text';
      }
    } else if (updatedFormData.imageUrl) {
      newPostType = 'image';
    }
    
    setFormData(prev => ({ ...prev, postType: newPostType }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: previewUrl,
        postType: (prev.title || prev.body) ? 'mix' : 'image'
      }));
      
      if (errors.imageUrl) {
        setErrors(prev => ({ ...prev, imageUrl: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validation based on post type
    const newErrors = {
      title: false,
      body: false,
      imageUrl: false
    };

    if (formData.postType === 'text') {
      newErrors.title = !formData.title;
      newErrors.body = !formData.body;
    } else if (formData.postType === 'image') {
      newErrors.imageUrl = !formData.imageUrl;
    } else if (formData.postType === 'mix') {
      newErrors.title = !formData.title;
      newErrors.body = !formData.body;
      newErrors.imageUrl = !formData.imageUrl;
    }
    
    setErrors(newErrors);
    
    if (!Object.values(newErrors).some(error => error)) {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
      
      // Create new post object
      const newPost = {
        id: Date.now(),
        userId: currentUser.id || 1,
        user: {
          name: currentUser.name || 'Anonymous',
          avatarUrl: currentUser.avatarUrl || 'https://api.dicebear.com/8.x/initials/svg?seed=User'
        },
        title: formData.title,
        body: formData.body,
        imageUrl: formData.imageUrl,
        timestamp: new Date().toISOString(),
        postType: formData.postType
      };

      try {
        // In a real app, you'd send this to your backend
        console.log('New post created:', newPost);
        
        // If there's an image, upload it to ImgBB first
        if (selectedFile) {
          uploadToImgbb(selectedFile).then((url) => {
            newPost.imageUrl = url;
            console.log('Image uploaded, updated post:', newPost);
            addpost(newPost);
          }).catch((error) => {
            console.error('Image upload failed:', error);
            setIsLoading(false);
          });
        } else {
          // No image, proceed directly
          setTimeout(() => {
            addpost(newPost);
          }, 1500);
        }
        
      } catch (error) {
        console.error("Post creation failed:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Share your thoughts with the community</p>
        </div>

        {/* Post Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Post Type Indicator */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Post Type:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                formData.postType === 'text' ? 'bg-green-100 text-green-800' :
                formData.postType === 'image' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {formData.postType.toUpperCase()}
              </span>
            </div>

            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Post Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="What's your post about?"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">Title is required</p>
              )}
            </div>

            {/* Body Input */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Post Content
              </label>
              <textarea
                id="body"
                name="body"
                rows={6}
                value={formData.body}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                  errors.body ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Share your thoughts, ideas, or story..."
              />
              {errors.body && (
                <p className="mt-1 text-sm text-red-600">Content is required</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                Post Image (Optional)
              </label>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                          setFormData(prev => ({ 
                            ...prev, 
                            imageUrl: '',
                            postType: (prev.title || prev.body) ? 'text' : 'mix'
                          }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="mt-4">
                        <label htmlFor="image" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload an image
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </span>
                        </label>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm">Image is required for this post type</p>
                )}
              </div>
            </div>

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
                  <span>Creating Post...</span>
                </div>
              ) : (
                'Create Post'
              )}
            </button>
          </form>

          {/* Cancel Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
