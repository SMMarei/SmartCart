import {Entity, PrimaryKey, Property, Unique} from '@mikro-orm/core';
import { v4 } from 'uuid';


@Entity()
export class Item {
    @PrimaryKey()
    itemId: string = v4();

    @Unique()
    @Property()
    itemName!: string;

    @Property()
    itemDescription!: string;

    @Property()
    image!: string;

    @Property()
    itemCreatedAt = new Date();

    @Property({ onUpdate: () => new Date() })
    itemUpdatedAt = new Date();

    @Property({ default: false })
    isFavorite!: boolean;

    constructor(itemName:string, itemDescription: string, image: string){
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.image = image;
    }

}