import { Collection } from '@mikro-orm/core';
import { ShoppingListItem } from './ShoppingListItem';
export declare class ShoppingList {
    id: string;
    listName: string;
    listDescription: string;
    listCreatedAt: Date;
    listUpdatedAt: Date;
    items: Collection<ShoppingListItem, object>;
    constructor(listName: string, listDescription: string);
}
