import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "../layout/Layout"

export const Login = () => {
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