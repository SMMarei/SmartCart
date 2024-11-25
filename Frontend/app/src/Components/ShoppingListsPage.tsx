import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingList } from "../interface/ShoppingList.tsx";
import { getAllShoppingLists } from "../Services/ShoppingListService.ts";
import { addItemToShoppingList } from "../Services/ItemService.ts";
import Navigation from "./Navigation.tsx";

export const ShoppingListsPage = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItem = location.state?.item; // Get the selected item from the location state

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
          selectedItem.itemId, // only  itemId is passed
          listId, // shoppingListId is passed
        );
      }

      console.log("Artikel erfolgreich zur Einkaufsliste hinzugefügt!");
      navigate("/ViewAllShoppingLists");
    } catch (error) {
      console.error("Fehler beim Speichern der Auswahl:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div
        style={{
          padding: "20px",
          marginTop: "20px",
          marginLeft: "20px",
          marginRight: "20px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          border: "1px solid darkturquoise",
        }}
      >
        <h2>
          Wählen Sie die Einkaufsliste(n) aus für {selectedItem?.itemName}
        </h2>
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
        <button
          onClick={handleSaveSelection}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Auswahl speichern
        </button>
      </div>
    </div>
  );
};

export default ShoppingListsPage;
