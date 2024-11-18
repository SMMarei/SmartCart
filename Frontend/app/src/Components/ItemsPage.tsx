import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItems } from "../Services/ItemService.ts";
import { Item } from "../interface/Item.tsx";
import { addItemToShoppingList } from "../Services/ShoppingListService.ts";
import "../Style/ItemPagesStyle.css";

const ItemsPage: React.FC = () => {
  const { shoppingListId } = useParams<{ shoppingListId: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {},
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems);
      } catch (error) {
        setError("Fehler beim Laden der Artikel.");
      }
    };
    fetchItems();
  }, []);

  const handleItemSelection = (itemId: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleSaveSelection = async () => {
    try {
      for (const [itemId, quantity] of Object.entries(selectedItems)) {
        if (quantity > 0) {
          const item = items.find((i) => i.itemId === itemId);
          if (item) {
            await addItemToShoppingList(shoppingListId!, {
              nameOfItem: item.itemName,
              description: item.itemDescription,
              quantity,
            });
          }
        }
      }
      navigate("/ViewAllShoppingLists");
    } catch (err) {
      setError("Fehler beim Hinzufügen der Artikel zur Einkaufsliste.");
    }
  };

  return (
    <div className="item-page-container">
      <h2>Artikel zur Einkaufsliste hinzufügen</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="items-list">
        {items.map((item) => (
          <div key={item.itemId} className="item-card">
            <h3>{item.itemName}</h3>
            <p>{item.itemDescription}</p>
            <input
              type="number"
              min="0"
              placeholder="Menge"
              onChange={(e) =>
                handleItemSelection(item.itemId, parseInt(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <button onClick={handleSaveSelection} className="save-button">
        Auswahl speichern
      </button>
    </div>
  );
};

export default ItemsPage;