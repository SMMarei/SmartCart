import React, { useEffect, useState } from "react";
import { getFavouriteItems } from "../Services/ItemService";
import "../Style/AllFavoriteItems.css";
import { Item } from "../interface/Item.tsx";
import Navigation from "./Navigation.tsx";

export const AllFavouriteItems: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFavouriteItems();
        setFavoriteItems(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Favouriten werden geladen...</p>;
  if (favoriteItems.length === 0) {
    return <p>Es wurden keine Favouriten gefunden.</p>;
  }
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div>
      <Navigation />
      <div className="favorite-items-container">
        <h2>Ihre Favouritenartikel</h2>
        <ul className="favorite-items-list">
          {favoriteItems.map((item) => (
            <li key={item.itemId} className="favorite-item">
              <img
                src={item.image || "./src/assets/default.png"}
                alt={item.itemName}
                className="favorite-item-image"
              />
              <div className="favorite-item-details">
                <h3>{item.itemName}</h3>
                <p>{item.itemDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AllFavouriteItems;
