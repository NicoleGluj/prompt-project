import { MicrophoneIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";

export const Header = () => (
  <header className="m-4 p-2 flex justify-between items-center z-10 border-b-1 border-white/40">
    <div className="flex items-center gap-2 text-white ">
      <MicrophoneIcon className="w-6 h-6" />
      <h1 className="text-lg uppercase tracking-wider font-[Alexandria]!"><Link to="/">VoiceTasks
      </Link></h1>
    </div>
    <nav className="flex items-center gap-7 font-semibold text-white">
      <Link
        to="/login"
        className="transition-transform duration-200 transform hover:scale-105 uppercase"
      >
        Ingresar
      </Link>
      <Link
        to="/register"
        className="border-2 px-5 rounded-2xl flex items-center  transition-transform duration-200 transform hover:scale-105 uppercase"
      >
        Registrar
      </Link>
      {/* <Link
        to="/"
        className="transition-transform duration-200 transform hover:scale-105"
      >
        Mis Tareas
      </Link> */}
    </nav>
  </header >
)
