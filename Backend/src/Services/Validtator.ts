import {z} from 'zod';


// Regex für erlaubte Zeichen
const nameAndDescriptionRegex = /^[a-zA-Z0-9\s.,Ö, ö,Ä, ä, Ü, ü,ß,-]+$/;

// Item-Schema-Definition
export const ItemSchema = z.object({
    itemName: z
        .string()
        .min(3, 'Item name is required')
        .refine((val) => nameAndDescriptionRegex.test(val), {
            message: 'Item name contains invalid characters',
        }),
    itemDescription: z
        .string()
        .refine((val) => nameAndDescriptionRegex.test(val || ''), {
            message: 'Item description contains invalid characters',
        }),
    image: z.string().optional(),
});

// ShoppingList-Schema-Definition
export const ShoppingListSchema = z.object({
    listName: z
        .string()
        .min(3, 'List name is required')
        .refine((val) => nameAndDescriptionRegex.test(val), {
            message: 'List name contains invalid characters',
        }),
    listDescription: z
        .string()
        .refine((val) => nameAndDescriptionRegex.test(val || ''), {
            message: 'List description contains invalid characters',
        }),
});

// ShoppingListItem-Schema-Definition, mit `listName` und `item` optional
export const ShoppingListItemSchema = z.object({
    listName: z
        .string()
        .min(3, 'List name is required')
        .refine((val) => nameAndDescriptionRegex.test(val)),
    item: ItemSchema.optional(), // Optionales Feld
    nameOfItem: z
        .string()
        .min(3, 'Item name is required')
        .refine((val) => nameAndDescriptionRegex.test(val), {
            message: 'Item name contains invalid characters',
        }),
    description: z
        .string()
        .refine((val) => nameAndDescriptionRegex.test(val || ''), {
            message: 'Description contains invalid characters',
        }),
    quantity: z
        .number()
        .positive('Quantity must be a positive integer')
        .int('Quantity must be an integer')
});
