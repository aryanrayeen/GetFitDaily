import Workout from "../models/Workout.js";

export async function getALLWorkouts(req,res) {
    try {
      const workouts = await Workout.find({ user: req.userId }).sort({createdAt: -1});//newest first, user-specific
      res.status(200).json(workouts);
    } catch (error) {
      console.error("Error in getALLWorkouts controller", error);  
      res.status(500).json({message: "Internal server error" });  
    }
}

export async function getWorkoutById(req,res) {
    try {
      const workouts = await Workout.findOne({ _id: req.params.id, user: req.userId });
      if(!workouts) return res.status(404).json({message: "Workout not found!"});
      res.json(workouts);
    } catch (error) {
      console.error("Error in getWorkoutById controller", error);  
      res.status(500).json({message: "Internal server error" });  
    }
    
}

export async function createWorkout(req,res) {
    try {
      const {title,content} = req.body ;
      const workouts = new Workout({title, content, user: req.userId});

      const savedWorkout = await workouts.save();
      res.status(201).json(savedWorkout);
    } catch (error) {
      console.error("Error in createWorkout controller", error);  
      res.status(500).json({message: "Internal server error" });  
    }
}

export async function updateWorkout(req,res) {
    try {
      const {title,content} = req.body;
      const updateWorkout = await Workout.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        {title,content},
        {new:true}
      );
    
      if(!updateWorkout) return res.status(404).json({message:"Workout not found"});

      res.status(200).json(updateWorkout);
    } catch (error) {
      console.error("Error in updateWorkout controller", error);  
      res.status(500).json({message: "Internal server error" }); 
    }
}

export async function deleteWorkout(req,res) {
    try {
      const deleteWorkout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    
      if(!deleteWorkout) return res.status(404).json({message:"Workout not found"});

      res.status(200).json(deleteWorkout);  
    } catch (error) {
      console.error("Error in deleteWorkout controller", error);  
      res.status(500).json({message: "Internal server error" });  
    }
}