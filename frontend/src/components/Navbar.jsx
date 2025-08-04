import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

const Navbar = () => {
  return ( 
  <header className="bg-base-300 border-b border-base-content/10"> 
  <div className="mx-auto max-w-6xl p-4">
    <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
        GetFitDaily
        </h1>
        <div className="flex items-center gap-x-4">
            <Link to="/createworkout" className="btn btn-primary">
            <PlusIcon className="size-6" />
            <span>New Workout</span>
            </Link>
        </div>  
    </div>
  </div>
  </header>

  );
};

export default Navbar
