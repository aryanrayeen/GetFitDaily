import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return ( 
  <header className="bg-base-300 border-b border-base-content/10"> 
  <div className="mx-auto max-w-6xl p-4">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="btn btn-ghost btn-circle"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
          GetFitDaily
          </h1>
        </div>
        <div className="flex items-center gap-x-4">
            {/* User Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar p-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-base-300">
                <li className="menu-title">
                  <span>{user?.name || 'User'}</span>
                </li>
                <li><a className="text-base-content/70">{user?.email}</a></li>
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="text-error hover:bg-error/10">
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
        </div>  
    </div>
  </div>
  </header>

  );
};

export default Navbar;
