import { useEffect, useRef, useState } from "react";
import { Item } from "../interface/Item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faStar } from "@fortawesome/free-solid-svg-icons";
import defaultIcon from "../assets/default.png";
import background from "../assets/background2.jpg";
import {
  deleteItem,
  editItemName,
  toggleFavorite,
} from "../Services/ItemService.ts";
import { useNavigate } from "react-router-dom";
import Navigation from "../Components/Navigation.tsx";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

export const ViewAllItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemDescription, setNewItemDescription] = useState<string>("");
  const [itemIdToDelete, setItemToDelete] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  // Fetching items from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/Items/AllItems");
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Daten");
        }
        const data: Item[] = await response.json();
        setItems(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Click event to close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggles the menu for a specific item
  const handleMenuClick = (itemId: string) => {
    setActiveMenu((prev) => (prev === itemId ? null : itemId));
  };

  // Toggle favorite status for an item using the service
  const handleToggleFavorite = async (itemId: string) => {
    console.log("Vor dem Toggle:", items); // Debugging
    const previousItems = [...items];

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId
          ? { ...item, isFavorite: !item.isFavorite }
          : item,
      ),
    );

    try {
      const updatedItem = await toggleFavorite(itemId);
      console.log("Serverantwort:", updatedItem); // Debugging

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.itemId === updatedItem.itemId
            ? { ...item, isFavorite: updatedItem.isFavorite }
            : item,
        ),
      );
    } catch (error) {
      console.error("Fehler:", error);
      setItems(previousItems);
    }
  };
  // Fügen Sie diese Methode zu ViewAllItems hinzu
  const goToShoppingListsPage = (item: Item) => {
    navigate("/ShoppingLists", { state: { item } });
  };

  const menuItemStyle = {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    textAlign: "left" as const,
    cursor: "pointer",
  };

  const handleDeleteItem = async () => {
    if (itemIdToDelete) {
      try {
        await deleteItem(itemIdToDelete);
        setItems((prevItems) =>
          prevItems.filter((item) => item.itemId !== itemIdToDelete),
        );
        setIsDeleteDialogOpen(false);
        toast.success("Artikel erfolgreich gelöscht!");
      } catch (error) {
        // console.error("Fehler beim Löschen des Artikels:", error); // Debugging
        if (
          error instanceof Error &&
          error.message.includes("associated with a shopping list")
        ) {
          toast.error(
            "Der Artikel kann nicht gelöscht werden, da er mit einer Einkaufsliste verknüpft ist. Bitte entfernen Sie den Artikel zuerst aus der Einkaufsliste.",
          );
        } else {
          toast.error(
            "Fehler beim Löschen des Artikels: " +
              (error instanceof Error ? error.message : "Unbekannter Fehler"),
          );
        }
      }
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const showDeleteDialog = (itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  const editItem = (item: Item) => {
    setItemToEdit(item);
    setNewItemName(item.itemName);
    setNewItemDescription(item.itemDescription);
    setIsEditDialogOpen(true);
    setActiveMenu(null);
  };

  const handleEditSubmit = async () => {
    if (itemToEdit) {
      try {
        // Führe die Aktualisierung durch
        await editItemName(itemToEdit.itemId, {
          itemName: newItemName,
          itemDescription: newItemDescription,
        });

        // Aktualisiere den State manuell mit den neuen Werten
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.itemId === itemToEdit.itemId
              ? {
                  ...item,
                  itemName: newItemName,
                  itemDescription: newItemDescription,
                }
              : item,
          ),
        );

        setIsEditDialogOpen(false); // Schließe den Dialog
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Fehler beim Bearbeiten des Artikels",
        );
      }
    }
  };

  const handleAddToShoppingList = (item: Item) => {
    goToShoppingListsPage(item); // Weiterleitung zur Auswahlseite
  };

  if (loading) return <p>Daten werden geladen...</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div>
      <ToastContainer />
      <Navigation />
      <div
        style={{
          padding: "20px",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        <h2>Alle Artikel</h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {items.map((item) => (
            <li
              key={item.itemId}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "30px",
                margin: "30px 0",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                gap: "15px",
                position: "relative",
              }}
            >
              <img
                src={item.image || defaultIcon}
                alt={item.itemName}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <div style={{ flex: 2 }}>
                <h3 style={{ margin: "0 0 5px 0" }}>Name: {item.itemName}</h3>
                <p style={{ margin: "0 0 5px 0", color: "#555" }}>
                  Description: {item.itemDescription}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faStar}
                style={{
                  color: item.isFavorite ? "gold" : "gray", // Sternfarbe entsprechend dem Status
                  fontSize: "24px",
                  cursor: "pointer",
                }}
                title={item.isFavorite ? "Favorit entfernen" : "Favorit setzen"}
                onClick={() => handleToggleFavorite(item.itemId)}
              />

              <FontAwesomeIcon
                icon={faEllipsisV}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  marginLeft: "auto",
                }}
                onClick={() => handleMenuClick(item.itemId)}
              />

              {activeMenu === item.itemId && (
                <div
                  ref={menuRef}
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "10px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    zIndex: 1,
                    overflow: "hidden",
                  }}
                >
                  <button
                    style={menuItemStyle}
                    onClick={() => showDeleteDialog(item.itemId)}
                  >
                    Löschen
                  </button>
                  <button style={menuItemStyle} onClick={() => editItem(item)}>
                    Bearbeiten
                  </button>
                  <button
                    style={menuItemStyle}
                    onClick={() => handleAddToShoppingList(item)}
                  >
                    Zur Einkaufsliste
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {isDeleteDialogOpen && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 2,
              width: "300px",
            }}
          >
            <h4>Artikel wirklich löschen?</h4>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={cancelDelete}
                style={{ ...buttonStyle, backgroundColor: "#f44336" }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteItem}
                style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
              >
                Löschen
              </button>
            </div>
          </div>
        )}

        {isEditDialogOpen && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 2,
              width: "300px",
            }}
          >
            <h4>Artikel bearbeiten</h4>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Name"
              style={inputStyle}
            />
            <textarea
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              placeholder="Beschreibung"
              style={inputStyle}
            ></textarea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                style={{ ...buttonStyle, backgroundColor: "#f44336" }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleEditSubmit}
                style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
              >
                Speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  border: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
  color: "white",
  borderRadius: "5px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  marginBottom: "10px",
};
