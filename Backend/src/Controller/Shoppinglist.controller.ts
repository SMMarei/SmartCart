import { Request, Response, Router } from 'express';
import { DI } from '../index';
import { ShoppingList } from '../entities/ShoppingList';
import { Item } from '../entities/Item';
import { ShoppingListItem } from '../entities/ShoppingListItem';

const router = Router({ mergeParams: true });

// Display all shopping lists, including linked items
router.get('/GetAllShoppingList', async (req: Request, res: Response) => {
    try {
        const em = DI.orm.em.fork();
        const lists = await em.find(ShoppingList, {}, { populate: ['items'] }); // 'items' represents the relation
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching shopping lists:', error);
        res.status(500).json({ error: 'An error occurred while fetching the shopping lists' });
    }
});

// Create a new shopping list
router.post('/CreateShoppingList', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    const existingShoppingList = await em.findOne(ShoppingList, { listName: req.body.listName });

    if (!req.body.listName) {
        return res.status(400).json({ error: 'Name is required to create a shopping list.' });
    }

    if (existingShoppingList) {
        return res.status(400).json({ error: `Shopping list with name ${req.body.listName} already exists` });
    }
    try {
        const newList = new ShoppingList(req.body.listName, req.body.listDescription);
        em.persist(newList);
        await em.flush();
        return res.status(201).json(newList);
    } catch (error) {
        console.error('Error creating shopping list:', error);
        return res.status(500).json({ error: 'An error occurred while creating the shopping list' });
    }
});

// Delete a shopping list
router.delete('/DeleteShoppingList/:listName', async (req: Request, res: any) => {
    try {
        const em = DI.orm.em.fork();  // Fork the EntityManager to work in isolation
        const shoppingList = await em.findOne(ShoppingList, { listName: req.params.listName });
        if (!shoppingList) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }
        // If shoppingList is not null, proceed to remove and flush it
        await em.removeAndFlush(shoppingList);
        return res.status(200).json(shoppingList);  // Return the deleted shopping list
    } catch (error) {
        console.error('Error deleting shopping list:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the list' });
    }
});

// Route to search for shopping lists by name
router.get('/SearchShoppingListByName/:listName', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    const listName = req.params.listName;

    if (!listName) {
        return res.status(400).json({ error: 'Search query for name is required' });
    }

    try {
        // Search for lists containing the name
        const lists = await em.find(ShoppingList, {
            listName: { $like: `%${listName}%` }
        }, { populate: ['items'] });  // Populate to also load the items

        if (lists.length === 0) {
            return res.status(404).json({ error: `No shopping lists found with name ${listName}` });
        }

        return res.status(200).json(lists);
    } catch (error) {
        console.error('Error searching shopping list by name:', error);
        return res.status(500).json({ error: 'An error occurred while searching by name' });
    }
});

// Route to search for shopping lists by description
router.get('/SearchShoppingListByDescription/:listDescription', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    const listDescription = req.params.listDescription;

    if (!listDescription) {
        return res.status(400).json({ error: 'Search query for description is required' });
    }

    try {
        // Search for lists containing the description
        const lists = await em.find(ShoppingList, {
            listDescription: { $like: `%${listDescription}%` }
        }, { populate: ['items'] });

        if (lists.length === 0) {
            return res.status(404).json({ message: `No shopping lists found with description ${listDescription}` });
        }

        return res.status(200).json(lists);
    } catch (error) {
        console.error('Error searching shopping list by description:', error);
        return res.status(500).json({ error: 'An error occurred while searching by description' });
    }
});

// Return shopping lists with a specific item
router.get('/GetShoppingListWithItem/:itemName', async (req: Request, res: any) => {
    try {
        // Find the item by name
        const itemName = req.params.itemName;
        const item = await DI.em.findOne(Item, { itemName: itemName });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Find all ShoppinglistItemDTOs containing this item
        const shoppingListItems = await DI.em.find(ShoppingListItem, { item }, { populate: ['shoppingList'] });

        // Extract the shopping lists from the found ShoppinglistItemDTOs
        const shoppingLists = shoppingListItems.map(listItem => listItem.shoppingList);

        if (shoppingLists.length === 0) {
            return res.status(404).json({ message: `No shopping lists found containing ${itemName}` });
        }

        return res.status(200).json(shoppingLists);
    } catch (error) {
        console.error('Error fetching shopping lists with item:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the lists' });
    }
});


// Add item to ShoppingList
router.put('/addItemToShoppingList/:listName', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    const listName = req.params.listName;  // Shopping list name from URL
    const { itemName, description, image, quantity, status } = req.body;  // Item details from request body

    try {
        // Find shopping list by name
        const list = await em.findOne(ShoppingList, { listName: listName }, { populate: ['items'] });
        if (!list) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }

        // Check if the item already exists
        let item = await em.findOne(Item, { itemName });
        if (!item) {
            // If item does not exist, create a new one
            item = new Item(itemName, description || 'No description', image || '');
            await em.persistAndFlush(item);  // Save the new item
        }

        // Check if the item is already in the shopping list
        const existingItemInList = await em.findOne(ShoppingListItem, {
            shoppingList: list,
            item: item,
        });

        if (existingItemInList) {
            // If the item is already in the shopping list, return an error message
            return res.status(400).json({ message: 'Item already exists in the shopping list' });
        }

        // Add item to the shopping list
        const listItem = new ShoppingListItem();
        listItem.shoppingList = list;
        listItem.item = item;
        listItem.nameOfItem = itemName;
        listItem.description = description;
        listItem.quantity = quantity || 1;  // If no quantity is specified, set to 1
        listItem.status = status ?? false;  // Default status is 'not purchased' (false)

        // Save the new entry in the list
        await em.persistAndFlush(listItem);

        return res.status(201).json(listItem);  // Successful response with newly added item
    } catch (error) {
        console.error('Error adding item to shopping list:', error);
        return res.status(500).json({ error: 'An error occurred while adding the item' });
    }
});

// Delete item from ShoppingList
router.delete('/deleteItemFromShoppingList/:listName/:itemName', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    const listName = req.params.listName;  // Name of shopping list and item from parameters
    const itemName = req.params.itemName;
    try {
        // Find shopping list by name
        const list = await em.findOne(ShoppingList, { listName: listName }, { populate: ['items'] });
        if (!list) {
            return res.status(404).json({ message: 'Shopping list not found' });
        }

        // Check if item exists
        const item = await em.findOne(Item, { itemName: itemName });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if item exists in the shopping list
        const listItem = await em.findOne(ShoppingListItem, {
            shoppingList: list,
            item: item
        });

        if (!listItem) {
            return res.status(404).json({ message: 'Item not found in the shopping list' });
        }

        // Remove item from the shopping list
        await em.removeAndFlush(listItem);  // Delete entry in ShoppingListItem

        return res.status(200).json({ message: 'Item removed from the shopping list successfully' });
    } catch (error) {
        console.error('Error deleting item from shopping list:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the item from the shopping list' });
    }
});


// Freestyle #1: Sort shopping lists by last updated
router.get('/SortLastUpdatedShoppingList', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    try {
        const shoppingLists = await em.find(ShoppingList, {}, { orderBy: { listUpdatedAt: "desc" }, limit: 10 });
        return res.status(200).json(shoppingLists);
    } catch (error) {
        console.error('Error fetching last updated lists:', error);
        return res.status(500).json({ error: 'An error occurred while fetching last updated lists' });
    }
});
export const ShoppingListController = router;
