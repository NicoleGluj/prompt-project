import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID() },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

export default Task