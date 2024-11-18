import { useNavigate } from "react-router-dom";
import "../Style/NavigationStyle.css";
import React from "react";

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="navigation">
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation("/Home")}>GO HOME</button>
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

export default Navigation;
