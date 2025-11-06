import { useState, useEffect } from "react"
import {
  fetchTasksApi,
  addTaskApi,
  removeTaskApi,
  toggleTaskApi,
} from "../services/apiTasks"

export const useTasks = () => {
  const [tasks, setTasks] = useState([])

  // 🚀 Traemos las tasks del backend al montar el componente
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasksApi()
        setTasks(data)
      } catch (error) {
        console.error("Error al cargar tareas:", error)
      }
    }
    loadTasks()
  }, [])

  // ➕ Crear una nueva tarea
  const addTask = async (text) => {
    try {
      const newTask = await addTaskApi(text)
      setTasks([...tasks, newTask])
    } catch (error) {
      console.error("Error en addTask:", error)
    }
  }

  // ❌ Eliminar tarea
  const removeTask = async (id) => {
    try {
      await removeTaskApi(id)
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id))
    } catch (error) {
      console.error("Error en removeTask:", error)
    }
  }

  // 🔄 Alternar estado de completado
  const toggleTask = async (id) => {
    try {
      // Buscar usando _id
      const task = tasks.find(t => t._id === id)
      if (!task) return

      const updatedTask = await toggleTaskApi(id, !task.completed)

      setTasks(prevTasks => prevTasks.map(t => t._id === id ? updatedTask : t))
    } catch (error) {
      console.error("Error en toggleTask:", error)
    }
  }


  return { tasks, addTask, removeTask, toggleTask }
}