import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "../pages/Login"
import { MisTareas } from "../pages/MisTareas"
import { NotFound } from "../pages/NotFound"
import { Register } from "../pages/Register"
import { PrivateRoute } from "../components/PrivateRoute"

export const RouterApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MisTareas />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)