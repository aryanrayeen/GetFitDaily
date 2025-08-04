import Workout from "../models/Workout.js";

export async function getALLWorkouts(req,res) {
    try {
      const workouts = await Workout.find().sort({createdAt: -1});//newest first
      res.status(200).json(workouts);
    } catch (error) {
      console.error("Error in getALLWorkouts controller", error);  
      res.status(500).json({message: "Internal server error" });  
    }
}

export async function getWorkoutById(req,res) {
    try {
      const workouts = await Workout.findById(req.params.id);
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
      const workouts = new Workout({title, content});

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
      const updateWorkout = await Workout.findByIdAndUpdate(req.params.id,{title,content},{new:true,});
    
      if(!updateWorkout) return res.status(404).json({message:"Workout not found"});


      res.status(200).json(updateWorkout);
    } catch (error) {
      console.error("Error in updateWorkout controller", error);  
      res.status(500).json({message: "Internal server error" }); 
    }
}

export async function deleteWorkout(req,res) {
    try {
      const {title,content} = req.body;
      const deleteWorkout = await Workout.findByIdAndDelete(req.params.id,{title,content},{new:true,});
    
      if(!deleteWorkout) return res.status(404).json({message:"Workout not found"});


      res.status(200).json(deleteWorkout);  
    } catch (error) {
      console.error("Error in deleteWorkout controller", error);  
      res.status(500).json({message: "Internal server error" });  
    }
}