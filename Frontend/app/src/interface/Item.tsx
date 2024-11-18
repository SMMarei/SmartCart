export interface Item {
  itemId: string;
  itemName: string;
  itemDescription: string;
  image: string;
  itemCreatedAt: Date;
  itemUpdatedAt: Date;
  isFavorite: boolean;
}

export interface ItemStatus {
  id: number;
  status: string;
}
