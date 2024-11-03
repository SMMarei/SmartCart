import {ShoppingList} from '../entities/ShoppingList';
import {ShoppingListItemSchema, ShoppingListSchema} from '../Services/Validtator';
import {DI} from "../index";
import {ShoppingListItem} from "../entities/ShoppingListItem";
import {Item} from '../entities/Item';


export class ShoppingListService {

    async createShoppingList(data: { listName: string, listDescription: string }) {
        const em = DI.orm.em.fork();
        const validatedData = ShoppingListSchema.parse(data);

        const existingList = await em.findOne(ShoppingList, {listName: validatedData.listName});
        if (existingList) {
            throw new Error(`Shopping list with name ${validatedData.listName} already exists`);
        }
        const newList = new ShoppingList(validatedData.listName, validatedData.listDescription);
        await em.persistAndFlush(newList);
        return newList;
    }

    async updateNameShoppingList(listName: string, data: { listName: string }) {
        const em = DI.orm.em.fork();
        const validatedData = ShoppingListSchema.parse(data);

        const existingList = await em.findOne(ShoppingList, {listName});
        if (!existingList) {
            throw new Error(`Shopping list with name ${listName} not found`);
        }
        existingList.listName = validatedData.listName;
        existingList.listDescription = validatedData.listDescription;
        await em.flush();
        return existingList;

    }

    async deleteShoppingList(listName: string) {
        const em = DI.orm.em.fork();
        const list = await em.findOne(ShoppingList, {listName});
        if (!list) throw new Error('Shopping list not found');

        await em.removeAndFlush(list);
        console.log(`Shopping list ${listName} deleted`);
        return list;
    }

    async searchShoppingListByName(listName: string) {
        const em = DI.orm.em.fork();
        return em.find(ShoppingList, {listName: {$like: `%${listName}%`}}, {populate: ['items']});
    }

    async searchShoppingListByDescription(description: string) {
        const em = DI.orm.em.fork();
        return em.find(ShoppingList, {listDescription: {$like: `%${description}%`}}, {populate: ['items']});

    }


    async sortShoppingListsByLastUpdated(limit = 10) {
        const em = DI.orm.em.fork();
        return em.find(ShoppingList, {}, {orderBy: {listUpdatedAt: "desc"}, limit});
    }

    async findShoppingListsWithItem(itemName: string): Promise<ShoppingList[]> {
        const em = DI.orm.em.fork();

        // Finde das Item anhand des Namens
        const item = await em.findOne(Item, {itemName});
        if (!item) {
            throw new Error(`Item with name "${itemName}" not found`);
        }

        // Finde die ShoppingListItems, die dieses Item enthalten und lade die zugehörigen Einkaufslisten
        const shoppingListItems = await em.find(ShoppingListItem, {item}, {populate: ['shoppingList']});

        // Extrahiere die Einkaufslisten aus den Listeneinträgen
        const shoppingLists = shoppingListItems.map(listItem => listItem.shoppingList);

        return shoppingLists;
    }

    async addItemsToShoppingList(listName: string, data: {
        nameOfItem: string;
        description: string;
        quantity: number
    }) {
        const em = DI.orm.em.fork();

        // Validiere die Eingabedaten ohne `listName`, da dieser aus den Parametern kommt
        const validatedData = ShoppingListItemSchema.omit({
            listName: true,
            item: true
        }).parse(data);

        // Suche die Einkaufsliste anhand des `listName`
        const list = await em.findOne(ShoppingList, {listName}, {populate: ['items']});
        if (!list) {
            throw new Error('Shopping list not found');
        }

        // Erstelle oder finde das Item anhand von `nameOfItem` und `description`
        const validatedItemData = {
            itemName: validatedData.nameOfItem,
            itemDescription: validatedData.description,
        };

        let item = await em.findOne(Item, {itemName: validatedItemData.itemName});
        if (!item) {
            item = new Item(validatedItemData.itemName, validatedItemData.itemDescription || '', '');
            await em.persistAndFlush(item); // Speichere das neue Item
        }

        // Prüfe, ob das Item bereits in der Einkaufsliste existiert
        const existingItemInList = await em.findOne(ShoppingListItem, {
            shoppingList: list,
            item,
        });

        if (existingItemInList) {
            throw new Error('Item already exists in the shopping list');
        }

        // Füge das Item zur Einkaufsliste hinzu
        const listItem = new ShoppingListItem();
        listItem.shoppingList = list;
        listItem.item = item;
        listItem.nameOfItem = validatedData.nameOfItem;
        listItem.description = validatedData.description;
        listItem.quantity = validatedData.quantity || 1;

        // Speichere den neuen Eintrag in der Liste
        await em.persistAndFlush(listItem);

        return listItem;
    }

// ShoppingListService.ts
    async deleteItemFromShoppingList(listName: string, itemName: string) {
        const em = DI.orm.em.fork();

        // Suche die Einkaufsliste
        const list = await em.findOne(ShoppingList, { listName }, { populate: ['items'] });
        if (!list) {
            throw new Error('Shopping list not found');
        }

        // Suche das Item
        const item = await em.findOne(Item, { itemName });
        if (!item) {
            throw new Error('Item not found');
        }

        // Suche das Item in der Einkaufsliste
        const listItem = await em.findOne(ShoppingListItem, {
            shoppingList: list,
            item
        });
        if (!listItem) {
            throw new Error('Item not found in the shopping list');
        }

        // Entferne das Item aus der Einkaufsliste
        await em.removeAndFlush(listItem);
        return { message: 'Item removed from the shopping list successfully' };
    }

}
