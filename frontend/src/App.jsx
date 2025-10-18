import { useEffect, useRef, useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate, Link } from "react-router-dom"
import { MicrophoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const App = () => {
  const formatDate = (date) => new Date(date).toLocaleString()

  const useTasks = () => {
    const [tasks, setTasks] = useState([])

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

    const addTask = async (text) => {
      try {
        const newTask = await addTaskApi(text)
        setTasks([...tasks, newTask])
      } catch (error) {
        console.error("Error en addTask:", error)
      }
    }

    const removeTask = async (id) => {
      try {
        await removeTaskApi(id)
        setTasks(tasks.filter((task) => task.id !== id))
      } catch (error) {
        console.error("Error en removeTask:", error)
      }
    }

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

  // COMPONENTES
  const TaskList = ({ tasks, onDelete, onToggle }) => (
    <ul className="mt-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </ul>
  )

  const TaskItem = ({ task, onDelete, onToggle }) => (
    <li
      className={`flex items-center justify-between p-3 rounded-xl mb-2 shadow-sm border transition-transform duration-300 transform hover:scale-101 ${task.completed
        ? "bg-[#FF4583]/10 line-through text-gray-500 border-gray-300"
        : "bg-white text-gray-800 border-gray-200"
        }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="w-4 h-4 accent-[#FF8A59]"
        />
        <span>{task.text}</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">{formatDate(task.createdAt)}</span>
        <button
          onClick={() => onDelete(task.id)}
          className="px-2 py-1 bg-[#FFC54C] text-white rounded-lg font-medium"
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
          className={`px-4 py-2 rounded text-white font-medium shadow-md ${listening ? "bg-[#fac042] hover:bg-[#ffb10a]" : "bg-[#fc5b91] hover:bg-[#f8286e]"
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
              className="w-full p-2 rounded border border-gray-300 text-gray-800 shadow-sm"
            />
            <br />
            <button
              onClick={handleConfirm}
              className="mt-2 px-4 py-2 bg-[#FF8A59] hover:bg-[#ff793f] text-white rounded-lg font-medium"
            >
              Confirmar tarea
            </button>
          </div>
        )}
      </div>
    )
  }

  const Header = () => (
    <header className="bg-[#FF4583] text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <MicrophoneIcon className="w-6 h-6" />
        <h1 className="text-xl font-semibold tracking-wider">SayDo</h1>
      </div>
      <nav className="flex gap-4 font-semibold">
        <Link
          to="/"
          className="transition-transform duration-200 transform hover:scale-105"
        >
          Login
        </Link>
        <Link
          to="/mis-tareas"
          className="transition-transform duration-200 transform hover:scale-105"
        >
          Mis Tareas
        </Link>
      </nav>
    </header>
  )

  const Footer = () => (
    <footer className="bg-white text-gray-500 text-center p-4 mt-8 text-sm border-t border-gray-200">
      Demo App © {new Date().getFullYear()}
    </footer>
  )

  const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Header />
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  )

  const NotFound = () => (
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <h1
          className="text-5xl md:text-5xl font-bold text-center leading-tight"
          style={{
            background: "linear-gradient(90deg, #FB0FBA, #FF8A59)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            overflow: "visible",
          }}
        >
          404 - Página no encontrada
        </h1>
      </div>
    </Layout>
  )


  const MisTareas = () => {
    const { tasks, addTask, removeTask, toggleTask } = useTasks()

    return (
      <Layout>
        <h1 className="text-3xl font-extrabold mb-4 mt-5 uppercase text-[#FF8A59] border-b border-[#ff45836e]">Mis Tareas</h1>
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
        setTimeout(() => navigate("/mis-tareas"), 1000)
      } else {
        setSuccess(false)
        setError("Credencial incorrecta. Intenta nuevamente.")
      }
    }

    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h1 className="text-2xl font-bold mb-4 text-center text-[#FF4583]">
              Login
            </h1>
            <div className="mt-2 mb-4 p-3 bg-gray-100 text-gray-700 text-center rounded-lg text-sm ">
              Código de acceso: <span className="font-bold">1234</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Ingresa tu código numérico"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#933FED]"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#FF8A59] hover:bg-[#fd6d2f] text-white rounded-lg font-medium"
              >
                Entrar
              </button>
            </form>

            {error && (
              <p className="mt-4 text-[#FF4583] font-semibold text-center">{error}</p>
            )}
            {success && (
              <p className="mt-4 text-[#FF4583] font-semibold text-center">
                Acceso concedido. Redirigiendo...
              </p>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  const RouterApp = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mis-tareas" element={<MisTareas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

  const BASE_URL = "http://localhost:3000/tasks"

  const fetchTasksApi = async () => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error("Error al obtener las tareas")
    return await res.json()
  }

  const addTaskApi = async (text) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error("Error al crear la tarea")
    return await res.json()
  }

  const removeTaskApi = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Error al eliminar la tarea")
    return true
  }

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
