import { MicrophoneIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

export const Header = () => (
  <header className="bg-[#FF4583] text-white p-4 flex justify-between items-center shadow-md">
    <div className="flex items-center gap-2">
      <MicrophoneIcon className="w-6 h-6" />
      <h1 className="text-xl font-semibold tracking-wider">SayDo</h1>
    </div>
    <nav className="flex gap-4 font-semibold">
      <Link
        to="/"
        className="transition-transform duration-200 transform hover:scale-105"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="transition-transform duration-200 transform hover:scale-105"
      >
        Registro
      </Link>
      <Link
        to="/mis-tareas"
        className="transition-transform duration-200 transform hover:scale-105"
      >
        Mis Tareas
      </Link>
    </nav>
  </header>
)
