import express from "express";
import http from "http";
import {
  EntityManager,
  EntityRepository,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import options from "./mikro-orm.config"; // MikroORM-Konfiguration importieren
import { Item } from "./entities/Item";
import { ShoppingList } from "./entities/ShoppingList";
import { itemController } from "./Controller/Item.controller";
import { ShoppingListController } from "./Controller/Shoppinglist.controller";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Erlaube nur Anfragen vom Frontend-Port
  }),
);
const PORT = 4000;

// DI-Objekt initialisieren
export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  itemRepository: EntityRepository<Item>;
  shoppingListRepository: EntityRepository<ShoppingList>;
};

export const initializeServer = async () => {
  // MikroORM mit der externen Konfiguration initialisieren
  const orm = await MikroORM.init(options);
  const em = orm.em;

  DI.orm = orm;
  DI.em = em;
  DI.itemRepository = em.getRepository(Item);
  DI.shoppingListRepository = em.getRepository(ShoppingList);

  // Middleware und Routen hinzufügen
  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  // Routen für Items und Shoppinglisten verwenden
  app.use("/Items", itemController);
  app.use("/ShoppingLists", ShoppingListController);

  // Server start
  DI.server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

if (process.env.environment !== "test") {
  initializeServer().catch((err) => {
    console.error("Error initializing server:", err);
  });
}
