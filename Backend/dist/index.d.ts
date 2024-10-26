import http from 'http';
import { MikroORM, EntityManager, EntityRepository } from '@mikro-orm/core';
import { Item } from './entities/Item';
import { ShoppingList } from "./entities/ShoppingList";
export declare const DI: {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    itemRepository: EntityRepository<Item>;
    shoppingListRepository: EntityRepository<ShoppingList>;
};
export declare const initializeServer: () => Promise<void>;
