import { Link } from "react-router-dom"
import { Layout } from "../layout/Layout"

export const Home = () => {
  return (
    <Layout>
      <section className="flex flex-col items-start justify-end h-full p-6">
        <h1 className="w-1/2 text-7xl font-[Alexandria]! font-extralight text-white">
          Conoce una nueva forma de recordar tus tareas
        </h1>
        <Link to="/login" className="border-2 border-white text-white px-8 py-2 rounded-2xl mt-8 font-medium uppercase">
          Comenzar
        </Link>
      </section>
    </Layout>
  )
}