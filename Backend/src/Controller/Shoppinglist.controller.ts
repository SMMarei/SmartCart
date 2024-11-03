import {Request, Response, Router} from 'express';
import {DI} from '../index';
import {ShoppingList} from '../entities/ShoppingList';
import {z} from 'zod';
import {handleError, handleNotFound, handleValidationError} from "../Services/ErrorHandler";
import {ShoppingListService} from "../Services/ShoppingListService";


const router = Router({mergeParams: true});
const shoppingListService = new ShoppingListService();


// Display all shopping lists, including linked items
router.get('/AllShoppingList', async (req: Request, res: Response) => {
    try {
        const em = DI.orm.em.fork();
        const lists = await em.find(ShoppingList, {}, {populate: ['items']}); // 'items' represents the relation
        res.status(200).json(lists);
    } catch (error) {
        console.error('Error fetching shopping lists:', error);
        res.status(500).json({error: 'An error occurred while fetching the shopping lists'});
    }
});

// Create a new shopping list
router.post('/NewShoppingList', async (req: Request, res: Response) => {
    try {
        const newList = await shoppingListService.createShoppingList(req.body); // 'await' hinzugefügt
        res.status(201).json(newList);
    } catch (error) {
        if (error instanceof z.ZodError) {
            handleValidationError(res, error, 'Validation failed');
        } else {
            handleError(res, error as Error, 'Error creating new shopping list');
        }
    }
});

// Delete a shopping list
router.delete('/:listName', async (req: Request, res: any) => {
    try {
        const shoppingList = shoppingListService.deleteShoppingList(req.params.listName);
        res.status(200).json(shoppingList);
    } catch (error) {
        handleError(res, error as Error, 'An error occurred while deleting the list')
    }
});

// Route to search for shopping lists by name
router.get('/ShoppingListByName/:listName', async (req: Request, res: any) => {

    try {
        const lists = await shoppingListService.searchShoppingListByName(req.params.listName);
        if (lists.length === 0) {
            return res.status(404).json({error: `No shopping lists found with name ${req.params.listName}`});
        }
        return res.status(200).json(lists);
    } catch (error) {
        handleError(res, error as Error, 'An error occurred while searching by name');
    }
});

// Route to search for shopping lists by description
router.get('/ShoppingListByDescription/:listDescription', async (req: Request, res: any) => {
    try {
        const lists = await shoppingListService.searchShoppingListByDescription(req.params.listDescription);
        if (lists.length === 0) {
            return res.status(404).json({error: `No shopping lists found with Description ${req.params.listDescription}`});
        }
        return res.status(200).json(lists);
    } catch (error) {
        handleError(res, error as Error, 'An error occurred while searching by Description');
    }
});

// Update a shopping list Name and Description
router.put('/ShoppingList/:listName', async (req: Request, res: any) => {
    try {
        const updatedList = await shoppingListService.updateNameShoppingList(req.params.listName, req.body);
        res.status(200).json(updatedList);
    } catch (error) {
        if (error instanceof z.ZodError) {
            handleValidationError(res, error, 'Validation failed');
        } else {
            handleError(res, error as Error, 'Error updating the shopping list');
        }
    }
});

// Route für das Abrufen von Einkaufslisten mit einem bestimmten Item
router.get('/ShoppingListWithItem/:itemName', async (req: Request, res: any) => {
    const {itemName} = req.params;
    try {
        const shoppingLists = await shoppingListService.findShoppingListsWithItem(itemName);

        if (shoppingLists.length === 0) {
            return handleNotFound(res, `No shopping lists found containing ${itemName}`);
        }

        return res.status(200).json(shoppingLists);
    } catch (error) {
        console.error('Error fetching shopping lists with item:', error);
        return handleError(res, error as Error, 'An error occurred while fetching the lists');
    }
});

router.post('/ItemToShoppingList/:listName', async (req: Request, res: Response) => {
    try {
        const listName = req.params.listName;
        const newItem = await shoppingListService.addItemsToShoppingList(listName, req.body);
        res.status(201).json(newItem);
    } catch (error) {
        handleValidationError(res, error as Error, 'Error adding item to shopping list');
    }
});

// Delete item from ShoppingList
    router.delete('/ItemFromShoppingList/:listName/:itemName', async (req: Request, res: any) => {
    const {listName, itemName} = req.params;

    try {
        // Rufe die Service-Methode zum Löschen auf
        const result = await shoppingListService.deleteItemFromShoppingList(listName, itemName);
        return res.status(200).json(result);
    } catch (error) {
        handleValidationError(res, error as Error, 'An error occurred while deleting the item from the shopping list');
    }
});

// Freestyle #1: Sort shopping lists by last updated
router.get('/LastUpdatedShoppingList', async (req: Request, res: any) => {

    try {
        const lastUpdatedList = await shoppingListService.sortShoppingListsByLastUpdated
        (req.query.limit ? parseInt(req.query.limit as string) : 10);
        return res.status(200).json(lastUpdatedList);
    } catch (error) {
        if (error instanceof z.ZodError) {
            handleValidationError(res, error, 'Validation failed');
        } else {
            handleError(res, error as Error, 'Error while Sorting the updated shopping list');
        }
    }
});
export const ShoppingListController = router;
