import { useEffect, useRef, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom"

const App = () => {
  // utils
  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  // hooks
  const useTasks = () => {
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
        setTasks(tasks.filter((task) => task.id !== id))
      } catch (error) {
        console.error("Error en removeTask:", error)
      }
    }

    // 🔄 Alternar estado de completado
    const toggleTask = async (id) => {
      try {
        const task = tasks.find((t) => t.id === id)
        if (!task) return
        const updatedTask = await toggleTaskApi(id, !task.completed)
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)))
      } catch (error) {
        console.error("Error en toggleTask:", error)
      }
    }

    return { tasks, addTask, removeTask, toggleTask }
  }

  // components
  const TaskList = ({ tasks, onDelete, onToggle }) => (
    <ul className="mt-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  )

  const TaskItem = ({ task, onDelete, onToggle }) => (
    <li
      className={`flex items-center justify-between p-2 rounded-md mb-2 ${task.completed ? "bg-gray-700 line-through text-gray-400" : "bg-gray-800 text-gray-200"
        }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4 accent-blue-500"
        />
        <span>{task.text}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">{formatDate(task.createdAt)}</span>
        <button
          onClick={() => onDelete(task.id)}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Eliminar
        </button>
      </div>
    </li>
  )

  const TaskInput = ({ onAdd }) => {
    const [listening, setListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const recognitionRef = useRef(null)

    const initRecognition = () => {
      if (!("webkitSpeechRecognition" in window)) {
        alert("Tu navegador no soporta reconocimiento de voz")
        return null
      }
      const recognition = new window.webkitSpeechRecognition()
      recognition.lang = "es-ES"
      recognition.continuous = true
      recognition.interimResults = false

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript
        const capitalized = result.charAt(0).toUpperCase() + result.slice(1)
        setTranscript((prev) => (prev ? prev + " " + capitalized : capitalized))
      }

      recognition.onend = () => {
        setListening(false)
      }

      return recognition
    }

    const handleToggle = () => {
      if (listening) {
        recognitionRef.current?.stop()
      } else {
        if (transcript.trim()) {
          onAdd(transcript.trim())
          setTranscript("")
        }
        recognitionRef.current = initRecognition()
        recognitionRef.current?.start()
        setListening(true)
      }
    }

    const handleConfirm = () => {
      if (transcript.trim()) {
        onAdd(transcript.trim())
        setTranscript("")
      }
    }

    return (
      <div className="mt-4">
        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded text-white ${listening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {listening ? "Detener" : "Comenzar grabación"}
        </button>
        {transcript && !listening && (
          <div className="mt-4">
            <textarea
              value={transcript}
              onChange={(e) => {
                const value = e.target.value
                const capitalized = value.charAt(0).toUpperCase() + value.slice(1)
                setTranscript(capitalized)
              }}
              rows="3"
              cols="40"
              className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-600"
            />
            <br />
            <button
              onClick={handleConfirm}
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Confirmar tarea
            </button>
          </div>
        )}
      </div>
    )
  }
  const Header = () => (
    <header className="bg-gray-900 text-gray-200 p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">TodoApp</h1>
      <nav className="space-x-4">
        <Link className="hover:text-blue-400" to="/">
          Login
        </Link>
        <Link className="hover:text-blue-400" to="/mis-tareas">
          Mis Tareas
        </Link>
      </nav>
    </header>
  )

  const Footer = () => (
    <footer className="bg-gray-900 text-gray-400 text-center p-4 mt-8">
      Demo App ©
    </footer>
  )

  // layout
  const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-200">
      <Header />
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  )

  // pages
  const NotFound = () => (
    <Layout>
      <h1 className="text-2xl font-bold text-red-500">404 - Página no encontrada</h1>
    </Layout>
  )

  const MisTareas = () => {
    const { tasks, addTask, removeTask, toggleTask } = useTasks()

    return (
      <Layout>
        <h1 className="text-2xl font-bold mb-4">Mis Tareas</h1>
        <TaskInput onAdd={addTask} />
        <TaskList tasks={tasks} onDelete={removeTask} onToggle={toggleTask} />
      </Layout>
    )
  }

  const Login = () => {
    const navigate = useNavigate()
    const [pin, setPin] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = (e) => {
      e.preventDefault()
      if (pin === "1234") {
        setError("")
        setSuccess(true)
        setTimeout(() => navigate("/mis-tareas"), 1000) // redirige con un pequeño delay
      } else {
        setSuccess(false)
        setError("Credencial incorrecta. Intenta nuevamente.")
      }
    }

    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-full max-w-sm bg-gray-900 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Ingresa tu código numérico"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-gray-200 border border-gray-600"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Entrar
              </button>
            </form>

            {error && (
              <p className="mt-4 text-red-500 font-semibold text-center">{error}</p>
            )}
            {success && (
              <p className="mt-4 text-green-500 font-semibold text-center">
                Acceso concedido. Redirigiendo...
              </p>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  // router
  const RouterApp = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mis-tareas" element={<MisTareas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

  // services
  const BASE_URL = "http://localhost:3000/tasks"

  // 📥 Obtener todas las tareas
  const fetchTasksApi = async () => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error("Error al obtener las tareas")
    return await res.json()
  }

  // ➕ Crear nueva tarea
  const addTaskApi = async (text) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error("Error al crear la tarea")
    return await res.json()
  }

  // ❌ Eliminar tarea
  const removeTaskApi = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar la tarea")
    return true
  }

  // 🔄 Actualizar tarea (toggle o edición)
  const toggleTaskApi = async (id, completed) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
    if (!res.ok) throw new Error("Error al actualizar la tarea")
    return await res.json()
  }

  return <RouterApp />
}

export default App
