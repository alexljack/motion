const templateExercises = {
  "Chest and Triceps": [
    { exerciseName: "Push Ups", orderIndex: 0, targetSets: 3, targetReps: 15, restSeconds: 60 },
    { exerciseName: "Dips", orderIndex: 1, targetSets: 3, targetReps: 12, restSeconds: 90 },
  ],
  "Back and Biceps": [
    { exerciseName: "Pull Ups", orderIndex: 0, targetSets: 3, targetReps: 10, restSeconds: 90 },
    { exerciseName: "Deadlifts", orderIndex: 1, targetSets: 4, targetReps: 8, targetWeight: 135, restSeconds: 120 },
  ],
  "Legs": [
    { exerciseName: "Squats", orderIndex: 0, targetSets: 4, targetReps: 12, targetWeight: 135, restSeconds: 90 },
    { exerciseName: "Lunges", orderIndex: 1, targetSets: 3, targetReps: 12, restSeconds: 60 },
  ],
  "Shoulders and Abs": [
    { exerciseName: "Plank", orderIndex: 0, targetSets: 3, targetDurationSeconds: 60, restSeconds: 60 },
    { exerciseName: "Russian Twists", orderIndex: 1, targetSets: 3, targetReps: 20, restSeconds: 45 },
    { exerciseName: "Hanging Leg Raises", orderIndex: 2, targetSets: 3, targetReps: 10, restSeconds: 90 },
  ],
  "Full Body": [
    { exerciseName: "Burpees", orderIndex: 0, targetSets: 3, targetReps: 15, restSeconds: 90 },
    { exerciseName: "Mountain Climbers", orderIndex: 1, targetSets: 3, targetReps: 20, restSeconds: 60 },
    { exerciseName: "Squats", orderIndex: 2, targetSets: 3, targetReps: 15, restSeconds: 60 },
    { exerciseName: "Push Ups", orderIndex: 3, targetSets: 3, targetReps: 15, restSeconds: 60 },
  ],
  "Cardio Blast": [
    { exerciseName: "Burpees", orderIndex: 0, targetSets: 3, targetReps: 20, restSeconds: 60 },
    { exerciseName: "Mountain Climbers", orderIndex: 1, targetSets: 3, targetDurationSeconds: 45, restSeconds: 45 },
  ],
  "Beginner Total Body": [
    { exerciseName: "Push Ups", orderIndex: 0, targetSets: 2, targetReps: 10, restSeconds: 60 },
    { exerciseName: "Squats", orderIndex: 1, targetSets: 2, targetReps: 15, restSeconds: 60 },
    { exerciseName: "Plank", orderIndex: 2, targetSets: 2, targetDurationSeconds: 30, restSeconds: 60 },
    { exerciseName: "Lunges", orderIndex: 3, targetSets: 2, targetReps: 10, restSeconds: 60 },
  ],
};

export default templateExercises;
