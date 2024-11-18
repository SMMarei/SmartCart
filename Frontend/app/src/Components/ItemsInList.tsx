import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteItemFromShoppingList } from "../Services/ShoppingListService";
import { ShoppingListItem } from "../interface/ShoppingListItem";

const ItemsInList = () => {
  const { listId } = useParams<{ listId: string }>(); // Verwendet jetzt listName
  const [items, setItems] = useState<ShoppingListItem[]>([]); // Ensure items is always an array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  // Daten von der API abrufen
  const fetchItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/ShoppingLists/ItemsFromShoppingList/${listId}`, // listName anstelle von listId
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
  }, [listId]);

  // Auswahl-Handler
  const handleSelectItem = (itemName: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemName)
        ? prevSelected.filter((name) => name !== itemName)
        : [...prevSelected, itemName],
    );
  };

  // Löschen und Aktualisieren
  const deleteAndUpdate = async (itemName: string) => {
    try {
      // Artikel löschen
      await deleteItemFromShoppingList(listId!, itemName); // listName und itemName anstelle von listId und itemId

      // Liste aktualisieren
      await fetchItems();

      // Auswahl zurücksetzen
      setSelectedItems([]);
      alert("Artikel erfolgreich gelöscht!");
    } catch (error) {
      console.error("Fehler beim Löschen des Artikels:", error);
      setError("Fehler beim Löschen des Artikels.");
    }
  };

  // Lösch-Handler
  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    const itemsToDelete = items.filter(
      (item) => selectedItems.includes(item.nameOfItem), // Verwende nameOfItem statt item.id
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

    // Artikel einzeln löschen und Liste aktualisieren
    for (const itemName of selectedItems) {
      await deleteAndUpdate(itemName); // Löschen mit itemName
    }
  };

  // Zurück zur Übersicht der Einkaufslisten
  const handleBackToLists = () => {
    navigate("/ViewAllShoppingLists");
  };

  if (loading) return <p>Daten werden geladen...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Artikel in der Liste</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.nameOfItem} // Verwende nameOfItem anstelle von item.id
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
              checked={selectedItems.includes(item.nameOfItem)} // Verwende nameOfItem anstelle von item.id
              onChange={() => handleSelectItem(item.nameOfItem)} // Verwende nameOfItem anstelle von item.id
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
  );
};

export default ItemsInList;
