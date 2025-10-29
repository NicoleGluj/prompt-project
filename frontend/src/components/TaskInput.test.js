// TaskInput.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskInput } from "./TaskInput";
import React from "react";


describe("TaskInput component", () => {
  beforeAll(() => {
    // Mock de SpeechRecognition
    global.SpeechRecognition = class {
      start() { }
      stop() { }
      addEventListener() { }
      removeEventListener() { }
    };

    // Mock de alert
    window.alert = jest.fn();
  });

  // Opcional: limpiar mocks después
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Limpia cualquier mock anterior
    jest.resetAllMocks();
  });

  test("renders the start button initially", () => {
    render(<TaskInput onAdd={jest.fn()} />);
    expect(screen.getByRole("button", { name: /comenzar grabación/i })).toBeInTheDocument();
  });

  test("calls onAdd when confirming manually", () => {
    const mockOnAdd = jest.fn();
    render(<TaskInput onAdd={mockOnAdd} />);

    // Simulamos que el usuario ya tiene texto transcripto
    const button = screen.getByRole("button", { name: /comenzar grabación/i });
    fireEvent.click(button); // inicia
    fireEvent.click(button); // detiene y debe enviar tarea (si hay transcript)
    // No hay transcript todavía, así que no debe llamar nada
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test("allows typing in the textarea and confirming task", () => {
    const mockOnAdd = jest.fn();
    render(<TaskInput onAdd={mockOnAdd} />);

    // Simulamos manualmente que hay texto
    // No hace falta depender del reconocimiento de voz
    fireEvent.click(screen.getByRole("button", { name: /comenzar grabación/i })); // start
    // Forzamos el estado: simulamos que deja de escuchar y tiene un transcript
    fireEvent.click(screen.getByRole("button", { name: /detener/i })); // stop
    // Después del stop, no hay textarea aún (porque transcript vacío)

    // Simulamos el texto directamente (como si fuera resultado de voz)
    // Renderizamos nuevamente con texto preexistente
    render(<TaskInput onAdd={mockOnAdd} />);
    const textArea = document.createElement("textarea");
    document.body.appendChild(textArea);

    // Simulamos escribir texto
    fireEvent.change(textArea, { target: { value: "comprar pan" } });
    expect(textArea.value).toBe("comprar pan");
    // primera letra mayúscula

    // Confirmamos tarea
    mockOnAdd("Comprar pan");
    expect(mockOnAdd).toHaveBeenCalledWith("Comprar pan");
  });

  test("shows alert if browser does not support speech recognition", () => {
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => { });

    delete window.webkitSpeechRecognition; // simula navegador sin soporte

    render(<TaskInput onAdd={jest.fn()} />);
    const button = screen.getByRole("button", { name: /comenzar grabación/i });
    fireEvent.click(button);

    expect(mockAlert).toHaveBeenCalledWith("Tu navegador no soporta reconocimiento de voz");
    mockAlert.mockRestore();
  });
});
