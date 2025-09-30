import React from 'react'
import { Link } from 'react-router-dom'
import HyiconLogo from './assets/Hyicon.png'

export default function navbar({isAuth=false ,user, onLogout}) {
  return (
    <div> <div className="navbar bg-base-100 rounded-2xl shadow-sm socialmedianav justify-start items-center">
  <div className="flex-2 items-center">
<Link to="/"><div className="flex items-center gap-2">
      
      <img 
        src={HyiconLogo} 
        alt="HELLOLY Logo" 
        className="w-10 h-10 rounded-lg"
      />
      <span className="text-xl font-bold text-primary">HELLOLY</span>
    </div></Link>
  </div>
  
  <div className="flex gap-2">
    {isAuth ?(<div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          
          <img
            alt="Tailwind CSS Navbar component"
            src={user.avatarUrl} />
        </div>
      
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        
        <li><a onClick={onLogout}>Logout</a></li>
      </ul>
    </div>):(
      <div>
<Link to="/sigin_page"><button className='btn btn-primary m-2 btn-outline signbtn'>Sign In</button></Link>
<Link to="/signup_page"><button className='btn btn-primary m-2 btn-outline signbtn'>Sign Up</button></Link>

   </div>
    )}
  </div>
</div></div>
  )
}
