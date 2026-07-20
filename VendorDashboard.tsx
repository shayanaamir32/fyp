import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Calendar, DollarSign, Users, CheckCircle, Clock } from "lucide-react"
import VendorOffers from "./VendorOffer"
import { getVendorDashboard, getVendor } from "@/services/vendor"
import { useParams } from "react-router-dom"
import VendorChatList from "./MyVendors"
import { VendorImageUpload } from "./VendorImageUpload"
import { VendorSpecialtySelector } from "./VendorSpecialtySelector"

function VendorDashboard() {
  const [dashboardStats, setDashboardStats] = useState(null)
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user = JSON.parse(localStorage.getItem('auth') as string)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, vendorRes] = await Promise.all([
          getVendorDashboard(user.id),
          getVendor(user.id),
        ])
        setDashboardStats(statsRes)
        setVendor(vendorRes)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleImageUpdated = (newImageUrl: string) => {
    // Update vendor state with new image URL
    if (vendor) {
      setVendor({ ...vendor, imageUrl: newImageUrl })
    }
  }

  const handleSpecialtiesUpdated = (newSpecialties: string[]) => {
    // Update vendor state with new specialties
    if (vendor) {
      setVendor({ ...vendor, specialties: newSpecialties })
    }
  }

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#120727] bg-opacity-10 mr-4">
              <DollarSign size={24} className="text-[#120727]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">${dashboardStats.totalEarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Events</p>
              <p className="text-2xl font-bold">{dashboardStats.completedEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-bold">{dashboardStats.upcomingEvents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Offers Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Offers</p>
              <p className="text-2xl font-bold">{dashboardStats.pendingOffers}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Accepted Offers</p>
              <p className="text-2xl font-bold">{dashboardStats.acceptedOffers}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Offers</p>
              <p className="text-2xl font-bold">{dashboardStats.totalOffers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="offers" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="offers">Manage Offers</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <VendorOffers />
        </TabsContent>

        <TabsContent value="calendar">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Event Calendar</h2>
            <p className="text-gray-500">Calendar view will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <p className="text-gray-500"><VendorChatList /></p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div className="border-b pb-8">
                <VendorImageUpload
                  vendorId={user.id}
                  currentImageUrl={vendor?.imageUrl}
                  onImageUpdated={handleImageUpdated}
                />
              </div>

              {/* Specialties Section */}
              <div>
                <VendorSpecialtySelector
                  vendorId={user.id}
                  currentSpecialties={vendor?.specialties || []}
                  onSpecialtiesUpdated={handleSpecialtiesUpdated}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default VendorDashboard
