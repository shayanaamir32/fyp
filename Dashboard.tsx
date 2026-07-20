import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <main className="container mx-auto mt-8 px-4 flex-grow">
      <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
      <p className="mb-4">This is a placeholder for your dashboard content.</p>
      <Button onClick={handleLogout} className="bg-[#120727] text-white">
        Logout
      </Button>
    </main>
  )
}

export default Dashboard

