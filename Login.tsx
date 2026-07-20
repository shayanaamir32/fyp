"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { login } from "@/services/auth"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Basic authentication logic (replace with your actual authentication)
    try {
      // Call your login function (replace with your actual API request)
      const data = await login({ email: username, password })
      console.log(data, "data fom ")
      // Assuming the response contains an authentication token
      // Store the auth token in localStorage
      localStorage.setItem("auth", JSON.stringify(data.data))
      // Redirect to the dashboard or desired route
      if (data.data.role === "user") navigate('/home')
      if (data.data.role === "vendor") navigate('/vendor-dashboard')


    } catch (error) {
      console.error("Login failed:", error)
      alert("Something went wrong, please try again later.")
    }
  }

  return (
    <main className="container mx-auto px-4 mt-16 flex-grow">
      <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </main>
  )
}

export default Login
