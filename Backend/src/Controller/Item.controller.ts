import { Request, Response, Router } from "express";
import { DI } from "../index";
import { Item } from "../entities/Item";
import { z } from "zod";
import {
  BadRequest,
  handleError,
  handleExists,
  handleValidationError,
} from "../Services/ErrorHandler";
import { ItemService } from "../Services/ItemService";

const router = Router();
const itemService = new ItemService();

router.get("/AllItems", async (req: Request, res: Response) => {
  try {
    const em = DI.orm.em.fork();
    const items = await em.find(
      Item,
      {},
      { orderBy: { itemUpdatedAt: "desc" } },
    );
    res.status(200).json(items);
  } catch (error) {
    handleError(res, error as Error, "Error fetching items");
  }
});

router.post("/NewItem", async (req: Request, res: any) => {
  try {
    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Fehler:", error); // Zum Debuggen
    if (error instanceof Error && error.message.includes("already exists")) {
      return handleExists(res, error.message);
    } else {
      const zodError = error instanceof z.ZodError ? error.format() : error;
      return res
        .status(400)
        .json({ error: "Validation failed", details: zodError });
    }
  }
});

router.delete("/:itemId", async (req: Request, res: any) => {
  try {
    const item = await itemService.deleteItem(req.params.itemId);
    res.status(200).json(item);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("associated with a shopping list")
    ) {
      return BadRequest(res, error.message);
    }
    handleError(res, error as Error, "Error deleting item");
  }
});

router.put("/:itemId", async (req: Request, res: any) => {
  try {
    const updatedItem = await itemService.updateItemName(
      req.params.itemId,
      req.body,
    );
    res.status(200).json({
      message: `Item name changed to ${updatedItem.itemName} and Item Description changed to ${updatedItem.itemDescription}`,
    });
  } catch (error) {
    handleValidationError(res, error as Error, "Validation error");
  }
});

router.post("/:itemId", async (req: Request, res: any) => {
  try {
    const itemId = req.params.itemId;
    const shoppingListId = req.body.shoppingListId;

    const newItem = await itemService.addItemToShoppingList(
      itemId,
      shoppingListId,
    );
    return res.status(201).json(newItem);
  } catch (error) {
    console.error("Error:", error);
    return res.status(400).json({ error: "Validation failed" });
  }
});

// Freestyle task #1
// Toggle favorite status for item
router.put("/Favorite/:itemId", async (req: Request, res: any) => {
  try {
    const item = await itemService.toggleItemToFavorite(req.params.itemId);
    res.status(200).json({
      message: `Item  with Id: ${item.itemId} , its name ${item.itemName} is now ${item.isFavorite ? "a favorite" : "not a favorite"}`,
    });
  } catch (error) {
    handleError(res, error as Error, "Error toggling favorite status");
  }
});

router.get("/AllFavouriteItems", async (req: Request, res: any) => {
  try {
    console.log("Fetching all favorite items..."); // Debug-Ausgabe
    const items = await itemService.getAllFavoriteItems();
    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No favorite items found" });
    }
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching favorite items:", error); //  error output for debugging
    handleError(res, error as Error, "Error fetching favorite items");
  }
});

export const itemController = router;
