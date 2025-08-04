import { Trash2Icon, PenSquareIcon } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";

const WorkoutCard = ({workoutplan,setWorkouts}) => {
    const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await api.delete(`/workouts/${id}`);
      setWorkouts((prev) => prev.filter((workout) => workout._id !== id)); // get rid of the deleted one
      toast.success("Workout deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete workout");
    }
  };

    return (
    <Link to={`/workoutplan/${workoutplan._id}`}
      className="card bg-base-200 shadow-sm hover:shadow-xl transition-all duration-200 border-t-4 border-solid border-primary">
        <div className="card-body">
            <h3 className="card-title text-base-content">{workoutplan.title}</h3>
            <p className="text-base-content/70 line-clamp-3">{workoutplan.content}</p>
            <div className="flex items-center gap-1">
                <PenSquareIcon className="size-4 text-primary" />
              <button className="btn btn-ghost btn-xs text-error" onClick={(e) => handleDelete(e, workoutplan._id)}>
                <Trash2Icon className="size-4" />
              </button>
            </div>            
        </div>     
    </Link>
  )
};

export default WorkoutCard
