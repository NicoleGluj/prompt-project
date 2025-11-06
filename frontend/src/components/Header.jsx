import { MicrophoneIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="m-4 p-2 flex justify-between items-center z-10 border-b border-white/40 sm:m-4 sm:p-2 xs:m-2 xs:p-1 relative">
      <div className="flex items-center gap-2 sm:gap-2 xs:gap-1 text-white">
        <MicrophoneIcon className="w-6 h-6 sm:w-6 sm:h-6 xs:w-5 xs:h-5" />
        <h1 className="text-lg sm:text-lg xs:text-base uppercase tracking-wider font-[Alexandria]!">
          <Link to="/">VoiceTasks</Link>
        </h1>
      </div>

      {/* Links normales en sm y mayores */}
      <nav className="hidden sm:flex items-center gap-7 font-semibold text-white">
        {!user && (
          <>
            <Link
              to="/login"
              className="transition-transform duration-200 transform hover:scale-105 uppercase text-sm"
            >
              Ingresar
            </Link>
            <Link
              to="/register"
              className="border-2 px-5 py-1 rounded-2xl flex items-center transition-transform duration-200 transform hover:scale-105 uppercase text-sm"
            >
              Registrar
            </Link>
          </>
        )}
        {user && (
          <>
            <Link
              to="/mistareas"
              className="transition-transform duration-200 transform hover:scale-105 uppercase text-sm"
            >
              Mis tareas
            </Link>
            <button
              onClick={logout}
              className="border-2 px-5 py-1 rounded-2xl flex items-center transition-transform duration-200 transform hover:scale-105 uppercase text-sm"
            >
              Cerrar Sesión
            </button>
          </>
        )}
      </nav>

      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white w-6 h-6"
        >
          {menuOpen ? <XMarkIcon /> : <Bars3Icon />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col gap-3 text-white z-20 sm:hidden min-w-[150px]">
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Ingresar
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Registrar
              </Link>
            </>
          )}
          {user && (
            <>
              <Link to="/mistareas" onClick={() => setMenuOpen(false)}>
                Mis tareas
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
