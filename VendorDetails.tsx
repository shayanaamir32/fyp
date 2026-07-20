"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, MapPin, Phone, MessageCircle, ArrowLeft, Send } from "lucide-react"
import { Button } from "./ui/button"
import { getVendor } from "@/services/vendor"

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

interface Vendor {
  _id: string
  businessName: string
  address: string
  phoneNumber: string
  email: string
  averageRating: number
  reviewCount: number
  portfolioImages?: string[] // Optional for future API updates
  reviews?: Review[] // Optional if not implemented yet
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}

function VendorDetails() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    if (!vendorId) return
    getVendor(vendorId).then((data) => setVendor(data)).catch(console.error)
  }, [vendorId])

  if (!vendor) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate(-1)} className="mb-4 flex items-center text-[#120727]" variant="ghost">
        <ArrowLeft size={20} className="mr-2" />
        Back to Vendors
      </Button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={"https://source.unsplash.com/random/800x600?business"} // Fallback image
          alt={vendor.businessName}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{vendor.businessName}</h1>

          <div className="flex items-center mb-4">
            <StarRating rating={vendor.averageRating} />
            <span className="ml-2 text-gray-600">
              {vendor.averageRating?.toFixed(1) ?? "0.0"} ({vendor.reviewCount ?? 0} reviews)
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={18} className="mr-2" />
            <span>{vendor.address}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <Phone size={18} className="mr-2" />
            <span>{vendor.phoneNumber}</span>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => navigate(`/chat/${vendor._id}`)}
              className="bg-[#120727] text-white hover:bg-[#1d0b3d] transition-colors"
            >
              <MessageCircle size={20} className="mr-2" />
              Chat with Vendor
            </Button>
            <Button
              onClick={() => navigate(`/send-offer/${vendor._id}`)}
              className="bg-[#120727] text-white hover:bg-[#1d0b3d] transition-colors"
            >
              <Send size={20} className="mr-2" />
              Send Offer
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Section (future-ready) */}
      {vendor.portfolioImages && vendor.portfolioImages.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendor.portfolioImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Portfolio ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </>
      )}

      {/* Placeholder or fallback if portfolioImages not yet available */}
      {!vendor.portfolioImages && (
        <div className="text-gray-500 italic mt-6">Portfolio section coming soon.</div>
      )}

      {/* Reviews (optional for now) */}
      {vendor.reviews && vendor.reviews.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mt-8 mb-4">Reviews</h2>
          <div className="space-y-4">
            {vendor.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.author}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-700 mb-2">{review.comment}</p>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default VendorDetails
