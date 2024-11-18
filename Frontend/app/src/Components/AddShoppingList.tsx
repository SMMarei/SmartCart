// pages/CreateShoppingList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/ListFormularStyle.css";
import { createShoppingList } from "../Services/ShoppingListService.ts";
import { toast, ToastContainer } from "react-toastify";
import Navigation from "./Navigation.tsx";

const validateItemName = (name: string) => {
  const regex = /^[a-zA-Z0-9\s.,ÖöÄäÜüß,-]*$/; // Nur Buchstaben, Zahlen und Leerzeichen erlauben
  return regex.test(name);
};

const validateDescription = (description: string) => {
  const regex = /^[a-zA-Z0-9\s.,ÖöÄäÜüß!?-]*$/; // Buchstaben, Zahlen, Leerzeichen und einfache Satzzeichen
  return regex.test(description);
};

const AddShoppingList: React.FC = () => {
  const navigate = useNavigate();
  const [shoppingListData, setShoppingListData] = useState({
    listName: "",
    listDescription: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShoppingListData({ ...shoppingListData, [name]: value });
  };

  const handleAddShoppingList = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateItemName(shoppingListData.listName)) {
      setError(
        "Der Artikelnamen darf nur Buchstaben, Zahlen und Leerzeichen enthalten.",
      );
      return;
    }

    if (!validateDescription(shoppingListData.listDescription)) {
      setError("Die Beschreibung enthält ungültige Zeichen.");
      return;
    }

    try {
      await createShoppingList(
        shoppingListData.listName,
        shoppingListData.listDescription,
      );
      navigate("/ViewAllShoppingLists");
    } catch (error: any) {
      // Fehlerbehandlung bei doppelt vorhandenem Artikel
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          toast.error(error.message);
        } else {
          toast.error(
            "Fehler beim Hinzufügen Der Liste: List existiert bereits.",
          );
        }
      } else {
        toast.error("Ein unbekannter Fehler ist aufgetreten");
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navigation />
      <h2 className="list">Neue Einkaufsliste erstellen</h2>
      <div className="listpage-container">
        <div className="listform-container">
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleAddShoppingList}>
            <input
              type="text"
              name="listName"
              value={shoppingListData.listName}
              onChange={handleInputChange}
              placeholder="Listennamen eingeben"
              required
            />
            <input
              type="text"
              name="listDescription"
              value={shoppingListData.listDescription}
              onChange={handleInputChange}
              placeholder="Beschreibung eingeben"
            />
            <button className="list-button" type="submit">
              Einkaufsliste erstellen
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShoppingList;
