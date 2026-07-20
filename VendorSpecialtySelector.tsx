import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Button } from "./ui/button"
import { updateVendorSpecialties } from "@/services/vendor"

interface VendorSpecialtySelectorProps {
  vendorId: string
  currentSpecialties?: string[]
  onSpecialtiesUpdated?: (newSpecialties: string[]) => void
}

const PREDEFINED_SPECIALTIES = [
  "Wedding Specialist",
  "Birthday Specialist",
  "Corporate Events",
  "Anniversary Specialist",
  "Baby Shower Specialist",
  "Decoration",
  "Catering",
  "Entertainment",
  "Photography",
  "Venue Management",
  "Event Planning",
  "Consulting",
]

export function VendorSpecialtySelector({
  vendorId,
  currentSpecialties = [],
  onSpecialtiesUpdated,
}: VendorSpecialtySelectorProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    currentSpecialties
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
    setSuccess(false)
  }

  const handleSave = async () => {
    if (selectedSpecialties.length === 0) {
      setError("Please select at least one specialty")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      await updateVendorSpecialties(vendorId, selectedSpecialties)

      setSuccess(true)
      onSpecialtiesUpdated?.(selectedSpecialties)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to update specialties. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">My Specialties</h3>
      <p className="text-sm text-gray-600 mb-6">
        Select your specialties to help customers find you. Your primary specialty
        (first selected) will be displayed in the vendor listing.
      </p>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded">{error}</div>}

      {/* Success Message */}
      {success && (
        <div className="text-green-500 text-sm mb-4 bg-green-50 p-3 rounded">
          ✓ Specialties updated successfully!
        </div>
      )}

      {/* Specialty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {PREDEFINED_SPECIALTIES.map((specialty) => (
          <button
            key={specialty}
            onClick={() => toggleSpecialty(specialty)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedSpecialties.includes(specialty)
                ? "border-[#120727] bg-[#120727] bg-opacity-10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-medium ${
                  selectedSpecialties.includes(specialty)
                    ? "text-[#120727]"
                    : "text-gray-700"
                }`}
              >
                {specialty}
              </span>
              {selectedSpecialties.includes(specialty) && (
                <Check size={20} className="text-[#120727]" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Count */}
      {selectedSpecialties.length > 0 && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>{selectedSpecialties.length}</strong> specialt
            {selectedSpecialties.length === 1 ? "y" : "ies"} selected
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedSpecialties.map((specialty, index) => (
              <span
                key={specialty}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  index === 0
                    ? "bg-[#120727] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {specialty}
                {index === 0 && " (Primary)"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={loading || selectedSpecialties.length === 0}
        className="w-full bg-[#120727] text-white hover:bg-[#1d0b3d] disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save Specialties"}
      </Button>
    </div>
  )
}
