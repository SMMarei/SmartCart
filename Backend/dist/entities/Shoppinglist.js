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
exports.ShoppingList = void 0;
const core_1 = require("@mikro-orm/core");
const uuid_1 = require("uuid");
const ShoppingListItem_1 = require("./ShoppingListItem"); // Die Beziehungstabelle
let ShoppingList = class ShoppingList {
    constructor(listName, listDescription) {
        this.id = (0, uuid_1.v4)();
        this.listCreatedAt = new Date();
        this.listUpdatedAt = new Date();
        // Eine Einkaufsliste kann 0 oder N Artikel haben
        this.items = new core_1.Collection(this);
        this.listName = listName;
        this.listDescription = listDescription;
    }
};
exports.ShoppingList = ShoppingList;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], ShoppingList.prototype, "id", void 0);
__decorate([
    (0, core_1.Unique)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ShoppingList.prototype, "listName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ShoppingList.prototype, "listDescription", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Object)
], ShoppingList.prototype, "listCreatedAt", void 0);
__decorate([
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Object)
], ShoppingList.prototype, "listUpdatedAt", void 0);
__decorate([
    (0, core_1.OneToMany)(() => ShoppingListItem_1.ShoppingListItem, item => item.shoppingList),
    __metadata("design:type", Object)
], ShoppingList.prototype, "items", void 0);
exports.ShoppingList = ShoppingList = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String])
], ShoppingList);
