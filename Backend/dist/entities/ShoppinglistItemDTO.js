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
exports.ShoppinglistItemDTO = exports.ItemStatus = void 0;
const core_1 = require("@mikro-orm/core");
const Shoppinglist_1 = require("./Shoppinglist");
const Item_1 = require("./Item");
const uuid_1 = require("uuid");
var ItemStatus;
(function (ItemStatus) {
    ItemStatus["PENDING"] = "pending";
    ItemStatus["PURCHASED"] = "purchased";
    ItemStatus["CANCELLED"] = "cancelled";
})(ItemStatus || (exports.ItemStatus = ItemStatus = {}));
let ShoppinglistItemDTO = class ShoppinglistItemDTO {
    constructor() {
        this.id = (0, uuid_1.v4)();
        this.status = ItemStatus.PENDING;
    }
};
exports.ShoppinglistItemDTO = ShoppinglistItemDTO;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], ShoppinglistItemDTO.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Shoppinglist_1.Shoppinglist),
    __metadata("design:type", Shoppinglist_1.Shoppinglist)
], ShoppinglistItemDTO.prototype, "shoppingList", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Item_1.Item),
    __metadata("design:type", Item_1.Item)
], ShoppinglistItemDTO.prototype, "item", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ShoppinglistItemDTO.prototype, "nameOfItem", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ShoppinglistItemDTO.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], ShoppinglistItemDTO.prototype, "quantity", void 0);
__decorate([
    (0, core_1.Property)({ default: ItemStatus.PENDING }),
    __metadata("design:type", String)
], ShoppinglistItemDTO.prototype, "status", void 0);
exports.ShoppinglistItemDTO = ShoppinglistItemDTO = __decorate([
    (0, core_1.Entity)()
], ShoppinglistItemDTO);
