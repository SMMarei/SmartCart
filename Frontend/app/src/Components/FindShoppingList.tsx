import { useState } from "react";
import { ShoppingList } from "../interface/ShoppingList.tsx";
import { ShoppingListItem } from "../interface/ShoppingListItem.tsx";
import Navigation from "./Navigation.tsx";

export const FindShoppingList = () => {
  const [searchType, setSearchType] = useState<"nameOrDescription" | "item">(
    "nameOrDescription",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [results, setResults] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (searchType === "nameOrDescription") {
        // Suche nach Listenname oder Beschreibung
        response = await fetch(
          `http://localhost:4000/ShoppingLists/ShoppingList/search?query=${encodeURIComponent(
            searchQuery,
          )}`,
        );
      } else {
        // Suche nach Artikelname
        response = await fetch(
          `http://localhost:4000/ShoppingLists/ShoppingListWithItem/${encodeURIComponent(
            searchQuery,
          )}`,
        );
      }
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        throw new Error("Keine Einkaufsliste gefunden");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unbekannter Fehler");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation />
      <h2>Finde Einkaufslisten</h2>
      <div>
        <label>
          <input
            type="radio"
            value="nameOrDescription"
            checked={searchType === "nameOrDescription"}
            onChange={() => setSearchType("nameOrDescription")}
          />
          Nach Namen oder Beschreibung suchen
        </label>{" "}
        &nbsp;
        <label>
          <input
            type="radio"
            value="item"
            checked={searchType === "item"}
            onChange={() => setSearchType("item")}
          />
          Nach Artikelname suchen
        </label>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={
          searchType === "nameOrDescription"
            ? "Listenname oder Beschreibung eingeben"
            : "Artikelname eingeben"
        }
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Suchen
      </button>

      {loading && <p>Daten werden geladen...</p>}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}
      {results.length > 0 && (
        <div>
          <h3>Suchergebnisse:</h3>
          <ul style={{ listStyle: "none", padding: "0" }}>
            {results.map((list) => (
              <li
                key={list.id}
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h4>Listenname: {list.listName}</h4>
                <p>Beschreibung: {list.listDescription}</p>
                <h5>Artikel:</h5>
                <ul>
                  {list.items &&
                  Array.isArray(list.items) &&
                  list.items.length > 0 ? (
                    list.items.map((item: ShoppingListItem) => (
                      <li key={item.id}>{item.nameOfItem}</li>
                    ))
                  ) : searchType !== "item" ? (
                    <p>Keine Artikel in dieser Liste</p>
                  ) : null}
                </ul>
              </li>
            ))}
            {results.length === 0 && !loading && !error && (
              <p>Keine Listen gefunden</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
export default FindShoppingList;
