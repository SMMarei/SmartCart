import { ShoppingListItem } from "./ShoppingListItem";

export interface ShoppingList {
  id: string;
  listName: string;
  listDescription: string;
  listCreatedAt: Date;
  listUpdatedAt: Date;
  items: ShoppingListItem[];
}
