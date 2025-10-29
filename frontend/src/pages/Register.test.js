import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { Register } from "./Register"
import { AuthProvider } from "../context/AuthContext"
import React, { useState } from "react"


// Helper para render con router y contexto
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  )
}

describe("Register component", () => {
  test("muestra error si las contraseñas no coinciden", async () => {
    renderWithProviders(<Register />)

    // Simular la escritura en los inputs
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: "test@mail.com" },
    })
    fireEvent.change(screen.getByPlaceholderText(/^contraseña$/i), {
      target: { value: "123" },
    })
    fireEvent.change(screen.getByPlaceholderText(/repite tu contraseña/i), {
      target: { value: "456" },
    })

    // Click en registrarse
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }))

    // Buscar mensaje de error
    const errorMessage = await screen.findByText(/las contraseñas no coinciden/i)
    expect(errorMessage).toBeInTheDocument()
  })
})
