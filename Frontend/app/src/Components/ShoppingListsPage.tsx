// ShoppingListsPage.tsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingList } from "../interface/ShoppingList.tsx";
import { getAllShoppingLists } from "../Services/ShoppingListService.ts";
import { addItemToShoppingList } from "../Services/ItemService.ts"; // Importieren der angepassten Funktion

export const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItem = location.state?.item; // Erwartet, dass item ein { itemId, ... } enthält

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const lists = await getAllShoppingLists();
        setShoppingLists(lists);
      } catch (error) {
        console.error("Fehler beim Abrufen der Einkaufslisten", error);
      }
    };
    fetchShoppingLists();
  }, []);

  const handleCheckboxChange = (listId: string) => {
    setSelectedLists((prevSelectedLists) =>
      prevSelectedLists.includes(listId)
        ? prevSelectedLists.filter((id) => id !== listId)
        : [...prevSelectedLists, listId],
    );
  };

  const handleSaveSelection = async () => {
    if (!selectedItem || !selectedItem.itemId) {
      console.error("Kein gültiges Item zum Hinzufügen vorhanden.");
      return;
    }

    try {
      for (const listId of selectedLists) {
        console.log(
          `Artikel zur Liste hinzufügen:`,
          selectedItem,
          `Liste: ${listId}`,
        );

        await addItemToShoppingList(
          selectedItem.itemId, // Nur itemId übergeben
          listId, // shoppingListId übergeben
        );
      }

      console.log("Artikel erfolgreich zur Einkaufsliste hinzugefügt!");
      navigate("/ViewAllShoppingLists");
    } catch (error) {
      console.error("Fehler beim Speichern der Auswahl:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wählen Sie die Einkaufsliste(n) aus für {selectedItem?.itemName}</h2>
      <form>
        {shoppingLists.map((list) => (
          <div key={list.id} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              id={list.id}
              checked={selectedLists.includes(list.id)}
              onChange={() => handleCheckboxChange(list.id)}
            />
            <label htmlFor={list.id}>{list.listName}</label>
          </div>
        ))}
      </form>
      <button onClick={handleSaveSelection} style={{ marginTop: "20px" }}>
        Auswahl speichern
      </button>
    </div>
  );
};

export default ShoppingListsPage;
