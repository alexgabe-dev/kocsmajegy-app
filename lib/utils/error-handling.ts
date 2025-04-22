import { PostgrestError } from "@supabase/supabase-js"

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleSupabaseError(error: PostgrestError | Error): never {
  if (error instanceof PostgrestError) {
    switch (error.code) {
      case "23505": // Unique violation
        throw new AppError("Ez az adat már létezik", 409, error.code)
      case "23503": // Foreign key violation
        throw new AppError("Hivatkozott adat nem található", 404, error.code)
      case "42501": // Insufficient privilege
        throw new AppError("Nincs jogosultság a művelethez", 403, error.code)
      default:
        throw new AppError(error.message, 500, error.code)
    }
  }
  throw new AppError(error.message)
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return "Ismeretlen hiba történt"
} 