export type FormState = {
  errors?: { name?: string[]; email?: string[]; password?: string[]; confirm?: string[] }
  message?: string
} | undefined
