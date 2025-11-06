const BASE_URL = "http://localhost:3000/auth"

// 📝 Registrar nuevo usuario
export const registerApi = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) throw new Error("Error en el registro")
  return await res.text()
}

// 🔑 Login de usuario
export const loginApi = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error("Credenciales inválidas")
  return await res.json()
}