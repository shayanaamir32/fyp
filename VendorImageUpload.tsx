import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "./ui/button"
import { getCloudinaryImage } from "@/services/cloudinary"
import { updateVendorImage } from "@/services/vendor"

interface VendorImageUploadProps {
  vendorId: string
  currentImageUrl?: string
  onImageUpdated?: (newImageUrl: string) => void
}

export function VendorImageUpload({
  vendorId,
  currentImageUrl,
  onImageUpdated,
}: VendorImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setSelectedFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first")
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Upload to Cloudinary
      const imageUrl = await getCloudinaryImage(selectedFile)

      // Update vendor image in database
      await updateVendorImage(vendorId, imageUrl)

      // Clear state
      setSelectedFile(null)
      onImageUpdated?.(imageUrl)
      setPreview(imageUrl)
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreview(null)
    setError(null)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Change Vendor Image</h3>

      {/* Image Preview */}
      <div className="mb-4 relative">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No image selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* File Input */}
      <label className="block mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="block w-full py-2 px-4 bg-blue-50 border-2 border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-center text-blue-600"
        >
          {uploading ? "Uploading..." : "Select Image"}
        </label>
      </label>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="w-full bg-[#120727] text-white hover:bg-[#1d0b3d] disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  )
}
