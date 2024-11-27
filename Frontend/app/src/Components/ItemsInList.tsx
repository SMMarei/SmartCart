import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteItemFromShoppingList } from "../Services/ShoppingListService";
import { ShoppingListItem } from "../interface/ShoppingListItem";
import Navigation from "./Navigation.tsx";

const ItemsInList = () => {
  const { listId } = useParams<{ listId: string }>();
  const [items, setItems] = useState<ShoppingListItem[]>([]); // Ensure items is always an array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/ShoppingLists/ItemsFromShoppingList/${listId}`,
      );
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Artikel.");
      }

      const data: ShoppingListItem[] = await response.json();
      console.log("Fetched items:", data); // Debugging: Check the API response

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        throw new Error(
          "Die erhaltenen Daten sind keine gültige Liste von Artikeln.",
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems, listId]);

  // select item handler
  const handleSelectItem = (itemName: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemName)
        ? prevSelected.filter((name) => name !== itemName)
        : [...prevSelected, itemName],
    );
  };

  // delete and update
  const deleteAndUpdate = async (itemName: string) => {
    try {
      // delete item
      await deleteItemFromShoppingList(listId!, itemName); // listName & itemName instead of  listId und itemId

      // update items
      await fetchItems();

      // clear selected items
      setSelectedItems([]);
      alert("Artikel erfolgreich gelöscht!");
    } catch (error) {
      console.error("Fehler beim Löschen des Artikels:", error);
      setError("Fehler beim Löschen des Artikels.");
    }
  };

  // delete handler
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    const itemsToDelete = items.filter(
      (item) => selectedItems.includes(item.nameOfItem), // use nameOfItem instead of item.id
    );

    if (
      !window.confirm(
        `Möchten Sie die folgenden Artikel löschen?\n${itemsToDelete
          .map((item) => `- ${item.nameOfItem}`)
          .join("\n")}`,
      )
    ) {
      return;
    }

    // delete item for each selected item
    for (const itemName of selectedItems) {
      await deleteAndUpdate(itemName); // Löschen mit itemName
    }
  };

  // back to lists
  const handleBackToLists = () => {
    navigate("/ViewAllShoppingLists");
  };

  if (loading) return <p>Daten werden geladen...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div>
      <Navigation />
      <div style={{ padding: "20px" }}>
        <h2>Artikel in der Liste</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.nameOfItem}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div>
                <p>
                  <strong>Name:</strong> {item.nameOfItem}
                </p>
                <p>
                  <strong>Menge:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Beschreibung:</strong> {item.description}
                </p>
              </div>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.nameOfItem)} // use nameOfItem instead of item.id
                onChange={() => handleSelectItem(item.nameOfItem)}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={handleDeleteSelected}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            marginRight: "10px",
            cursor: "pointer",
          }}
          disabled={selectedItems.length === 0}
        >
          Ausgewählte Artikel löschen
        </button>
        <button
          onClick={handleBackToLists}
          style={{
            backgroundColor: "gray",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Zurück zu den Einkaufslisten
        </button>
      </div>
    </div>
  );
};

export default ItemsInList;
