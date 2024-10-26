import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Item } from './entities/Item';
import { ShoppingList } from './entities/ShoppingList';
import {ShoppingListItem} from "./entities/ShoppingListItem";

const options: Options<PostgreSqlDriver> = {
    entities: [Item, ShoppingList, ShoppingListItem],
    dbName: 'shopDB',
    user: 'postgres',        // Dein Datenbank-Benutzername
    password: '0711',    // Dein Datenbank-Passwort
    driver: PostgreSqlDriver,        // PostgreSQL-Treiber
    debug: true,
};

export default options;
