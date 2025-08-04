import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

const WorkoutPlan = () => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const res = await api.get(`/workouts/${id}`);
        setWorkout(res.data);
      } catch (error) {
        console.log("Error in fetching workout", error);
        toast.error("Failed to fetch the workout");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;

    try {
      await api.delete(`/workouts/${id}`);
      toast.success("Workout deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the workout:", error);
      toast.error("Failed to delete workout");
    }
  };

  const handleSave = async () => {
    if (!workout?.title?.trim() || !workout?.content?.trim()) {
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/workouts/${id}`, workout);
      toast.success("Workout updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the workout:", error);
      toast.error("Failed to update workout");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Workout
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Workout title"
                  className="input input-bordered"
                  value={workout?.title || ''}
                  onChange={(e) => setWorkout({ ...workout, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your workout here..."
                  className="textarea textarea-bordered h-32"
                  value={workout?.content || ''}
                  onChange={(e) => setWorkout({ ...workout, content: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WorkoutPlan;