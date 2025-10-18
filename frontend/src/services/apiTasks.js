
const BASE_URL = "http://localhost:3000/tasks"

export const fetchTasksApi = async () => {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error("Error al obtener las tareas")
  return await res.json()
}

export const addTaskApi = async (text) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error("Error al crear la tarea")
  return await res.json()
}

export const removeTaskApi = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Error al eliminar la tarea")
  return true
}

export const toggleTaskApi = async (id, completed) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  })
  if (!res.ok) throw new Error("Error al actualizar la tarea")
  return await res.json()
}
