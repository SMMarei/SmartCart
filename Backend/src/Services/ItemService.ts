import { DI } from "../index";
import { Item } from "../entities/Item";
import { ItemSchema } from "./Validtator";
import { ShoppingList } from "../entities/ShoppingList";
import { ShoppingListItem } from "../entities/ShoppingListItem";

export class ItemService {
  async createItem(data: {
    itemName: string;
    itemDescription: string;
    image: string;
  }) {
    const em = DI.orm.em.fork();
    const validatedData = ItemSchema.parse(data);

    const existingItem = await em.findOne(Item, {
      itemName: validatedData.itemName,
    });
    if (existingItem) {
      throw new Error(
        `Item with name ${validatedData.itemName} already exists`,
      );
    }
    const newItem = new Item(
      validatedData.itemName,
      validatedData.itemDescription,
      validatedData.image || "",
    );
    await em.persistAndFlush(newItem);
    console.log(`Item ${validatedData.itemName} created`);
    return newItem;
  }

  async deleteItem(itemId: string) {
    const em = DI.orm.em.fork();
    const item = await em.findOne(Item, { itemId });
    if (!item) throw new Error("Item not found");

    const itemShoppingList = await em.findOne(ShoppingListItem, { item: item });
    if (itemShoppingList?.item.itemId === itemId) {
      console.log(
        `Item with ID:  ${itemId}  and with name ${item.itemName} is associated with a shopping list`,
      );
      {
        throw new Error(
          "Item cannot be deleted as it is associated with a shopping list",
        );
      }
    }

    await em.removeAndFlush(item);
    console.log(`Item ${itemId} deleted`);
    return item;
  }

  async updateItemName(itemId: string, data: { itemId: string }) {
    const em = DI.orm.em.fork();
    const validatedData = ItemSchema.parse(data);

    const existingItem = await em.findOne(Item, { itemId });
    if (!existingItem) {
      throw new Error(`Item with id ${itemId} not found`);
    }
    existingItem.itemName = validatedData.itemName;
    existingItem.itemDescription = validatedData.itemDescription;
    await em.flush();
    return existingItem;
  }

  async toggleItemToFavorite(itemId: string) {
    const em = DI.orm.em.fork();
    const item = await em.findOne(Item, { itemId });
    if (!item) {
      throw new Error(`Item with Id ${itemId} not found`);
    }
    item.isFavorite = !item.isFavorite;
    await em.flush();
    return item;
  }

  async addItemToShoppingList(itemId: string, shoppingListId: string) {
    const em = DI.orm.em.fork();
    const item = await em.findOne(Item, { itemId });
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }

    const shoppingList = await em.findOne(ShoppingList, { id: shoppingListId });
    if (!shoppingList) {
      throw new Error(`Shopping list with id ${shoppingListId} not found`);
    }

    const itemQuantity = 1;
    const itemShoppingList = new ShoppingListItem();
    itemShoppingList.item = item;
    itemShoppingList.shoppingList = shoppingList;
    itemShoppingList.quantity = itemQuantity;

    itemShoppingList.nameOfItem = item.itemName;
    itemShoppingList.description = item.itemDescription;

    shoppingList.items.add(itemShoppingList);
    await em.flush();
    return itemShoppingList;
  }

  async getAllFavoriteItems() {
    const em = DI.orm.em.fork();
    try {
      console.log("Fetching favorite items from database..."); //   output for debugging
      return await em.find(Item, { isFavorite: true });
    } catch (error) {
      console.error("Error fetching items from database:", error); //  error output for debugging
      throw error;
    }
  }
}
