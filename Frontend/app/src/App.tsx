import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import appRoutes from "./AppRoutes.tsx";

const App: React.FC = () => {
  const routes = useRoutes(appRoutes);

  return routes;
};

const Root: React.FC = () => (
  <div
    style={{
      backgroundImage: "url('./assets/background.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh", // Bild füllt die gesamte Höhe des Bildschirms
      padding: "20px",
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>
);

export default Root;
