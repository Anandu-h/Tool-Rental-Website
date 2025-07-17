"use client"

import { useState } from "react"
import {
  Wrench,
  Shield,
  Zap,
  Users,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Search,
  Filter,
  Hammer,
  WrenchIcon as Screwdriver,
  Scissors,
  Car,
  Home,
  Leaf,
  Menu,
  X,
  Plus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { NetworkStatus } from "@/components/network-status"
import { ToolListingForm } from "@/components/tool-listing-form"
import { UserDashboard } from "@/components/user-dashboard"
import { RentalBooking } from "@/components/rental-booking"
import type { Tool } from "@/lib/contracts"

type ViewMode = "marketplace" | "list-tool" | "dashboard" | "rental"

export default function Component() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewMode>("marketplace")
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  const handleRentTool = (tool: Tool) => {
    setSelectedTool(tool)
    setCurrentView("rental")
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "list-tool":
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <ToolListingForm onSuccess={() => setCurrentView("dashboard")} />
            </div>
          </div>
        )
      case "dashboard":
        return (
          <div className="container mx-auto px-4 py-8">
            <UserDashboard />
          </div>
        )
      case "rental":
        return selectedTool ? (
          <div className="container mx-auto px-4 py-8">
            <RentalBooking tool={selectedTool} onClose={() => setCurrentView("marketplace")} />
          </div>
        ) : null
      default:
        return <MarketplaceView onRentTool={handleRentTool} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#181A20]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#F0B90B] rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">ToolChain</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentView("marketplace")}
                className={`transition-colors ${currentView === "marketplace" ? "text-[#F0B90B]" : "text-gray-300 hover:text-[#F0B90B]"}`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`transition-colors ${currentView === "dashboard" ? "text-[#F0B90B]" : "text-gray-300 hover:text-[#F0B90B]"}`}
              >
                Dashboard
              </button>
              <Link href="#" className="text-gray-300 hover:text-[#F0B90B] transition-colors">
                Community
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#F0B90B] transition-colors">
                Rewards
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <NetworkStatus />
              <WalletConnectButton />
              <Button
                onClick={() => setCurrentView("list-tool")}
                className="bg-[#F0B90B] text-black hover:bg-[#D4A017]"
              >
                <Plus className="w-4 h-4 mr-2" />
                List Tool
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181A20] border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button
              onClick={() => {
                setCurrentView("marketplace")
                setMobileMenuOpen(false)
              }}
              className="block text-gray-300 hover:text-[#F0B90B]"
            >
              Marketplace
            </button>
            <button
              onClick={() => {
                setCurrentView("dashboard")
                setMobileMenuOpen(false)
              }}
              className="block text-gray-300 hover:text-[#F0B90B]"
            >
              Dashboard
            </button>
            <Link href="#" className="block text-gray-300 hover:text-[#F0B90B]">
              Community
            </Link>
            <Link href="#" className="block text-gray-300 hover:text-[#F0B90B]">
              Rewards
            </Link>
            <div className="pt-4 space-y-2">
              <div className="flex justify-center mb-2">
                <NetworkStatus />
              </div>
              <WalletConnectButton />
              <Button
                onClick={() => {
                  setCurrentView("list-tool")
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017]"
              >
                List Tool
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderCurrentView()}
    </div>
  )
}

