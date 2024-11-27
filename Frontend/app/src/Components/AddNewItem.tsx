import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/ItemFormularStyle.css";
import { addItem } from "../Services/ItemService.ts";
import { toast, ToastContainer } from "react-toastify";
import Navigation from "./Navigation.tsx";

const DEFAULT_IMAGE_URL = "./src/assets/default.png";

// Validation functions
const validateItemName = (name: string) => {
  const regex = /^[a-zA-Z0-9\s.,ÖöÄäÜüß-]*$/; // Nur Buchstaben, Zahlen und Leerzeichen erlauben
  return regex.test(name);
};

const validateDescription = (description: string) => {
  const regex = /^[a-zA-Z0-9\s.,ÖöÄäÜüß!?-]*$/; // Buchstaben, Zahlen, Leerzeichen und einfache Satzzeichen
  return regex.test(description);
};

const validateImageUrl = (url: string) => {
  const regex = /\.(jpg|jpeg|png|gif|avif)$/i;
  return !url || regex.test(url); // Wenn keine URL angegeben, wird sie als gültig betrachtet
};

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    itemName: "",
    itemDescription: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  // input change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };
  // add item Handler
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input data
    if (!validateItemName(itemData.itemName)) {
      setError(
        "Der Artikelnamen darf nur Buchstaben, Zahlen und Leerzeichen enthalten.",
      );
      return;
    }

    if (!validateDescription(itemData.itemDescription)) {
      setError("Die Beschreibung enthält ungültige Zeichen.");
      return;
    }

    if (!validateImageUrl(itemData.image)) {
      setError("Die Bild-URL ist ungültig.");
      return;
    }
    const imageUrl = itemData.image || DEFAULT_IMAGE_URL;

    try {
      await addItem(itemData.itemName, itemData.itemDescription, imageUrl);
      navigate("/ViewAllItems");
    } catch (error: unknown) {
      //Error handling for double item name
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          toast.error(error.message);
        } else {
          toast.error(
            "Fehler beim Hinzufügen des Artikels: Artikel existiert bereits.",
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
      <h2>Neuen Artikel hinzufügen</h2>
      <div className="page-container">
        <div className="form-container">
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleAddItem}>
            <input
              type="text"
              name="itemName"
              value={itemData.itemName}
              onChange={handleInputChange}
              placeholder="Artikelnamen eingeben"
              required
            />
            <input
              type="text"
              name="itemDescription"
              value={itemData.itemDescription}
              onChange={handleInputChange}
              placeholder="Beschreibung eingeben"
            />
            <input
              type="text"
              name="image"
              value={itemData.image}
              onChange={handleInputChange}
              placeholder="Bild-URL eingeben (optional)"
            />
            <br /> <br />
            <button type="submit">Artikel erstellen</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
