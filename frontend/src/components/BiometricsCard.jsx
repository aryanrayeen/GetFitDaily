import { useState, useEffect } from "react";
import { LineChart, Weight, Ruler, Activity, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";

const BiometricsCard = () => {
  const [biometrics, setBiometrics] = useState({
    age: "",
    height: "",
    weight: "",
    caloriesIntake: "",
    exerciseMinutes: "",
    goalWeight: "",
    waistMeasurement: "",
    bodyFatPercentage: "",
    gender: "male"
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchBiometrics = async () => {
      try {
        const res = await api.get("/biometrics");
        if (res.data) {
          setBiometrics(res.data);
        }
      } catch (error) {
        console.error("Error fetching biometrics:", error);
      }
    };

    fetchBiometrics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/biometrics", biometrics);
      toast.success("Biometrics updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error saving biometrics:", error);
      toast.error("Failed to update biometrics");
    }
  };

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title text-xl flex items-center gap-2">
            <LineChart className="size-5 text-primary" />
            My Biometrics
          </h2>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Calendar className="size-4" /> Age
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.age}
                onChange={(e) => setBiometrics({...biometrics, age: e.target.value})}
                placeholder="Enter your age"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Ruler className="size-4" /> Height (cm)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.height}
                onChange={(e) => setBiometrics({...biometrics, height: e.target.value})}
                placeholder="Enter your height in cm"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Weight className="size-4" /> Weight (kg)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.weight}
                onChange={(e) => setBiometrics({...biometrics, weight: e.target.value})}
                placeholder="Enter your weight in kg"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Ruler className="size-4" /> Waist Measurement (cm)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.waistMeasurement}
                onChange={(e) => setBiometrics({...biometrics, waistMeasurement: e.target.value})}
                placeholder="Enter your waist measurement in cm"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Activity className="size-4" /> Body Fat (%)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.bodyFatPercentage}
                onChange={(e) => setBiometrics({...biometrics, bodyFatPercentage: e.target.value})}
                placeholder="Enter your body fat percentage"
              />
            </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <Weight className="size-4" /> Goal Weight (kg)
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={biometrics.goalWeight}
                  onChange={(e) => setBiometrics({...biometrics, goalWeight: e.target.value})}
                  placeholder="Enter your goal weight in kg"
                />
              </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Activity className="size-4" /> Daily Exercise (minutes)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.exerciseMinutes}
                onChange={(e) => setBiometrics({...biometrics, exerciseMinutes: e.target.value})}
                placeholder="Minutes of exercise per day"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Activity className="size-4" /> Daily Caloric Intake (kcal)
                </span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={biometrics.caloriesIntake}
                onChange={(e) => setBiometrics({...biometrics, caloriesIntake: e.target.value})}
                placeholder="Daily calorie target"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                className="select select-bordered"
                value={biometrics.gender}
                onChange={(e) => setBiometrics({...biometrics, gender: e.target.value})}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Ruler className="size-4" /> Waist Measurement
              </div>
              <div className="stat-value text-lg">{biometrics.waistMeasurement ? `${biometrics.waistMeasurement} cm` : "-"}</div>
            </div>
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Activity className="size-4" /> Body Fat (%)
              </div>
              <div className="stat-value text-lg">{biometrics.bodyFatPercentage ? `${biometrics.bodyFatPercentage} %` : "-"}</div>
            </div>
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Weight className="size-4" /> Goal Weight
              </div>
              <div className="stat-value text-lg">{biometrics.goalWeight ? `${biometrics.goalWeight} kg` : "-"}</div>
            </div>
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Calendar className="size-4" /> Age
              </div>
              <div className="stat-value text-lg">{biometrics.age || "-"}</div>
            </div>
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Ruler className="size-4" /> Height
              </div>
              <div className="stat-value text-lg">{biometrics.height ? `${biometrics.height} cm` : "-"}</div>
            </div>
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Weight className="size-4" /> Weight
              </div>
              <div className="stat-value text-lg">{biometrics.weight ? `${biometrics.weight} kg` : "-"}</div>
            </div>
            <div className="stat bg-base-100 rounded-box p-4">
              <div className="stat-title flex items-center gap-2">
                <Activity className="size-4" /> Exercise
              </div>
              <div className="stat-value text-lg">{biometrics.exerciseMinutes ? `${biometrics.exerciseMinutes} min/day` : "-"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricsCard;
