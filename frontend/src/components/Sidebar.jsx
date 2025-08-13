import { Link } from 'react-router-dom';
import { X, Youtube, UtensilsCrossed, TrendingUp, Trophy, Calendar, Home } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Tutorials', path: '/tutorials', icon: Youtube },
    { name: 'Meal Planner', path: '/meal-planner', icon: UtensilsCrossed },
    { name: 'Progress Tracker', path: '/progress-tracker', icon: TrendingUp },
    { name: 'LeaderBoard', path: '/leaderboard', icon: Trophy },
    { name: 'Habit Calendar', path: '/habit-calendar', icon: Calendar },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-base-200 shadow-lg transform transition-transform duration-300 ease-in-out z-[9999]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold">MY TABS</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors duration-200 text-base-content"
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;