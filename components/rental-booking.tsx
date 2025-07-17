"use client"

import { useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, Shield, MapPin } from "lucide-react"
import { format } from "date-fns"
import { TOOLCHAIN_CONTRACT_ADDRESS, TOOLCHAIN_ABI, type Tool } from "@/lib/contracts"

interface RentalBookingProps {
  tool: Tool
  onClose: () => void
}

export function RentalBooking({ tool, onClose }: RentalBookingProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [days, setDays] = useState(1)

  const calculateTotal = () => {
    return (Number.parseFloat(tool.pricePerDay) * days).toFixed(3)
  }

  const calculateDeposit = () => {
    return (Number.parseFloat(tool.pricePerDay) * days * 0.2).toFixed(3) // 20% deposit
  }

  const handleRent = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to rent this tool",
        variant: "destructive",
      })
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Select Dates",
        description: "Please select start and end dates",
        variant: "destructive",
      })
      return
    }

    try {
      const totalPrice = parseEther(calculateTotal())
      const deposit = parseEther(calculateDeposit())

      await writeContract({
        address: TOOLCHAIN_CONTRACT_ADDRESS,
        abi: TOOLCHAIN_ABI,
        functionName: "rentTool",
        args: [BigInt(tool.id), BigInt(days)],
        value: totalPrice + deposit, // Total payment + deposit
      })

      toast({
        title: "Rental Confirmed!",
        description: "Your rental has been processed successfully",
      })

      onClose()
    } catch (error) {
      console.error("Error renting tool:", error)
      toast({
        title: "Error",
        description: "Failed to rent tool. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-[#181A20] border-gray-700 max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-white">Rent {tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tool Info */}
        <div className="flex items-center space-x-4">
          <img
            src={tool.imageUrl || "/placeholder.svg"}
            alt={tool.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-white font-semibold">{tool.name}</h3>
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {tool.location}
            </div>
            <div className="text-[#F0B90B] font-bold">{tool.pricePerDay} BNB/day</div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[#0B0E11] border-gray-700 text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#181A20] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-white">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[#0B0E11] border-gray-700 text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#181A20] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="days" className="text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Number of Days
            </Label>
            <Input
              id="days"
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(Number.parseInt(e.target.value) || 1)}
              className="bg-[#0B0E11] border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 p-4 bg-[#0B0E11] rounded-lg">
          <div className="flex justify-between text-gray-300">
            <span>Rental ({days} days)</span>
            <span>{calculateTotal()} BNB</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Security Deposit (20%)
            </span>
            <span>{calculateDeposit()} BNB</span>
          </div>
          <div className="border-t border-gray-600 pt-2">
            <div className="flex justify-between text-white font-bold">
              <span>Total</span>
              <span className="text-[#F0B90B]">
                {(Number.parseFloat(calculateTotal()) + Number.parseFloat(calculateDeposit())).toFixed(3)} BNB
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-gray-300 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleRent}
            disabled={!isConnected || isPending || isConfirming || !startDate || !endDate}
            className="flex-1 bg-[#F0B90B] text-black hover:bg-[#D4A017]"
          >
            {isPending || isConfirming ? "Processing..." : "Confirm Rental"}
          </Button>
        </div>

        {!isConnected && (
          <div className="text-center">
            <Badge variant="outline" className="border-red-500 text-red-400">
              Connect your wallet to rent
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
