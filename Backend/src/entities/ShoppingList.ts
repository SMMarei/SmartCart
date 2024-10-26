import {Entity, PrimaryKey, Property, OneToMany, Collection, Unique} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { ShoppingListItem } from './ShoppingListItem'; // Die Beziehungstabelle

@Entity()
export class ShoppingList {
    @PrimaryKey()
    id: string = v4();
    @Unique()
    @Property()
    listName!: string;

    @Property()
    listDescription!: string;

    @Property()
    listCreatedAt = new Date();

    @Property({ onUpdate: () => new Date() })
    listUpdatedAt = new Date();

    // Eine Einkaufsliste kann 0 oder N Artikel haben
    @OneToMany(() => ShoppingListItem, item => item.shoppingList)
    items = new Collection<ShoppingListItem>(this);

    constructor(listName: string, listDescription: string) {
        this.listName = listName;
        this.listDescription = listDescription;
    }
}
