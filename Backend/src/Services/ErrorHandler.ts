import {Response} from 'express';
import {z} from 'zod';

export function handleError(res: Response, error: Error, message = 'An error occurred') {
    console.error(message, error); // Fehler in der Konsole ausgeben
    res.status(500).json({ error: message });
}

export function handleValidationError(res:Response, error:Error, message = 'Validation failed') {
    console.error(message, error); // Fehler in der Konsole ausgeben

    // Zod-spezifische Fehlerstrukturierung
    const zodError = error instanceof z.ZodError ? error.format() : error;

    // Antwort an den Client
    res.status(400).json({ error: message, details: zodError });
}

export function handleNotFound(res:Response, message = 'Not found') {
    res.status(404).json({ error: message });
}


