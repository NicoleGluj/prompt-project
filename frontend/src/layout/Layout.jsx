import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export const Layout = ({ children }) => (
  <div className="h-screen flex flex-col bg-white text-gray-800 bg-[linear-gradient(153deg,rgba(14,119,194,0.77)_28%,rgba(250,162,75,0.84)_64%)] ">
    <Header />
    <main className="h-full">{children}</main>
    <Footer />
  </div>
)
