import { renderHook, act } from "@testing-library/react"
import { waitFor } from "@testing-library/react"
import { useTasks } from "./useTasks"
import * as apiTasks from "../services/apiTasks"

jest.mock("../services/apiTasks")

describe("useTasks hook", () => {
  const mockTasks = [
    { id: 1, text: "Task 1", completed: false },
    { id: 2, text: "Task 2", completed: true },
  ]

  beforeEach(() => jest.clearAllMocks())

  test("carga las tareas al montar", async () => {
    apiTasks.fetchTasksApi.mockResolvedValue(mockTasks)

    const { result } = renderHook(() => useTasks())

    await waitFor(() => expect(result.current.tasks).toEqual(mockTasks))
    expect(apiTasks.fetchTasksApi).toHaveBeenCalledTimes(1)
  })

  test("addTask agrega una tarea", async () => {
    apiTasks.fetchTasksApi.mockResolvedValue([])
    apiTasks.addTaskApi.mockResolvedValue({ id: 3, text: "Nueva", completed: false })

    const { result } = renderHook(() => useTasks())

    await act(async () => {
      await result.current.addTask("Nueva")
    })

    await waitFor(() =>
      expect(result.current.tasks).toEqual([{ id: 3, text: "Nueva", completed: false }])
    )
  })

  test("removeTask elimina una tarea", async () => {
    apiTasks.fetchTasksApi.mockResolvedValue(mockTasks)
    apiTasks.removeTaskApi.mockResolvedValue()

    const { result } = renderHook(() => useTasks())

    await act(async () => {
      await result.current.removeTask(1)
    })

    await waitFor(() =>
      expect(result.current.tasks).toEqual([{ id: 2, text: "Task 2", completed: true }])
    )
  })

  test("toggleTask alterna completado", async () => {
    // Mockeamos las tareas iniciales
    apiTasks.fetchTasksApi.mockResolvedValue([
      { id: 1, text: "Task 1", completed: false },
      { id: 2, text: "Task 2", completed: true },
    ]);

    // Mockeamos toggleTaskApi para que devuelva la tarea con completed actualizado
    apiTasks.toggleTaskApi.mockImplementation((id, completed) =>
      Promise.resolve({ id, text: `Task ${id}`, completed })
    );

    const { result } = renderHook(() => useTasks());

    // Esperamos que las tareas iniciales se carguen
    await waitFor(() => expect(result.current.tasks.length).toBe(2));

    // Toggle de la tarea
    await act(async () => {
      await result.current.toggleTask(1);
    });

    // Esperamos que la tarea 1 ahora tenga completed = true
    await waitFor(() =>
      expect(result.current.tasks.find(t => t.id === 1).completed).toBe(true)
    );
  });


})
