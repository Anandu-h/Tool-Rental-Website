"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Upload, FileImage, CheckCircle, AlertCircle, Cloud } from "lucide-react"
import { greenfieldClient, type UploadResult } from "@/lib/greenfield-storage"

interface GreenfieldUploadProps {
  onUploadComplete?: (result: UploadResult) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  className?: string
}

export function GreenfieldUpload({
  onUploadComplete,
  acceptedTypes = ["image/*"],
  maxSize = 10,
  className = "",
}: GreenfieldUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    // Validate file type
    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.replace("/*", "/"))
      }
      return file.type === type
    })

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: `Please select a file of type: ${acceptedTypes.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    uploadToGreenfield(file)
  }

  const uploadToGreenfield = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await greenfieldClient.uploadFile(file)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadResult(result)

      if (result.success) {
        toast({
          title: "Upload Successful!",
          description: "File uploaded to BNB Greenfield",
        })
        onUploadComplete?.(result)
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload to Greenfield",
        variant: "destructive",
      })
      setUploadResult({
        success: false,
        error: "Upload failed",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <Card className={`bg-[#181A20] border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[#F0B90B]" />
          BNB Greenfield Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver ? "border-[#F0B90B] bg-[#F0B90B]/5" : "border-gray-600 hover:border-[#F0B90B]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-[#F0B90B] mx-auto animate-bounce" />
              <div>
                <p className="text-white font-medium">Uploading to Greenfield...</p>
                <Progress value={uploadProgress} className="mt-2" />
                <p className="text-gray-400 text-sm mt-1">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : uploadResult ? (
            <div className="space-y-4">
              {uploadResult.success ? (
                <>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-white font-medium">Upload Successful!</p>
                    <p className="text-gray-400 text-sm">File stored on BNB Greenfield</p>
                    {uploadResult.hash && (
                      <Badge className="mt-2 bg-green-500/10 text-green-400 border-green-500/20">
                        Hash: {uploadResult.hash.substring(0, 16)}...
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <div>
                    <p className="text-white font-medium">Upload Failed</p>
                    <p className="text-gray-400 text-sm">{uploadResult.error}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <FileImage className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-white font-medium">Drop files here or click to browse</p>
                <p className="text-gray-400 text-sm">
                  Supports {acceptedTypes.join(", ")} up to {maxSize}MB
                </p>
                <p className="text-[#F0B90B] text-xs mt-2">
                  Files will be stored on BNB Greenfield decentralized storage
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 bg-[#F0B90B] text-black hover:bg-[#D4A017]"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select File
          </Button>
          {uploadResult && (
            <Button
              onClick={() => {
                setUploadResult(null)
                setUploadProgress(0)
              }}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Greenfield Info */}
        <div className="bg-[#0B0E11] rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-[#F0B90B]" />
            <span className="text-white text-sm font-medium">BNB Greenfield Storage</span>
          </div>
          <p className="text-gray-400 text-xs">
            Your files are stored on BNB Greenfield, a decentralized storage network that ensures data availability,
            integrity, and censorship resistance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
