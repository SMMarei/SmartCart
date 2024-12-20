export const getItems = async () => {
  const response = await fetch("http://localhost:4000/Items/AllItems", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Error fetching items");
  }

  return await response.json();
};

export const addItem = async (
  itemName: string,
  itemDescription: string,
  image: string,
) => {
  const response = await fetch(`http://localhost:4000/Items/NewItem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemName,
      itemDescription,
      image,
    }),
  });

  if (!response.ok) {
    throw new Error("Error adding item");
  }

  return await response.json();
};

export const deleteItem = async (itemId: string) => {
  const response = await fetch(`http://localhost:4000/Items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unbekannter Fehler" }));
    throw new Error(errorData.error || "Fehler beim Löschen des Artikels");
  }

  return itemId; // backend returns the ID of the deleted item
};

export const editItemName = async (
  itemId: string,
  data: { itemName: string; itemDescription: string },
) => {
  const response = await fetch(`http://localhost:4000/Items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Fehler beim Bearbeiten der Artikel");
  }
  return response.json();
};

export const addItemToShoppingList = async (
  itemId: string,
  shoppingListId: string,
) => {
  const response = await fetch(`http://localhost:4000/Items/${itemId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shoppingListId }), // pass the shopping list ID from the frontend
  });

  if (!response.ok) {
    throw new Error("Fehler beim Hinzufügen des Artikels zur Einkaufsliste");
  }

  return await response.json();
};

// Freestyle 1
export const toggleFavorite = async (itemId: string) => {
  try {
    const response = await fetch(
      `http://localhost:4000/Items/Favorite/${itemId}`,
      {
        method: "PUT",
      },
    );

    if (!response.ok) {
      throw new Error("Fehler beim Markieren des Artikels als Favorit");
    }

    return await response.json(); // Rückgabe des aktualisierten Artikels
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unbekannter Fehler",
    );
  }
};

// Freestyle 1
export const getFavouriteItems = async () => {
  try {
    const response = await fetch(
      "http://localhost:4000/Items/AllFavouriteItems",
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Favoriten");
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Unbekannter Fehler",
    );
  }
};
