import { Request, Response, Router } from 'express';
import { DI } from '../index';
import { Item } from '../entities/Item';
import { ShoppingList } from '../entities/ShoppingList';
import { ShoppingListItem } from '../entities/ShoppingListItem';

const router = Router();

// Display all items
router.get('/GetAllItems', async (req: Request, res: Response) => {
    try {
        const em = DI.orm.em.fork();
        const items = await em.find(Item, {}); // 'items' is the relation
        res.status(200).json(items);
    } catch (error) {
        console.error('Error fetching Items:', error);
        res.status(500).json({ error: 'An error occurred while fetching the items' });
    }
});

// Create a new item
router.post('/CreateItem', async (req: Request, res:any) => {
    const em = DI.orm.em.fork();
    const existingItem = await em.findOne(Item, { itemName: req.body.itemName });

    if (!req.body.itemName) {
        return res.status(400).json({ error: 'Name is required to create an item.' });
    }

    if(existingItem){
        return res.status(400).json({error: `Item with name ${req.body.itemName} already exists`});
    }
    try {
        const newItem = new Item(req.body.itemName, req.body.itemDescription, req.body.image);
        em.persist(newItem);
        await em.flush();
        return res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({ error: 'An error occurred while creating the item' });
    }
});

// Delete an item
router.delete('/DeleteItem/:itemName', async (req: Request, res: any) => {
    try {
        const em = DI.orm.em.fork();  // Fork the EntityManager to work in isolation
        const item = await em.findOne(Item, { itemName: req.params.itemName });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        // If item is not null, proceed to remove and flush it
        await em.removeAndFlush(item);
        return res.status(200).json(item);  // Return the deleted item
    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the item' });
    }
});

// Route to search items by name
router.get('/SearchItemByName/:itemName', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();  // Fork the EntityManager
    const { itemName } = req.params;  // Extract item name from parameters

    if (!itemName) {
        return res.status(400).json({ error: 'Search query for item name is required' });
    }

    try {
        // Search for items containing the name
        const items = await em.find(Item, {
            itemName: { $like: `%${itemName}%` }
        });

        if (items.length === 0) {
            return res.status(404).json({ error: `No item found with name ${itemName}` });
        }

        return res.status(200).json(items);  // Successful response with found items
    } catch (error) {
        console.error('Error searching item by name:', error);
        return res.status(500).json({ error: 'An error occurred while searching by item name' });
    }
});

// Route to search items by description
router.get('/SearchItemByDescription/:itemDescription', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();  // Fork the EntityManager
    const itemDescription = req.params.itemDescription;

    if (!itemDescription) {
        return res.status(400).json({ error: 'Search query for item description is required' });
    }

    try {
        const items = await em.find(Item, {
            itemDescription: { $like: `%${itemDescription}%` }
        });

        if (items.length === 0) {
            return res.status(404).json({ error: `No item found with description ${itemDescription}` });
        }

        return res.status(200).json(items);  // Successful response with found items
    } catch (error) {
        console.error('Error searching item by description:', error);
        return res.status(500).json({ error: 'An error occurred while searching by item description' });
    }
});

// Update item name
router.put('/ChangeItemName/:itemName', async (req: Request, res: any) => {
    const em = DI.orm.em.fork(); // Forked EntityManager for isolated work
    const existingItem = await em.findOne(Item, {
        itemName: req.params.itemName
    });

    if (!existingItem) {
        return res.status(404).json({ message: `Item with name ${req.params.itemName} not found` });
    }

    // Set the new name of the item
    existingItem.itemName = req.body.itemName;

    try {
        // Save changes to the database
        await em.flush();
        return res.status(200).json({ message: `Item name changed to ${existingItem.itemName}` });
    } catch (error) {
        console.error('Error updating item name:', error);
        return res.status(500).json({ message: 'An error occurred while updating item name' });
    }
});

// Update item description
router.put('/ChangeItemDescription/:itemDescription', async (req: Request, res: any) => {
    const em = DI.orm.em.fork(); // Forked EntityManager for isolated work
    const existingItem = await em.findOne(Item, {
        itemDescription: req.params.itemDescription
    });

    if (!existingItem) {
        return res.status(404).json({ message: `Item with description ${req.params.itemDescription} not found` });
    }

    // Set the new description of the item
    existingItem.itemDescription = req.body.itemDescription;

    try {
        // Save changes to the database
        await em.flush();
        return res.status(200).json({ message: `Item description changed to ${existingItem.itemDescription}` });
    } catch (error) {
        console.error('Error updating item description:', error);
        return res.status(500).json({ message: 'An error occurred while updating item description' });
    }
});

// Freestyle 1# Toggle favorite status for item
router.put('/ToggleFavorite/:itemName', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();

    try {
        const item = await em.findOne(Item, { itemName: req.params.itemName });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Toggle favorite status
        item.isFavorite = !item.isFavorite;
        await em.flush();

        return res.status(200).json({ message: `Item ${item.itemName} is now ${item.isFavorite ? 'a favorite' : 'not a favorite'}` });
    } catch (error) {
        console.error('Error toggling favorite status:', error);
        return res.status(500).json({ error: 'An error occurred while toggling favorite status' });
    }
});

// Freestyle 1 # Get all favorite items
router.get('/GetFavoriteItems', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();

    try {
        // Find all items marked as favorite
        const favoriteItems = await em.find(Item, { isFavorite: true });

        if (favoriteItems.length === 0) {
            return res.status(404).json({ message: 'No favorite items found' });
        }

        return res.status(200).json(favoriteItems);
    } catch (error) {
        console.error('Error fetching favorite items:', error);
        return res.status(500).json({ error: 'An error occurred while fetching favorite items' });
    }
});

// Freestyle 1 #  Get popular items based on quantity
router.get('/GetPopularItems', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    try {
        const listItems = await em.find(ShoppingListItem, {}, { orderBy: { quantity: 'DESC' }, limit: 10 });
        return res.status(200).json(listItems);
    } catch (error) {
        console.error('Error fetching popular items:', error);
        return res.status(500).json({ error: 'An error occurred while fetching popular items' });
    }
});

export const itemController = router;
