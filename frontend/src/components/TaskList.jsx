import { TaskItem } from "./TaskItems";

export const TaskList = ({ tasks, onDelete, onToggle }) => {
  return (
    <section className="m-4 mt-14">
      <h1 className="text-3xl font-light text-white uppercase  mt-8">
        Tus pendientes
      </h1>
      <ul className="mt-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
        ))}
      </ul>
    </section>
  )
}


