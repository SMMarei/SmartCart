import { useEffect, useState } from "react";
import { ShoppingList } from "../interface/ShoppingList";
import { ShoppingListItem } from "../interface/ShoppingListItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import background from "../assets/background2.jpg";
import {
  deleteShoppingList,
  EditShoppingList,
} from "../Services/ShoppingListService";
import { useNavigate } from "react-router-dom";
import Navigation from "../Components/Navigation.tsx";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const ViewAllShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    listName: "",
    listDescription: "",
  });

  const navigate = useNavigate();

  // data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/ShoppingLists/LastUpdatedShoppingList",
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data: ShoppingList[] = await response.json();
        setShoppingLists(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // toggle list
  const toggleList = (listId: string) => {
    setExpandedListId((prev) => (prev === listId ? null : listId));
  };

  // delete list
  const handleDelete = async (listId: string) => {
    try {
      await deleteShoppingList(listId);
      setShoppingLists((prevLists) =>
        prevLists.filter((list) => list.id !== listId),
      );
      toast.success("Einkaufsliste erfolgreich gelöscht!");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("cannot be deleted")) {
          toast.error(error.message);
        } else {
          toast.error(
            "Diese Einkaufsliste kann nicht gelöscht werden, da sie Artikel enthält.",
          );
        }
      } else {
        toast.error("Ein unbekannter Fehler ist aufgetreten");
      }
    }
  };

  // changes edit/ start edit mode
  const handleEditClick = (list: ShoppingList) => {
    setEditMode(list.id);
    setEditData({
      listName: list.listName,
      listDescription: list.listDescription,
    });
  };

  // changes save
  const handleEditSave = async (listId: string) => {
    try {
      const response = await EditShoppingList(listId, editData);
      if (response && response.id) {
        setShoppingLists((prevLists) =>
          prevLists.map((list) =>
            list.id === listId ? { ...list, ...editData } : list,
          ),
        );
        setEditMode(null);
        setEditData({ listName: "", listDescription: "" });
      } else {
        throw new Error(
          "Speichern fehlgeschlagen. Keine gültige Antwort vom Server erhalten.",
        );
      }
    } catch (error) {
      console.error("Fehler beim Bearbeiten der Liste:", error);
    }
  };

  // changes cancel
  const handleEditCancel = () => {
    setEditMode(null);
    setEditData({ listName: "", listDescription: "" });
  };

  // navigate to add item page
  const handleAddItemClick = (listId: string) => {
    navigate(`/ItemsPage/${listId}`);
  };

  const handleDeleteItemClick = (listId: string) => {
    navigate(`/ItemsInList/${listId}`);
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
        <h2>Alle Einkaufslisten</h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {shoppingLists.map((list) => (
            <li
              key={list.id}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "20px",
                margin: "10px 0",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Bearbeiten-Modus */}
              {editMode === list.id ? (
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="text"
                    value={editData.listName}
                    onChange={(e) =>
                      setEditData({ ...editData, listName: e.target.value })
                    }
                    placeholder="Listenname bearbeiten"
                    style={{
                      marginBottom: "10px",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="text"
                    value={editData.listDescription}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        listDescription: e.target.value,
                      })
                    }
                    placeholder="Beschreibung bearbeiten"
                    style={{
                      marginBottom: "10px",
                      padding: "5px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    onClick={() => handleEditSave(list.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Speichern
                  </button>
                  <button onClick={handleEditCancel}>Abbrechen</button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleList(list.id)}
                >
                  <div>
                    <h3 style={{ margin: "0" }}>{list.listName}</h3>
                    <p style={{ margin: "0", color: "#555" }}>
                      {list.listDescription}
                    </p>
                  </div>
                  <FontAwesomeIcon
                    icon={
                      expandedListId === list.id ? faChevronUp : faChevronDown
                    }
                    style={{ fontSize: "24px", color: "#888" }}
                  />
                </div>
              )}

              {/* Artikel anzeigen, wenn die Liste aufgeklappt ist */}
              {expandedListId === list.id && (
                <div style={{ marginTop: "10px" }}>
                  <h4>Artikel in der Liste:</h4>
                  <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                    {list.items && list.items.length > 0 ? (
                      list.items.map((item: ShoppingListItem) => (
                        <li
                          key={item.id}
                          style={{
                            backgroundColor: "#f9f9f9",
                            padding: "10px",
                            margin: "5px 0",
                            borderRadius: "8px",
                          }}
                        >
                          <p style={{ margin: "0" }}>
                            <strong>Name:</strong> {item.nameOfItem}
                          </p>
                          <p style={{ margin: "0" }}>
                            <strong>Beschreibung:</strong> {item.description}
                          </p>
                          <p style={{ margin: "0" }}>
                            <strong>Menge:</strong> {item.quantity}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p>Keine Artikel in dieser Liste.</p>
                    )}
                  </ul>

                  {/* Optionen für die Liste */}
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => handleAddItemClick(list.id)}
                      style={{ color: "green" }}
                    >
                      Artikel hinzufügen
                    </button>
                    <button
                      onClick={() => handleDeleteItemClick(list.id)}
                      style={{ color: "orange" }}
                    >
                      Artikel entfernen
                    </button>
                    <button
                      onClick={() => handleDelete(list.id)}
                      style={{ color: "red" }}
                    >
                      Liste löschen
                    </button>
                    <button
                      onClick={() => handleEditClick(list)}
                      style={{ color: "blue" }}
                    >
                      Liste bearbeiten
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewAllShoppingLists;
