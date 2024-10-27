import dotenv from 'dotenv';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Item } from './entities/Item';
import { ShoppingList } from './entities/ShoppingList';
import { ShoppingListItem } from './entities/ShoppingListItem';


dotenv.config();

const options: Options<PostgreSqlDriver> = {
    entities: [Item, ShoppingList, ShoppingListItem],
    clientUrl: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    driver: PostgreSqlDriver,
    debug: true,
};

export default options;
