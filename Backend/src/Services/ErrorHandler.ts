import { Response } from "express";
import { z } from "zod";

export function handleError(
  res: Response,
  error: Error,
  message = "An error occurred",
) {
  console.error(message, error); //  error output for debugging
  res.status(500).json({ error: message });
}

export function handleValidationError(
  res: Response,
  error: Error,
  message = "Validation failed",
) {
  console.error(message, error); //  error output for debugging

  const zodError = error instanceof z.ZodError ? error.format() : error;

  res.status(400).json({ error: message, details: zodError });
}

export function handleNotFound(res: Response, message = "Not found") {
  res.status(404).json({ error: message });
}

export function BadRequest(res: Response, message = "cannot be deleted") {
  res.status(400).json({ error: message });
}

export function handleExists(res: Response, message = "already exists") {
  res.status(400).json({ error: message });
}
