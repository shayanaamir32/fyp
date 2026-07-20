"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, DollarSign, MapPin, Send } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { sendOffer } from "@/services/offer"


function SendOffer() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const user = JSON.parse(localStorage.getItem('auth') as string)

  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    eventLocation: "",
    budget: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        user: user.id,
        vendor: vendorId,
        eventType: formData.eventType,
        eventDate: new Date(formData.eventDate).toISOString(), // Ensure ISO format
        budget: Number(formData.budget),
        location: formData.eventLocation,
        description: formData.description,
      }

      await sendOffer(payload) // Assumes sendOffer is already hooked to your API

      alert("Your offer has been sent to the vendor!")
      navigate(`/vendor/${vendorId}`)
    } catch (error) {
      console.error("Error sending offer:", error)
      alert("Failed to send offer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Send Offer to Vendor</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select an event type</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Other">Other</option>
            </select>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                Budget
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Your budget for this event"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Event Location
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                id="eventLocation"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                placeholder="Address or venue name"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event and what services you need from the vendor..."
              rows={5}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#120727] text-white hover:bg-[#1d0b3d]" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send size={18} className="mr-2" />
                  Send Offer
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SendOffer

