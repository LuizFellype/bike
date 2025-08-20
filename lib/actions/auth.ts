"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
}

// Simulate user database
const users: User[] = []

export async function signUp(formData: FormData): Promise<AuthResult> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validation
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email)
  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
  }

  users.push(newUser)

  // Set authentication cookie
  const cookieStore = await cookies()
  cookieStore.set("auth-token", newUser.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, user: newUser }
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validation
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  // For demo purposes, accept any email/password combination
  // In a real app, you would verify against a database
  let user = users.find((u) => u.email === email)

  if (!user) {
    // Create a demo user if not exists
    user = {
      id: `user-${Date.now()}`,
      name: email.split("@")[0],
      email,
    }
    users.push(user)
  }

  // Set authentication cookie
  const cookieStore = await cookies()
  cookieStore.set("auth-token", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, user }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
  redirect("/login")
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return null
  }

  const user = users.find((u) => u.id === token.value)
  return user || null
}
