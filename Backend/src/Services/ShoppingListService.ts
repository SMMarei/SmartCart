import { ShoppingList } from "../entities/ShoppingList";
import { DI } from "../index";
import { ShoppingListItem } from "../entities/ShoppingListItem";
import { Item } from "../entities/Item";
import { ShoppingListItemSchema, ShoppingListSchema } from "./Validtator";

export class ShoppingListService {
  async createShoppingList(data: {
    listName: string;
    listDescription: string;
  }) {
    const em = DI.orm.em.fork();
    const validatedData = ShoppingListSchema.parse(data);

    // Check if a shopping list with the same name already exists
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

    // Check if the shopping list exists
    const existingList = await em.findOne(ShoppingList, { id });
    if (!existingList) {
      throw new Error(`Shopping list with id ${id} not found`);
    }

    // Update the shopping list's name and description
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

    // Check if the list contains items and prevent deletion if it does
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
    const em = DI.orm.em.fork();

    return em.find(
      ShoppingList,
      {
        $or: [
          { listName: { $like: `%${query}%` } },
          { listDescription: { $like: `%${query}%` } },
        ],
      },
      { populate: ["items"] },
    );
  }

  async sortShoppingListsByLastUpdated() {
    const em = DI.orm.em.fork();

    // Retrieve and sort shopping lists by their last updated timestamp
    return em.find(
      ShoppingList,
      {},
      {
        populate: ["items", "items.item"], // Load the items and their details
        orderBy: { listUpdatedAt: "desc" }, // Sort by last updated date
      },
    );
  }

  async findShoppingListsWithItem(itemName: string): Promise<ShoppingList[]> {
    const em = DI.orm.em.fork();

    const item = await em.findOne(Item, { itemName });
    if (!item) {
      throw new Error(`Item with name "${itemName}" not found`);
    }

    // Find shopping list items that contain this item and load the related shopping lists
    const shoppingListItems = await em.find(
      ShoppingListItem,
      { item },
      { populate: ["shoppingList"] },
    );

    // Check if results are available
    if (!shoppingListItems || shoppingListItems.length === 0) {
      console.log("Item not found in Shoppinglist");
    }

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

    const validatedData = ShoppingListItemSchema.omit({
      listName: true,
      item: true,
    }).parse(data);

    const list = await em.findOne(
      ShoppingList,
      { id: listId },
      { populate: ["items"] },
    );
    if (!list) {
      throw new Error("Shopping list not found");
    }

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
      await em.persistAndFlush(item);
    }
    // Check if the item already exists in the shopping list
    let existingItemInList = await em.findOne(ShoppingListItem, {
      shoppingList: list,
      item,
    });

    if (existingItemInList) {
      // If the item exists, increase its quantity
      existingItemInList.quantity += validatedData.quantity || 1;
      await em.flush();
      return existingItemInList;
    }

    // Add a new item to the shopping list
    const listItem = new ShoppingListItem();
    listItem.shoppingList = list;
    listItem.item = item;
    listItem.nameOfItem = validatedData.nameOfItem;
    listItem.description = validatedData.description;
    listItem.quantity = validatedData.quantity || 1;

    // Save the new list item
    await em.persistAndFlush(listItem);

    return listItem;
  }

  async deleteItemFromShoppingList(listId: string, itemName: string) {
    const em = DI.orm.em.fork();

    const item = await em.findOne(Item, { itemName });
    if (!item) {
      throw new Error(`Item with name "${itemName}" not found`);
    }

    const shoppingList = await em.findOne(ShoppingList, { id: listId });
    if (!shoppingList) {
      throw new Error(`Shopping list with id "${listId}" not found`);
    }

    const listItem = await em.findOne(ShoppingListItem, { shoppingList, item });
    if (!listItem) {
      throw new Error(
        `Item with name "${itemName}" not found in shopping list with id "${listId}"`,
      );
    }

    await em.removeAndFlush(listItem);

    return {
      message: `Item "${itemName}" has been removed from shopping list with id "${listId}"`,
    };
  }

  async getItemsFromShoppingList(listId: string) {
    const em = DI.orm.em.fork();

    // Now searching by listId instead of listName
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
