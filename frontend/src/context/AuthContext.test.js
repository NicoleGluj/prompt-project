import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider, useAuth } from "./AuthContext"
import React from "react"

const TestComponent = () => {
  const { user, token, login, logout, loading } = useAuth()

  if (loading) return <div data-testid="loading">Loading...</div>

  return (
    <div>
      <div data-testid="user">{user?.email ?? ""}</div>
      <div data-testid="token">{token ?? ""}</div>
      <button onClick={() => login({ email: "test@mail.com", token: "123" })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("inicializa correctamente", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Esperamos a que loading termine
    await waitFor(() => {
      expect(screen.queryByTestId("loading")).not.toBeInTheDocument()
    })

    expect(screen.getByTestId("user")).toHaveTextContent("")
    expect(screen.getByTestId("token")).toHaveTextContent("")
  })

  test("login actualiza el estado y localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    userEvent.click(screen.getByText("Login"))

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@mail.com")
      expect(screen.getByTestId("token")).toHaveTextContent("123")
    })

    expect(localStorage.getItem("authToken")).toBe("123")
    expect(localStorage.getItem("authUser")).toBe(JSON.stringify({ email: "test@mail.com" }))
  })

  test("logout limpia el estado y localStorage", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Primero hacemos login
    userEvent.click(screen.getByText("Login"))

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("test@mail.com")
    })

    // Luego logout
    userEvent.click(screen.getByText("Logout"))

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("")
      expect(screen.getByTestId("token")).toHaveTextContent("")
    })

    expect(localStorage.getItem("authToken")).toBe(null)
    expect(localStorage.getItem("authUser")).toBe(null)
  })
})
