import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { MisTareas } from "../pages/MisTareas";
import { NotFound } from "../pages/NotFound";

export const RouterApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/mis-tareas" element={<MisTareas />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)
