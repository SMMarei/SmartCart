import { ShoppingList } from "./ShoppingList";
import { Item } from "./Item";
export declare enum ItemStatus {
    PENDING = "pending",
    PURCHASED = "purchased",
    CANCELLED = "cancelled"
}
export declare class ShoppingListItem {
    id: string;
    shoppingList: ShoppingList;
    item: Item;
    nameOfItem: string;
    description: string;
    quantity: number;
    status: ItemStatus;
}
