// shoppingListService.ts

export const getAllShoppingLists = async () => {
    const response = await fetch("http://localhost:4000/ShoppingLists/AllShoppingList");
    if (!response.ok) {
        throw new Error("Fehler beim Laden der Listen");
    }
    return response.json();
}

export const createShoppingList = async (listName: string, listDescription: string) => {
    const response = await fetch("http://localhost:4000/ShoppingLists/NewShoppingList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            listName,
            listDescription,
        }),
    });
    if (!response.ok) {
        throw new Error("Fehler beim Erstellen der Liste");
    }
    return response.json();
}

export const deleteShoppingList = async (id: string) => {
    const response = await fetch(`http://localhost:4000/ShoppingLists/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        // Hole die Fehlermeldung vom Backend
        const errorMessage = await response.json().catch(() => ({message: "Unbekannter Fehler"}));
        throw new Error(errorMessage.message || "Fehler beim Löschen der Liste");
    }
    return response.json();
};

export const EditShoppingList = async (id: string,
                                       data: { listName: string, listDescription: string }) => {
    const response = await fetch(`http://localhost:4000/ShoppingLists/ShoppingList/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Fehler beim Bearbeiten der Liste");
    }
    return response.json();
}

export const addItemToShoppingList = async (
    shoppingListId: string,
    itemData: { nameOfItem: string; description: string; quantity: number },
) => {
    const response = await fetch(
        `http://localhost:4000/ShoppingLists/NewItemToShoppingList/${shoppingListId}`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(itemData),
        },
    );
    if (!response.ok) {
        throw new Error(
            "Fehler beim Hinzufügen des Artikels zur Einkaufsliste.",
        );
    }
    return response.json();
};

export const deleteItemFromShoppingList = async (listId: string, itemName: string) => {
    const response = await fetch(
        `http://localhost:4000/ShoppingLists/ItemFromShoppingList/${listId}/${itemName}`, // listId verwenden
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    console.log("Deleting item with name:", itemName);

    if (!response.ok) {
        throw new Error("Failed to delete the item from the shopping list");
    }

    return response.json();
};

// ViewAllShoppingLists.tsx