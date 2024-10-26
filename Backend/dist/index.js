"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeServer = exports.DI = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config")); // MikroORM-Konfiguration importieren
const Item_1 = require("./entities/Item");
const ShoppingList_1 = require("./entities/ShoppingList");
const Item_controller_1 = require("./Controller/Item.controller");
const Shoppinglist_controller_1 = require("./Controller/Shoppinglist.controller");
const PORT = 4000;
const app = (0, express_1.default)();
exports.DI = {};
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // MikroORM mit der externen Konfiguration initialisieren
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    const em = orm.em;
    exports.DI.orm = orm;
    exports.DI.em = em;
    exports.DI.itemRepository = em.getRepository(Item_1.Item);
    exports.DI.shoppingListRepository = em.getRepository(ShoppingList_1.ShoppingList);
    // Middleware und Routen hinzufügen
    app.use(express_1.default.json());
    app.use((req, res, next) => core_1.RequestContext.create(exports.DI.orm.em, next));
    // Routen für Items und Shoppinglisten verwenden
    app.use('/Items', Item_controller_1.itemController);
    app.use('/ShoppingList', Shoppinglist_controller_1.ShoppingListController);
    // Server starten
    exports.DI.server = app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
exports.initializeServer = initializeServer;
if (process.env.environment !== 'test') {
    (0, exports.initializeServer)();
}
