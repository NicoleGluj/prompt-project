import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Layout } from "../layout/Layout"
import { useAuth } from "../context/AuthContext"
import { loginApi, registerApi } from "../services/ApiAuth"

export const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    try {
      // 1. Registrar usuario
      const resRegister = await registerApi(name, email, password)
      console.log(resRegister)

      // 2. Login automático tras registro
      const data = await loginApi(email, password) // { token }
      login({ name, email, token: data.token })

      // 3. Redirigir a tareas
      navigate("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="h-full w-full bg-gray-100/20 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-80 border-3 border-white/80 max-w-sm p-8 rounded-2xl shadow-lg">
          <div>
            <h1 className="text-2xl uppercase font-semibold text-center text-white">
              Registro
            </h1>
            <p className="mb-6 text-center text-white/80 mt-2 text-sm">
              ¡Bienvenido! Registrate para empezar a organizar tus tareas:
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="name"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0E77C2] mb-6 mt-3"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0E77C2] mb-6"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0E77C2] mb-6"
              required
            />
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0E77C2] mb-10"
              required
            />
            <button
              type="submit"
              disabled={loading}
              class="group relative inline-flex py-2 w-full font-medium items-center justify-center overflow-hidden rounded-2xl bg-[#eb831be7] text-white uppercase border-2 border-white/70">
              <span>
                {loading ? "Creando cuenta..." : "Registrarse"}
              </span>
              <div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1500 group-hover:[transform:skew(-12deg)_translateX(100%)]"><div class="relative h-full w-8 bg-white/20"></div></div></button>
            <p className="mt-2 text-center font-medium text-white/90 text-sm">
              ¿Ya tienes una cuenta? <Link to="/login" className="font-bold"> Iniciar sesion </Link>
            </p>
          </form>

          {error && (
            <p
              data-testid="error-message"
              className="mt-4 text-[#e74d0b] font-semibold text-center"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              data-testid="success-message"
              className="mt-4 text-[#97d81f] font-semibold text-center"
            >
              Acceso concedido. Redirigiendo...
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}
