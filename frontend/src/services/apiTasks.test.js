// src/services/ApiTasks.test.js
import {
  getAuthHeaders,
  fetchTasksApi,
  addTaskApi,
  removeTaskApi,
  toggleTaskApi,
} from "./apiTasks"
import React from "react"

// Limpiar mocks y localStorage antes de cada test
beforeEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
})

// Mock global fetch
global.fetch = jest.fn()

describe("ApiTasks", () => {
  const fakeToken = "fake-token"
  const fakeTasks = [{ id: 1, text: "Tarea 1", completed: false }]

  // Tests de getAuthHeaders
  describe("getAuthHeaders", () => {
    it("devuelve headers con token", () => {
      localStorage.setItem("authToken", fakeToken)
      const headers = getAuthHeaders()
      expect(headers).toEqual({
        "Content-Type": "application/json",
        Authorization: `Bearer ${fakeToken}`,
      })
    })

    it("lanza error si no hay token", () => {
      expect(() => getAuthHeaders()).toThrow("No hay token de autenticación")
    })
  })

  // Tests de fetchTasksApi
  describe("fetchTasksApi", () => {
    it("devuelve tareas si fetch ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => fakeTasks,
      })

      const result = await fetchTasksApi()
      expect(result).toEqual(fakeTasks)
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/tasks", {
        headers: getAuthHeaders(),
      })
    })

    it("lanza error si fetch no ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      fetch.mockResolvedValueOnce({ ok: false })

      await expect(fetchTasksApi()).rejects.toThrow("Error al obtener las tareas")
    })
  })

  // Tests de addTaskApi
  describe("addTaskApi", () => {
    it("crea una tarea y devuelve JSON si fetch ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      const newTask = { id: 2, text: "Nueva tarea" }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newTask,
      })

      const result = await addTaskApi("Nueva tarea")
      expect(result).toEqual(newTask)
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/tasks", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: "Nueva tarea" }),
      })
    })

    it("lanza error si fetch no ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      fetch.mockResolvedValueOnce({ ok: false })

      await expect(addTaskApi("Tarea fallida")).rejects.toThrow(
        "Error al crear la tarea"
      )
    })
  })

  // Tests de removeTaskApi
  describe("removeTaskApi", () => {
    it("elimina tarea y devuelve true si fetch ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      fetch.mockResolvedValueOnce({ ok: true })

      const result = await removeTaskApi(1)
      expect(result).toBe(true)
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/tasks/1", {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
    })

    it("lanza error si fetch no ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      fetch.mockResolvedValueOnce({ ok: false })

      await expect(removeTaskApi(1)).rejects.toThrow("Error al eliminar la tarea")
    })
  })

  // Tests de toggleTaskApi
  describe("toggleTaskApi", () => {
    it("actualiza tarea y devuelve JSON si fetch ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      const updatedTask = { id: 1, completed: true }
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedTask,
      })

      const result = await toggleTaskApi(1, true)
      expect(result).toEqual(updatedTask)
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/tasks/1", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed: true }),
      })
    })

    it("lanza error si fetch no ok", async () => {
      localStorage.setItem("authToken", fakeToken)
      fetch.mockResolvedValueOnce({ ok: false })

      await expect(toggleTaskApi(1, true)).rejects.toThrow(
        "Error al actualizar la tarea"
      )
    })
  })
})