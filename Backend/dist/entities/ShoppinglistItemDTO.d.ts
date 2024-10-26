import { Shoppinglist } from "./Shoppinglist";
import { Item } from "./Item";
export declare enum ItemStatus {
    PENDING = "pending",
    PURCHASED = "purchased",
    CANCELLED = "cancelled"
}
export declare class ShoppinglistItemDTO {
    id: string;
    shoppingList: Shoppinglist;
    item: Item;
    nameOfItem: string;
    description: string;
    quantity: number;
    status: ItemStatus;
}
