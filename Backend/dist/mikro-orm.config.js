"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const Item_1 = require("./entities/Item");
const ShoppingList_1 = require("./entities/ShoppingList");
const ShoppingListItem_1 = require("./entities/ShoppingListItem");
const options = {
    entities: [Item_1.Item, ShoppingList_1.ShoppingList, ShoppingListItem_1.ShoppingListItem],
    dbName: 'shopDB',
    user: 'postgres', // Dein Datenbank-Benutzername
    password: '0711', // Dein Datenbank-Passwort
    driver: postgresql_1.PostgreSqlDriver, // PostgreSQL-Treiber
    debug: true,
};
exports.default = options;
