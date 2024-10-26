import {Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/core';
import { ShoppingList} from "./ShoppingList";
import { Item} from "./Item";
import { v4 } from 'uuid';

export enum ItemStatus {
    PENDING = 'pending',
    PURCHASED = 'purchased',
    CANCELLED = 'cancelled'
}

@Entity()
export class ShoppingListItem {
    @PrimaryKey()
    id: string = v4();

    @ManyToOne(() => ShoppingList)
    shoppingList!: ShoppingList;

    @ManyToOne(() => Item)
    item!: Item;

    @Property()
    nameOfItem! : string;

    @Property()
    description!: string;

    @Property()
    quantity!: number;

    @Property({ default: ItemStatus.PENDING })
    status: ItemStatus = ItemStatus.PENDING;
}