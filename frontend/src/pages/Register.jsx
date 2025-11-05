import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "../layout/Layout"
import { useAuth } from "../context/AuthContext"
import { loginApi, registerApi } from "../services/ApiAuth"

export const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

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
      const resRegister = await registerApi(email, password)
      console.log(resRegister)

      // 2. Login automático tras registro
      const data = await loginApi(email, password) // { token }
      login({ email, token: data.token })

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
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#FF4583]">
            Registro
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#933FED]"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#933FED]"
              required
            />
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#933FED]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[#FF8A59] hover:bg-[#fd6d2f] text-white rounded-lg font-medium"
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          {error && (
            <p
              data-testid="error-message"
              className="mt-4 text-[#FF4583] font-semibold text-center"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              data-testid="success-message"
              className="mt-4 text-[#FF4583] font-semibold text-center"
            >
              Acceso concedido. Redirigiendo...
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}
