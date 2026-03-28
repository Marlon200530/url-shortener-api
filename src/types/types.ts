export type Url = {
  id: number
  originalUrl: string
  shortCode: string
  customAlias: string | null
  clickCount: number
  expiresAt: Date | null
  createdAt: Date
  userId: number
}

export type User = {
    id: number
    username: string 
    email: string 
    password: string 
}


// export type CreateUrlInput = {
//   originalUrl: string
//   customAlias?: string
//   expiresAt?: Date
//   userId: number
// }

// export type UrlResponse = {
//   id: number
//   originalUrl: string
//   shortCode: string
//   customAlias: string | null
//   clickCount: number
//   expiresAt: Date | null
//   createdAt: Date
// }


export type PublicUser = Omit<User, "password">
