import { TaskItem } from "./TaskItems";
import { Reorder } from "framer-motion";


export const TaskList = ({ tasks, onDelete, onToggle }) => {
  const pendingTasks = tasks.filter(t => !t.completed).reverse();
  const completedTasks = tasks.filter(t => t.completed);
  const sortedTasks = [...pendingTasks, ...completedTasks];

  return (
    <section className="m-4 sm:m-4 xs:m-2 mt-14">
      <h1 className="text-3xl sm:text-3xl xs:text-2xl font-light text-white uppercase mt-8 mb-5">
        Tus pendientes
      </h1>
      <Reorder.Group axis="y" values={sortedTasks} onReorder={() => { }}>
        {sortedTasks.map(task => (
          <Reorder.Item
            key={task._id}
            value={task}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <TaskItem task={task} onDelete={onDelete} onToggle={onToggle} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </section>
  )
}


