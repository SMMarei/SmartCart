import {Request, Response, Router} from 'express';
import {DI} from '../index';
import {Item} from '../entities/Item';
import {ShoppingListItem} from '../entities/ShoppingListItem';
import {z} from 'zod';
import {handleError, handleValidationError} from '../Services/ErrorHandler';
import {ItemService} from '../Services/ItemService';


const router = Router();
const itemService = new ItemService();

// Display all items
router.get('/AllItems', async (req: Request, res: Response) => {

    try {
        const em = DI.orm.em.fork();
        const items = await em.find(Item, {});
        res.status(200).json(items);
    } catch (error) {
        handleError(res, error as Error, 'Error fetching items');
    }
},);

// Create Item with Validation
router.post('/NewItem', async (req: Request, res: any) => {
    try {
        const newItem = await itemService.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Validation error:', error);
        const zodError = error instanceof z.ZodError ? error.format() : error;
        return res.status(400).json({error: 'Validation failed', details: zodError});
    }
});

// Delete an item
router.delete('/:itemName', async (req: Request, res: Response) => {
    try {
        const item = await itemService.deleteItem(req.params.itemName);
        res.status(200).json(item);
    } catch (error) {
        handleError(res, error as Error, 'Error deleting item');
    }
});

// Search items by name
router.get('/:itemName', async (req: Request, res: any) => {
    try {
        const items = await itemService.searchItemByName(req.params.itemName);
        if (items.length === 0) {
            return res.status(404).json({error: `No item found with name ${req.params.itemName}`});
        }
        res.status(200).json(items);
    } catch (error) {
        handleError(res, error as Error, 'Error searching items by name');
    }
});

// Search items by description
router.get('/ItemByDescription/:itemDescription', async (req: Request, res: any) => {
    try {
        const items = await itemService.searchItemByDescription(req.params.itemDescription);
        if (items.length === 0) {
            return res.status(404).json({error: `No item found with description ${req.params.itemDescription}`});
        }
        res.status(200).json(items);
    } catch (error) {
        handleError(res, error as Error, 'Error searching items by description');
    }
});

// Update item name
router.put('/:itemName', async (req: Request, res: any) => {
    try {
        const updatedItem = await itemService.updateItemName(req.params.itemName, req.body);
        res.status(200).json({message: `Item name changed to ${updatedItem.itemName}`});
    } catch (error) {
        handleValidationError(res, error as Error, 'Validation error');
    }
});

// Toggle favorite status for item
router.put('/Favorite/:itemName', async (req: Request, res: any) => {
    try {
        const item = await itemService.toggleItemToFavorite(req.params.itemName);
        res.status(200).json({message: `Item ${item.itemName} is now ${item.isFavorite ? 'a favorite' : 'not a favorite'}`});
    } catch (error) {
        handleError(res, error as Error, 'Error toggling favorite status');
    }
});

// Get all favorite items
router.get('/AllFavoriteItems', async (req: Request, res: any) => {
    try {
        const favoriteItems = await itemService.getFavoriteItems();
        if (favoriteItems.length === 0) {
            return res.status(404).json({message: 'No favorite items found'});
        }
        res.status(200).json(favoriteItems);
    } catch (error) {
        handleError(res, error as Error, 'Error fetching favorite items');
    }
});

// Freestyle 1 #  Get popular items based on quantity
router.get('/PopularItems', async (req: Request, res: any) => {
    const em = DI.orm.em.fork();
    try {
        const listItems = await em.find(ShoppingListItem, {}, {orderBy: {quantity: 'DESC'}, limit: 10});
        return res.status(200).json(listItems);
    } catch (error) {
        handleError(res, error as Error, 'Error fetching items');
    }
});

export const itemController = router;
