// services/itemService.ts
import {DI} from '../index';
import {Item} from '../entities/Item';
import {ItemSchema} from '../Services/Validtator';


export class ItemService {

    async createItem(data: { itemName: string, itemDescription: string, image: string }) {
        const em = DI.orm.em.fork();
        const validatedData = ItemSchema.parse(data);

        const existingItem = await em.findOne(Item, {itemName: validatedData.itemName});
        if (existingItem) {
            throw new Error(`Item with name ${validatedData.itemName} already exists`);
        }
        const newItem = new Item(validatedData.itemName, validatedData.itemDescription, validatedData.image || '');
        await em.persistAndFlush(newItem);
        console.log(`Item ${validatedData.itemName} created`);
        return newItem;
    }

    async deleteItem(itemName: string) {
        const em = DI.orm.em.fork();
        const item = await em.findOne(Item, {itemName});
        if (!item) throw new Error('Item not found');

        await em.removeAndFlush(item);
        console.log(`Item ${itemName} deleted`);
        return item;
    }

    async searchItemByName(itemName: string) {
        const em = DI.orm.em.fork();
        return em.find(Item, {itemName: {$like: `%${itemName}%`}});
    }

    async searchItemByDescription(description: string) {
        const em = DI.orm.em.fork();
        return em.find(Item, {itemDescription: {$like: `%${description}%`}});
    }

    async updateItemName(itemName: string, data: { itemName: string }) {
        const em = DI.orm.em.fork();
        const validatedData = ItemSchema.parse(data);

        const existingItem = await em.findOne(Item, {itemName});
        if (!existingItem) {
            throw new Error(`Item with name ${itemName} not found`);
        }
        existingItem.itemName = validatedData.itemName;
        existingItem.itemDescription = validatedData.itemDescription;
        await em.flush();
        return existingItem;
    }

    async toggleItemToFavorite(itemName: string) {
        const em = DI.orm.em.fork();
        const item = await em.findOne(Item, {itemName});
        if (!item) {
            throw new Error(`Item with name ${itemName} not found`);
        }
        item.isFavorite = !item.isFavorite;
        await em.flush();
        return item;
    }

    async getFavoriteItems() {
        const em = DI.orm.em.fork();
        return em.find(Item, {isFavorite: true});
    }


}




