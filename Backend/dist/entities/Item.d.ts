export declare class Item {
    itemId: string;
    itemName: string;
    itemDescription: string;
    image: string;
    itemCreatedAt: Date;
    itemUpdatedAt: Date;
    isFavorite: boolean;
    constructor(itemName: string, itemDescription: string, image: string);
}