// Marketplace View Component
function MarketplaceView({ onRentTool }: { onRentTool: (tool: Tool) => void }) {
  const featuredTools: Tool[] = [
    {
      id: 1,
      name: "DeWalt Cordless Drill",
      description: "Professional grade cordless drill with 2 batteries",
      pricePerDay: "0.05",
      category: "Power Tools",
      imageUrl: "/placeholder.svg?height=200&width=300",
      owner: "0x1234...5678",
      isAvailable: true,
      location: "2.3 km away",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Pressure Washer 3000 PSI",
      description: "High-performance pressure washer for outdoor cleaning",
      pricePerDay: "0.12",
      category: "Garden Tools",
      imageUrl: "/placeholder.svg?height=200&width=300",
      owner: "0x9876...4321",
      isAvailable: true,
      location: "1.8 km away",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Circular Saw Professional",
      description: "Professional circular saw for wood cutting projects",
      pricePerDay: "0.08",
      category: "Power Tools",
      imageUrl: "/placeholder.svg?height=200&width=300",
      owner: "0x5555...9999",
      isAvailable: false,
      location: "3.1 km away",
      rating: 4.7,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#0B0E11] via-[#181A20] to-[#0B0E11]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-[#F0B90B]/10 text-[#F0B90B] border-[#F0B90B]/20">
              Powered by BNB Chain • DePIN + DeSoc
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Unlock the Power of
              <span className="text-[#F0B90B]"> Shared Tools</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The first decentralized marketplace for tool rentals. Earn from idle equipment, access tools when you need
              them, all secured by blockchain and IoT smart locks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#F0B90B] text-black hover:bg-[#D4A017] px-8">
                Start Renting
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black px-8 bg-transparent"
              >
                List Your Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-[#181A20]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for tools, equipment..."
                  className="pl-10 bg-[#0B0E11] border-gray-700 text-white placeholder-gray-400 h-12"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location"
                  className="pl-10 bg-[#0B0E11] border-gray-700 text-white placeholder-gray-400 h-12 md:w-48"
                />
              </div>
              <Button className="bg-[#F0B90B] text-black hover:bg-[#D4A017] h-12 px-8">
                <Filter className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Screwdriver, name: "Power Tools", count: "1,234" },
              { icon: Hammer, name: "Hand Tools", count: "856" },
              { icon: Leaf, name: "Garden", count: "642" },
              { icon: Car, name: "Automotive", count: "423" },
              { icon: Home, name: "Home & DIY", count: "789" },
              { icon: Scissors, name: "Specialty", count: "321" },
            ].map((category, index) => (
              <Card
                key={index}
                className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <category.icon className="w-8 h-8 text-[#F0B90B] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                  <p className="text-gray-400 text-sm">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Tools</h2>
            <Button
              variant="outline"
              className="border-[#F0B90B] text-[#F0B90B] hover:bg-[#F0B90B] hover:text-black bg-transparent"
            >
              View All
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <Card
                key={tool.id}
                className="bg-[#181A20] border-gray-700 hover:border-[#F0B90B] transition-colors overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={tool.imageUrl || "/placeholder.svg"}
                    alt={tool.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      tool.isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {tool.isAvailable ? "Available" : "Rented"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#F0B90B] font-bold">{tool.pricePerDay} BNB/day</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-[#F0B90B] fill-current mr-1" />
                      <span className="text-gray-300 text-sm">{tool.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {tool.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-xs bg-[#F0B90B] text-black">
                          {tool.owner.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-300 text-sm">
                        {tool.owner.slice(0, 6)}...{tool.owner.slice(-4)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#F0B90B] text-black hover:bg-[#D4A017]"
                      disabled={!tool.isAvailable}
                      onClick={() => onRentTool(tool)}
                    >
                      {tool.isAvailable ? "Rent Now" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DePIN Features */}
      <section className="py-16 bg-[#181A20]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">DePIN-Powered Infrastructure</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our decentralized physical infrastructure network ensures security, transparency, and efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#0B0E11] border-gray-700">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Smart Lock Security</h3>
                <p className="text-gray-400 text-sm">
                  IoT modules with blockchain verification ensure only authorized users can access tools
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0B0E11] border-gray-700">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Real-time Tracking</h3>
                <p className="text-gray-400 text-sm">
                  Monitor tool location, usage, and condition in real-time through our network
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0B0E11] border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Community Governance</h3>
                <p className="text-gray-400 text-sm">
                  Decentralized decision-making through token holders and community voting
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0B0E11] border-gray-700">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-[#F0B90B] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Automated Payments</h3>
                <p className="text-gray-400 text-sm">
                  Smart contracts handle deposits, payments, and rewards automatically
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] mb-2">12,500+</div>
              <div className="text-gray-300">Tools Listed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] mb-2">8,200+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] mb-2">45,000+</div>
              <div className="text-gray-300">Successful Rentals</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-[#F0B90B] mb-2">$2.3M+</div>
              <div className="text-gray-300">Total Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#F0B90B] to-[#D4A017]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Ready to Join the Tool Revolution?</h2>
          <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
            Start earning from your idle tools or access the equipment you need. Join thousands of users building the
            future of shared economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WalletConnectButton />
            <Button
              size="lg"
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-[#F0B90B] px-8 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#181A20] border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#F0B90B] rounded-full flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">ToolChain</span>
              </div>
              <p className="text-gray-400 mb-4">
                The decentralized marketplace for tool rentals, powered by BNB Chain.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    List Tools
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Rent Tools
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#F0B90B]">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ToolChain. Built on BNB Chain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
