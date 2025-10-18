import { Layout } from "../layout/Layout";

export const NotFound = () => (
  <Layout>
    <div className="flex items-center justify-center min-h-[80vh]">
      <h1
        className="text-5xl md:text-5xl font-bold text-center leading-tight"
        style={{
          background: "linear-gradient(90deg, #FB0FBA, #FF8A59)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          overflow: "visible",
        }}
      >
        404 - Página no encontrada
      </h1>
    </div>
  </Layout>
)