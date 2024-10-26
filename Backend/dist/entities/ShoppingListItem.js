"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListItem = exports.ItemStatus = void 0;
const core_1 = require("@mikro-orm/core");
const ShoppingList_1 = require("./ShoppingList");
const Item_1 = require("./Item");
const uuid_1 = require("uuid");
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["PENDING"] = "pending";
    ItemStatus["PURCHASED"] = "purchased";
    ItemStatus["CANCELLED"] = "cancelled";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
let ShoppingListItem = class ShoppingListItem {
    constructor() {
        this.id = (0, uuid_1.v4)();
        this.status = ItemStatus.PENDING;
    }
};
exports.ShoppingListItem = ShoppingListItem;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], ShoppingListItem.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => ShoppingList_1.ShoppingList),
    __metadata("design:type", ShoppingList_1.ShoppingList)
], ShoppingListItem.prototype, "shoppingList", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Item_1.Item),
    __metadata("design:type", Item_1.Item)
], ShoppingListItem.prototype, "item", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ShoppingListItem.prototype, "nameOfItem", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ShoppingListItem.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], ShoppingListItem.prototype, "quantity", void 0);
__decorate([
    (0, core_1.Property)({ default: ItemStatus.PENDING }),
    __metadata("design:type", String)
], ShoppingListItem.prototype, "status", void 0);
exports.ShoppingListItem = ShoppingListItem = __decorate([
    (0, core_1.Entity)()
], ShoppingListItem);
