import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white text-gray-800">
    <Header />
    <main className="flex-1 p-6">{children}</main>
    <Footer />
  </div>
)
