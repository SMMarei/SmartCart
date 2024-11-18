import { ShoppingList } from "./ShoppingList";
import { Item, ItemStatus } from "./Item";

export interface ShoppingListItem {
  id: string;
  shoppingList: ShoppingList;
  item: Item;
  nameOfItem: string;
  description: string;
  quantity: number;
  status: ItemStatus;
}
