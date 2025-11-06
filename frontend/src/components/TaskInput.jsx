import { ArrowLongRightIcon, MicrophoneIcon } from "@heroicons/react/16/solid"
import { useRef, useState } from "react"

export const TaskInput = ({ onAdd }) => {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef(null)

  const initRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Tu navegador no soporta reconocimiento de voz")
      return null
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.lang = "es-ES"
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript
      const capitalized = result.charAt(0).toUpperCase() + result.slice(1)
      setTranscript((prev) => (prev ? prev + " " + capitalized : capitalized))
    }

    recognition.onend = () => {
      setListening(false)
    }

    return recognition
  }

  const handleToggle = () => {
    if (listening) {
      recognitionRef.current?.stop()
    } else {
      if (transcript.trim()) {
        onAdd(transcript.trim())
        setTranscript("")
      }
      recognitionRef.current = initRecognition()
      recognitionRef.current?.start()
      setListening(true)
    }
  }

  const handleConfirm = () => {
    if (transcript.trim()) {
      onAdd(transcript.trim())
      setTranscript("")
    }
  }

  return (
    <section className="mt-4 flex justify-center px-2 xs:px-0">
      <div className="flex w-full xs:max-w-full sm:max-w-2xl bg-white/90 rounded-2xl p-2 items-center">
        <button
          onClick={handleToggle}
          className={`flex items-center px-3 xs:px-2 py-2 rounded-2xl text-[#FAA24B] font-semibold gap-2 ${listening ? "" : "hover:text-[#e97b0e]"} text-sm xs:text-xs`}
        >
          <MicrophoneIcon className="w-6 h-6 xs:w-5 xs:h-5" />
          {listening ? "Detener" : ""}
        </button>

        <textarea
          value={transcript}
          onChange={(e) => {
            const value = e.target.value
            const capitalized = value.charAt(0).toUpperCase() + value.slice(1)
            setTranscript(capitalized)
          }}
          rows="1"
          className="flex-1 p-2 text-gray-800 mr-4 text-sm xs:text-xs"
          placeholder="Escribe tu tarea..."
        />
        <button
          onClick={handleConfirm}
          className="px-3 xs:px-2 py-2 bg-[#0e77c294] hover:bg-[#0e77c2c5] text-white rounded-2xl font-medium"
        >
          <ArrowLongRightIcon className="w-5 h-5 xs:w-4 xs:h-4" />
        </button>
      </div>
    </section>
  )
}
