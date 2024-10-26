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
exports.Item = void 0;
const core_1 = require("@mikro-orm/core");
const uuid_1 = require("uuid");
let Item = class Item {
    constructor(itemName, itemDescription, image) {
        this.itemId = (0, uuid_1.v4)();
        this.itemCreatedAt = new Date();
        this.itemUpdatedAt = new Date();
        this.itemName = itemName;
        this.itemDescription = itemDescription;
        this.image = image;
    }
};
exports.Item = Item;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", String)
], Item.prototype, "itemId", void 0);
__decorate([
    (0, core_1.Unique)(),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "itemName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "itemDescription", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Item.prototype, "image", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Object)
], Item.prototype, "itemCreatedAt", void 0);
__decorate([
    (0, core_1.Property)({ onUpdate: () => new Date() }),
    __metadata("design:type", Object)
], Item.prototype, "itemUpdatedAt", void 0);
__decorate([
    (0, core_1.Property)({ default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "isFavorite", void 0);
exports.Item = Item = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String])
], Item);
