export type UrlEntity = {
  id: number
  originalUrl: string
  shortCode: string
  customAlias: string | null
  clickCount: number
  expiresAt: Date | null
  createdAt: Date
  userId: number
}

export type CreateUrlInput = {
  originalUrl: string
  customAlias?: string
  expiresAt?: Date
  userId: number
}

export type UrlResponse = {
  id: number
  originalUrl: string
  shortCode: string
  customAlias: string | null
  clickCount: number
  expiresAt: Date | null
  createdAt: Date
}