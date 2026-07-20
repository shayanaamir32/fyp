
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { UserData, VendorData } from "@/types/user"
import { register } from "@/services/auth"


function Auth() {
  const [activeTab, setActiveTab] = useState("user")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {

    try {
      event.preventDefault()
      setLoading(true)

      const formData = new FormData(event.currentTarget)

      if (activeTab === "user") {
        const userData: UserData = {
          username: formData.get("username") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          phoneNumber: formData.get("number") as string,
        }
        console.log("User signup data:", userData)
        // TODO: Implement user signup logic
        const resgiterData = await register({ ...userData, role: "user" })
        localStorage.setItem('auth', JSON.stringify(resgiterData.data));


        setLoading(false)
        alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} signup successful!`)
        navigate("/home")
      } else {
        const vendorData: VendorData = {
          businessName: formData.get("businessName") as string,
          address: formData.get("address") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          phoneNumber: formData.get("phone") as string,
        }
        console.log("Vendor signup data:", vendorData)
        // TODO: Implement vendor signup logic
        const resgiterData = await register({ ...vendorData, role: "vendor" })
        localStorage.setItem('auth', JSON.stringify(resgiterData.data));


        await new Promise((resolve) => setTimeout(resolve, 1000))

        setLoading(false)
        alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} signup successful!`)
        navigate("/vendor-dashboard")
      }

      // Simulate API call


    } catch (error) {
      alert("some thing went wrong")
      setLoading(false)


    }
  }

  return (
    <main className="container mx-auto mt-8 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="vendor">Vendor</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="Username" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Password" required />
            </div>
            <div>
              <Label htmlFor="number">Phone Number</Label>
              <Input id="number" name="number" type="tel" placeholder="Phone Number" required />
            </div>
            <Button type="submit" className="w-full bg-[#120727] text-white" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up as User"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="vendor">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" name="businessName" placeholder="Business Name" required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" placeholder="Address" required />
            </div>
            <div>
              <Label htmlFor="vendorEmail">Email</Label>
              <Input id="vendorEmail" name="email" type="email" placeholder="Email" required />
            </div>
            <div>
              <Label htmlFor="vendorPassword">Password</Label>
              <Input id="vendorPassword" name="password" type="password" placeholder="Password" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="Phone Number" required />
            </div>
            <Button type="submit" className="w-full bg-[#120727] text-white" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up as Vendor"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default Auth

