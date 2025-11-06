import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Layout } from "../layout/Layout"
import { useAuth } from "../context/AuthContext"
import { Helmet } from "react-helmet";
import { loginApi } from "../services/ApiAuth";


export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const data = await loginApi(email, password) // { token }
      login({ name: data.name, email, token: data.token })// guardar en contexto
      navigate("/mistareas")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Layout>
      <Helmet>
        {/* 🧭 Título y descripción */}
        <title>Iniciar sesión | TaskVoice</title>
        <meta
          name="description"
          content="Accedé a tu cuenta para administrar tus tareas por voz y organizar tu día de forma eficiente."
        />

        {/* 📱 Meta responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* 🧭 Indexación (puedes marcarla como noindex si no quieres que aparezca en Google) */}
        <meta name="robots" content="noindex, nofollow" />

        {/* 🌐 Open Graph para redes sociales */}
        <meta property="og:title" content="Iniciar sesión | TaskVoice" />
        <meta
          property="og:description"
          content="Accedé a tu cuenta para administrar tus tareas por voz y organizar tu día."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tusitio.com/login" />
        <meta property="og:image" content="https://tusitio.com/preview-login.png" />

        {/* 🐦 Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Iniciar sesión | TaskVoice" />
        <meta
          name="twitter:description"
          content="Accedé a tu cuenta para administrar tus tareas por voz y organizar tu día."
        />
        <meta name="twitter:image" content="https://tusitio.com/preview-login.png" />
      </Helmet>

      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="h-full w-full bg-gray-100/20 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-80 border-3 border-white/80 max-w-sm p-8 rounded-2xl shadow-lg">
          <div>
            <h1 className="text-2xl uppercase font-semibold text-center text-white">
              Iniciar sesion
            </h1>
            <p className="mb-6 text-center text-white/80 mt-2 text-sm">
              Bienvenido de nuevo! Ingresa tus datos para continuar:
            </p>
          </div>

          <form onSubmit={handleSubmit} >
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0E77C2] mb-6 mt-3"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-white/60 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0E77C2] mb-8"
              required
            />
            <button
              type="submit"
              disabled={loading}
              class="group relative inline-flex py-2 w-full font-medium items-center justify-center overflow-hidden rounded-2xl bg-[#eb831be7] text-white uppercase border-2 border-white/70">
              <span>
                {loading ? "Ingresando..." : "Entrar"}
              </span>
              <div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1500 group-hover:[transform:skew(-12deg)_translateX(100%)]"><div class="relative h-full w-8 bg-white/20"></div></div></button>
            <p className="mt-2 text-center font-medium text-white/90 text-sm">
              ¿No tienes una cuenta? <Link to="/register" className="font-bold"> Registrate </Link>
            </p>
          </form>

          {error && (
            <p className="mt-4 text-[#e74d0b] font-semibold text-center">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-[#97d81f] font-semibold text-center">
              Acceso concedido. Redirigiendo...
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}