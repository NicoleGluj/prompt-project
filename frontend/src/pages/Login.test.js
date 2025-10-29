// src/pages/Login.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Login } from "./Login"
import { useAuth } from "../context/AuthContext"
import { loginApi } from "../services/api"
import React from "react"


// Mock del contexto
jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn()
}))

// Mock del API
jest.mock("../services/api", () => ({
  loginApi: jest.fn()
}))

describe("Login component", () => {
  const mockLogin = jest.fn()
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock del hook useAuth
    useAuth.mockReturnValue({
      login: mockLogin
    })
  })

  test("muestra inputs y botón", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument()
  })

  test("realiza login correctamente", async () => {
    // Mock de loginApi exitoso
    loginApi.mockResolvedValue({ token: "fake-token" })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "test@example.com" }
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "123456" }
    })

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        token: "fake-token"
      })
    })
  })

  test("muestra error si login falla", async () => {
    // Mock de loginApi que lanza error
    loginApi.mockRejectedValue(new Error("Credenciales incorrectas"))

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "wrong@example.com" }
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: "wrongpass" }
    })

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument()
    })
  })
})
