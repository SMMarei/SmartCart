import { useNavigate } from "react-router-dom";
import "../Style/Home.css";
import React from "react";

const HomeNavi: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="hero-section"></div>
      <h1>Willkommen bei Ihrer Einkaufsliste-App</h1>
      <p>
        Verwalten Sie Ihre Einkaufslisten und Lieblingsartikel einfach und
        effizient.
      </p>
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation("/AllFavouriteItems")}>
          ❤ Lieblingsartikel
        </button>
        <button onClick={() => handleNavigation("/addShoppingList")}>
          📝 Einkaufsliste erstellen
        </button>
        <button onClick={() => handleNavigation("/addItem")}>
          ➕ Artikel hinzufügen
        </button>
        <button onClick={() => handleNavigation("/FindShoppingList")}>
          🔍 Einkaufslisten durchsuchen
        </button>
        <button onClick={() => handleNavigation("/viewAllShoppingLists")}>
          📋 Alle Einkaufslisten
        </button>
        <button onClick={() => handleNavigation("/viewAllItems")}>
          📦 Alle Artikel
        </button>
      </div>
    </div>
  );
};

export default HomeNavi;
