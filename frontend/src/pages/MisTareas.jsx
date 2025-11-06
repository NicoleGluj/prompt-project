import { useTasks } from "../hooks/useTasks"
import { TaskList } from "../components/TaskList"
import { TaskInput } from "../components/TaskInput"
import { Layout } from "../layout/Layout"
import { Helmet } from "react-helmet";
import { useAuth } from "../context/AuthContext"


export const MisTareas = () => {
  const { tasks, addTask, removeTask, toggleTask } = useTasks()
  const { user, logout } = useAuth()

  return (
    <Layout>
      <Helmet>
        <title>Mis tareas</title>
      </Helmet>
      <div className="m-4 sm:m-4 xs:m-2">
        <h1 className="text-5xl sm:text-5xl xs:text-3xl font-medium text-white uppercase text-center mt-8">
          ¡Hola {user?.name || "de nuevo"}!
        </h1>
        <h2 className="text-center text-3xl sm:text-3xl xs:text-xl text-white mt-3 font-light mb-8">
          ¿Querés agregar un nuevo pendiente?
        </h2>
        <TaskInput onAdd={addTask} />
      </div>
      <TaskList tasks={tasks} onDelete={removeTask} onToggle={toggleTask} />
    </Layout>
  )
}