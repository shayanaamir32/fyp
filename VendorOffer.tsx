"use client"

import { useEffect, useState } from "react"
import {
  Check,
  X,
  Calendar,
  Clock,
  DollarSign,
  User,
  Filter,
  MessageCircle,
  CheckCircle,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useNavigate } from "react-router-dom"
import { vendorRecivedOffers } from "@/services/vendor"
import { changeOfferStatus } from "@/services/offer"

interface Offer {
  _id: string
  userName: string
  userEmail: string
  user: string
  eventType: string
  eventDate: string
  eventLocation: string
  budget: number
  description: string
  status: "Pending" | "Accepted" | "Rejected" | "Completed" | "Working"
  createdAt: string
}

function VendorOffers() {
  const [offers, setOffers] = useState<Offer[]>()
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("auth") as string)

  useEffect(() => {
    async function fetch() {
      const res = await vendorRecivedOffers(user.id)
      setOffers(res)
    }
    fetch()
  }, [])

  const handleAcceptOffer = async (offerId: string) => {
    console.log(offerId, "id is")
    try {
      await changeOfferStatus(offerId, "Accepted")
      setOffers((prev) =>
        prev!.map((offer) =>
          offer._id === offerId ? { ...offer, status: "Accepted" } : offer,
        ),
      )
    } catch (error) {
      console.error("Failed to accept offer:", error)
    }
  }

  const handleRejectOffer = async (offerId: string) => {
    try {
      await changeOfferStatus(offerId, "Rejected")
      setOffers((prev) =>
        prev!.map((offer) =>
          offer._id === offerId ? { ...offer, status: "Rejected" } : offer,
        ),
      )
    } catch (error) {
      console.error("Failed to reject offer:", error)
    }
  }

  const handleCompleteOffer = async (offerId: string) => {
    try {
      await changeOfferStatus(offerId, "Completed")
      setOffers((prev) =>
        prev!.map((offer) =>
          offer._id === offerId ? { ...offer, status: "Completed" } : offer,
        ),
      )
    } catch (error) {
      console.error("Failed to complete offer:", error)
    }
  }

  const handleChatWithUser = (user: string) => {
    console.log(user, "userId is")
    navigate(`/chat/${user}`)
  }

  const filteredOffers = offers?.filter((offer) => {
    const matchesStatus =
      filterStatus === "all" || offer.status.toLowerCase() === filterStatus
    const matchesSearch =
      offer.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Offers</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center">
          <Filter size={20} className="mr-2 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="all">All Offers</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search by event type or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredOffers?.map((offer) => (
          <div
            key={offer._id}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${offer.status === "Pending"
              ? "border-yellow-500"
              : offer.status === "Accepted"
                ? "border-green-500"
                : offer.status === "Completed"
                  ? "border-blue-500"
                  : "border-red-500"
              }`}
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{offer.eventType}</h2>
                <div className="flex items-center mt-1">
                  <User size={16} className="mr-1 text-gray-500" />
                  <span className="text-gray-700">{offer.userName}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <a
                    href={`mailto:${offer.userEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {offer.userEmail}
                  </a>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                {offer.status === "Pending" ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleAcceptOffer(offer._id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check size={18} className="mr-1" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRejectOffer(offer._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <X size={18} className="mr-1" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${offer.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : offer.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                      }`}
                  >
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-gray-500" />
                <span>
                  <span className="text-gray-500 mr-1">Date:</span>
                  {new Date(offer.eventDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign size={18} className="mr-2 text-gray-500" />
                <span>
                  <span className="text-gray-500 mr-1">Budget:</span>$
                  {offer.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-gray-500" />
                <span>
                  <span className="text-gray-500 mr-1">Received:</span>
                  {new Date(offer.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Location</h3>
              <p className="text-gray-700">{offer.eventLocation}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700">{offer.description}</p>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                onClick={() =>
                  handleChatWithUser(offer.user._id)
                }
                className="bg-[#120727] hover:bg-[#1d0b3d]"
              >
                <MessageCircle size={18} className="mr-2" />
                Chat with Client
              </Button>

              {offer.status === "Accepted" && (
                <Button
                  onClick={() => handleCompleteOffer(offer._id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle size={18} className="mr-2" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        ))}

        {filteredOffers?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No offers found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorOffers
