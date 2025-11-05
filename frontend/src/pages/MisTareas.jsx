import { useTasks } from "../hooks/useTasks"
import { TaskList } from "../components/TaskList"
import { TaskInput } from "../components/TaskInput"
import { Layout } from "../layout/Layout"
import { Helmet } from "react-helmet";


export const MisTareas = () => {
  const { tasks, addTask, removeTask, toggleTask } = useTasks()

  return (
    <Layout>
      <Helmet>
        <title>Mis tareas</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Mis Tareas</h1>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={removeTask} onToggle={toggleTask} />
    </Layout>
  )
}