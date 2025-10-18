import { TaskItem } from "./TaskItems";

export const TaskList = ({ tasks, onDelete, onToggle }) => (
  <ul className="mt-4">
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
    ))}
  </ul>
)
