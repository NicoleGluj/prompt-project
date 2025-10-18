import { TaskInput } from "../components/TaskInput"
import { TaskList } from "../components/TaskList"
import { useTasks } from "../hooks/useTasks"
import { Layout } from "../layout/Layout"

export const MisTareas = () => {
  const { tasks, addTask, removeTask, toggleTask } = useTasks()

  return (
    <Layout>
      <h1 className="text-3xl font-extrabold mb-4 mt-5 uppercase text-[#FF8A59] border-b border-[#ff45836e]">Mis Tareas</h1>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={removeTask} onToggle={toggleTask} />
    </Layout>
  )
}