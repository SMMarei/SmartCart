import { ShoppingList } from "../entities/ShoppingList";
import {
  ShoppingListItemSchema,
  ShoppingListSchema,
} from "../Services/Validtator";
import { DI } from "../index";
import { ShoppingListItem } from "../entities/ShoppingListItem";
import { Item } from "../entities/Item";

export class ShoppingListService {
  async createShoppingList(data: {
    listName: string;
    listDescription: string;
  }) {
    const em = DI.orm.em.fork();
    const validatedData = ShoppingListSchema.parse(data);

    const existingList = await em.findOne(ShoppingList, {
      listName: validatedData.listName,
    });
    if (existingList) {
      throw new Error(
        `Shopping list with name ${validatedData.listName} already exists`,
      );
    }
    const newList = new ShoppingList(
      validatedData.listName,
      validatedData.listDescription,
    );
    await em.persistAndFlush(newList);
    return newList;
  }

  async updateNameShoppingList(
    id: string,
    data: { listName: string; listDescription: string },
  ) {
    const em = DI.orm.em.fork();
    const validatedData = ShoppingListSchema.parse(data);

    const existingList = await em.findOne(ShoppingList, { id });
    if (!existingList) {
      throw new Error(`Shopping list with id ${id} not found`);
    }
    existingList.listName = validatedData.listName;
    existingList.listDescription = validatedData.listDescription;
    await em.flush();
    return existingList;
  }

  async deleteShoppingList(id: string) {
    const em = DI.orm.em.fork();
    const list = await em.findOne(
      ShoppingList,
      { id },
      { populate: ["items"] },
    );
    if (!list) throw new Error("Shopping list not found");

    // Überprüfen, ob die Liste Artikel enthält
    if (list.items.length > 0) {
      throw new Error(
        "Shopping list contains items. Please remove the items before deleting the list",
      );
    }
    await em.removeAndFlush(list);
    console.log(`Shopping list ${id} deleted`);
    return list;
  }

  async searchShoppingLists(query: string): Promise<ShoppingList[]> {
    const em = DI.orm.em.fork(); // Neuer Entity Manager
    return em.find(
      ShoppingList,
      {
        $or: [
          { listName: { $like: `%${query}%` } }, // Suche nach Listenname
          { listDescription: { $like: `%${query}%` } }, // Oder Suche nach Beschreibung
        ],
      },
      { populate: ["items"] }, // Lade verbundene Items
    );
  }

  async sortShoppingListsByLastUpdated() {
    const em = DI.orm.em.fork();
    return em.find(
      ShoppingList,
      {},
      {
        populate: ["items", "items.item"], // Lade die Artikel und deren Details mit
        orderBy: { listUpdatedAt: "desc" }, // Nach Aktualisierungsdatum sortieren
      },
    );
  }

  async findShoppingListsWithItem(itemName: string): Promise<ShoppingList[]> {
    const em = DI.orm.em.fork();

    // Finde das Item anhand des Namens
    const item = await em.findOne(Item, { itemName });
    if (!item) {
      throw new Error(`Item with name "${itemName}" not found`);
    }

    // Finde die ShoppingListItems, die dieses Item enthalten und lade die zugehörigen Einkaufslisten
    const shoppingListItems = await em.find(
      ShoppingListItem,
      { item }, // Filter nach dem gefundenen Item
      { populate: ["shoppingList"] }, // Populiere die zugehörige Einkaufslisten
    );

    // Prüfen, ob Ergebnisse vorhanden sind
    if (!shoppingListItems || shoppingListItems.length === 0) {
      console.log("Item not found in Shoppinglist"); // Gib ein leeres Array zurück, wenn keine Listen gefunden wurden
    }

    // Extrahiere die Einkaufslisten aus den Listeneinträgen und filtere mögliche `undefined`-Werte
    // Entferne `undefined`
    return shoppingListItems
      .map((listItem) => listItem.shoppingList)
      .filter((list): list is ShoppingList => !!list);
  }

  async addItemsToShoppingList(
    listId: string,
    data: {
      nameOfItem: string;
      description: string;
      quantity: number;
    },
  ) {
    const em = DI.orm.em.fork();

    // Validiere die Eingabedaten
    const validatedData = ShoppingListItemSchema.omit({
      listName: true,
      item: true,
    }).parse(data);

    // Suche die Einkaufsliste anhand des `listId`
    const list = await em.findOne(
      ShoppingList,
      { id: listId },
      { populate: ["items"] },
    );
    if (!list) {
      throw new Error("Shopping list not found");
    }

    // Erstelle oder finde das Item anhand von `nameOfItem` und `description`
    const validatedItemData = {
      itemName: validatedData.nameOfItem,
      itemDescription: validatedData.description,
    };

    let item = await em.findOne(Item, { itemName: validatedItemData.itemName });
    if (!item) {
      item = new Item(
        validatedItemData.itemName,
        validatedItemData.itemDescription || "",
        "",
      );
      await em.persistAndFlush(item); // Speichere das neue Item
    }

    // Prüfe, ob das Item bereits in der Einkaufsliste existiert
    let existingItemInList = await em.findOne(ShoppingListItem, {
      shoppingList: list,
      item,
    });

    if (existingItemInList) {
      // Wenn das Item bereits existiert, Menge erhöhen
      existingItemInList.quantity += validatedData.quantity || 1;
      await em.flush();
      return existingItemInList;
    }

    // Neues Item zur Einkaufsliste hinzufügen
    const listItem = new ShoppingListItem();
    listItem.shoppingList = list;
    listItem.item = item;
    listItem.nameOfItem = validatedData.nameOfItem;
    listItem.description = validatedData.description;
    listItem.quantity = validatedData.quantity || 1;

    // Speichere den neuen Eintrag in der Liste
    await em.persistAndFlush(listItem);

    return listItem;
  }

  async deleteItemFromShoppingList(listId: string, itemName: string) {
    const em = DI.orm.em.fork();

    // Suche nach dem Item anhand des Namens
    const item = await em.findOne(Item, { itemName });
    if (!item) {
      throw new Error(`Item with name "${itemName}" not found`);
    }

    // Suche nach der Einkaufsliste anhand der ID
    const shoppingList = await em.findOne(ShoppingList, { id: listId });
    if (!shoppingList) {
      throw new Error(`Shopping list with id "${listId}" not found`);
    }

    // Suche nach der Verbindung zwischen dem Item und der Einkaufsliste
    const listItem = await em.findOne(ShoppingListItem, { shoppingList, item });
    if (!listItem) {
      throw new Error(
        `Item with name "${itemName}" not found in shopping list with id "${listId}"`,
      );
    }

    // Entferne das Item aus der Einkaufsliste
    await em.removeAndFlush(listItem);

    // Rückgabe einer Bestätigung, dass das Item entfernt wurde
    return {
      message: `Item "${itemName}" has been removed from shopping list with id "${listId}"`,
    };
  }

  async getItemsFromShoppingList(listId: string) {
    const em = DI.orm.em.fork();

    // Jetzt wird nach listId anstatt listName gesucht
    const list = await em.findOne(
      ShoppingList,
      { id: listId },
      { populate: ["items"] },
    );
    if (!list) {
      return { message: "Shopping list not found" };
    }
    return list.items;
  }
}
