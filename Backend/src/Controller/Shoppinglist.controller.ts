import { Request, Response, Router } from "express";
import { DI } from "../index";
import { ShoppingList } from "../entities/ShoppingList";
import { z } from "zod";
import {
  BadRequest,
  handleError,
  handleExists,
  handleNotFound,
  handleValidationError,
} from "../Services/ErrorHandler";
import { ShoppingListService } from "../Services/ShoppingListService";

const router = Router({ mergeParams: true });
const shoppingListService = new ShoppingListService();

router.get("/AllShoppingList", async (req: Request, res: Response) => {
  try {
    const em = DI.orm.em.fork();
    const lists = await em.find(ShoppingList, {}, { populate: ["items"] }); // 'items' represents the relation
    res.status(200).json(lists);
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the shopping lists" });
  }
});

router.post("/NewShoppingList", async (req: Request, res: Response) => {
  try {
    const newList = await shoppingListService.createShoppingList(req.body); // 'await' hinzugefügt
    res.status(201).json(newList);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(res, error, "Validation failed");
    } else if (
      error instanceof Error &&
      error.message.includes("already exists")
    ) {
      return handleExists(res, error.message);
    } else {
      handleError(res, error as Error, "Error creating new shopping list");
    }
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const shoppingList = await shoppingListService.deleteShoppingList(
      req.params.id,
    );
    res.status(200).json(shoppingList);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Shopping list contains items")
    ) {
      return BadRequest(res, error.message);
    }
    // Allgemeiner Fehlerfall
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

router.get("/ShoppingList/search", async (req: Request, res: any) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const shoppingLists = await shoppingListService.searchShoppingLists(
      query as string,
    );
    if (shoppingLists.length === 0) {
      return res.status(404).json({ message: "No shopping lists found" });
    } else {
      return res.status(200).json(shoppingLists);
    }
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while searching lists" });
  }
});

router.put("/ShoppingList/:id", async (req: Request, res: any) => {
  try {
    const updatedList = await shoppingListService.updateNameShoppingList(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedList);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(res, error, "Validation failed");
    } else {
      handleError(res, error as Error, "Error updating the shopping list");
    }
  }
});

router.get(
  "/ShoppingListWithItem/:itemName",
  async (req: Request, res: any) => {
    const { itemName } = req.params;
    try {
      const shoppingLists =
        await shoppingListService.findShoppingListsWithItem(itemName);

      if (shoppingLists.length === 0) {
        return handleNotFound(
          res,
          `No shopping lists found containing ${itemName}`,
        );
      }

      return res.status(200).json(shoppingLists);
    } catch (error) {
      console.error("Error fetching shopping lists with item:", error); // Debug-ouptut
      return handleError(
        res,
        error as Error,
        "An error occurred while fetching the lists",
      );
    }
  },
);

router.post(
  "/NewItemToShoppingList/:id",
  async (req: Request, res: Response) => {
    try {
      const listId = req.params.id;
      const newItem = await shoppingListService.addItemsToShoppingList(
        listId,
        req.body,
      );
      res.status(201).json(newItem);
    } catch (error) {
      handleValidationError(
        res,
        error as Error,
        "Error adding item to shopping list",
      );
    }
  },
);

router.delete(
  "/ItemFromShoppingList/:listId/:itemName",
  async (req: Request, res: any) => {
    const { listId, itemName } = req.params;
    console.log(listId, itemName);

    try {
      const result = await shoppingListService.deleteItemFromShoppingList(
        listId,
        itemName,
      );
      return res.status(200).json(result);
    } catch (error) {
      handleValidationError(
        res,
        error as Error,
        "An error occurred while deleting the item from the shopping list",
      );
    }
  },
);

router.get("/ItemsFromShoppingList/:listId", async (req: Request, res: any) => {
  try {
    const items = await shoppingListService.getItemsFromShoppingList(
      req.params.listId,
    );
    return res.status(200).json(items);
  } catch (error) {
    handleValidationError(
      res,
      error as Error,
      "An error occurred while fetching the items from the shopping list",
    );
  }
});

// Freestyle #1: Sort shopping lists by last updated
router.get("/LastUpdatedShoppingList", async (req: Request, res: any) => {
  try {
    const lastUpdatedList =
      await shoppingListService.sortShoppingListsByLastUpdated();

    return res.status(200).json(lastUpdatedList);
  } catch (error) {
    if (error instanceof z.ZodError) {
      handleValidationError(res, error, "Validation failed");
    } else {
      handleError(
        res,
        error as Error,
        "Error while Sorting the updated shopping list",
      );
    }
  }
});

// FreeStyle #2:
router.get("/api/:prodName", async (req, res) => {
  try {
    let requestProbe = req.params.prodName;
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${requestProbe}`,
    );
    if (!response.ok) {
      throw new Error("An error occurred while fetching the product data");
    }
    const data = await response.json();
    res.json({ instructions: data.meals[0].strInstructions });
  } catch (error) {
    console.error("API-Error:", error);
    res.status(500).json({ error: "An error occurred while loading data" });
  }
});

export const ShoppingListController = router;
