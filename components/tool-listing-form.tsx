"use client"

import type React from "react"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Upload, MapPin, DollarSign, Tag, ImageIcon } from "lucide-react"
import { TOOLCHAIN_CONTRACT_ADDRESS, TOOLCHAIN_ABI } from "@/lib/contracts"

interface ToolListingFormProps {
  onSuccess?: () => void
}

export function ToolListingForm({ onSuccess }: ToolListingFormProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerDay: "",
    category: "",
    location: "",
    imageUrl: "",
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const categories = ["Power Tools", "Hand Tools", "Garden Tools", "Automotive", "Home & DIY", "Specialty Tools"]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, imageUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to list a tool",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.description || !formData.pricePerDay || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const priceInWei = parseEther(formData.pricePerDay)

      await writeContract({
        address: TOOLCHAIN_CONTRACT_ADDRESS,
        abi: TOOLCHAIN_ABI,
        functionName: "listTool",
        args: [
          formData.name,
          formData.description,
          priceInWei,
          formData.category,
          formData.imageUrl || "/placeholder.svg?height=300&width=400",
        ],
      })

      toast({
        title: "Tool Listed Successfully!",
        description: "Your tool has been added to the marketplace",
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        pricePerDay: "",
        category: "",
        location: "",
        imageUrl: "",
      })
      setImageFile(null)
      setImagePreview("")

      onSuccess?.()
    } catch (error) {
      console.error("Error listing tool:", error)
      toast({
        title: "Error",
        description: "Failed to list tool. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-[#181A20] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#F0B90B]" />
          List Your Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Tool Image</Label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#F0B90B] transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Tool preview"
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImagePreview("")
                      setImageFile(null)
                      setFormData((prev) => ({ ...prev, imageUrl: "" }))
                    }}
                    className="border-gray-600 text-gray-300"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <Label htmlFor="image-upload" className="cursor-pointer text-[#F0B90B] hover:text-[#D4A017]">
                      Click to upload image
                    </Label>
                    <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tool Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Tool Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., DeWalt Cordless Drill"
              className="bg-[#0B0E11] border-gray-700 text-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your tool, its condition, and any special features..."
              className="bg-[#0B0E11] border-gray-700 text-white min-h-[100px]"
              required
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price per Day (BNB) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                value={formData.pricePerDay}
                onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                placeholder="0.05"
                className="bg-[#0B0E11] border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-[#0B0E11] border-gray-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#181A20] border-gray-700">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Downtown, City Center"
              className="bg-[#0B0E11] border-gray-700 text-white"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isConnected || isPending || isConfirming}
            className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017] h-12"
          >
            {isPending || isConfirming ? "Listing Tool..." : "List Tool on Marketplace"}
          </Button>

          {!isConnected && (
            <div className="text-center">
              <Badge variant="outline" className="border-red-500 text-red-400">
                Connect your wallet to list tools
              </Badge>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
