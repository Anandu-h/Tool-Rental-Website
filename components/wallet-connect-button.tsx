"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi"
import { bsc } from "wagmi/chains"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, AlertTriangle, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function WalletConnectButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { data: balance } = useBalance({
    address: address,
  })

  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true)
      await connect({ connector })
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your wallet",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const switchToBSC = () => {
    switchChain({ chainId: bsc.id })
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance: any) => {
    if (!balance) return "0.00"
    return Number.parseFloat(balance.formatted).toFixed(4)
  }

  const isWrongNetwork = chain && chain.id !== bsc.id && chain.id !== 97 // BSC Testnet

  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-[#F0B90B] hover:bg-gray-800"
            disabled={isPending || isConnecting}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isPending || isConnecting ? "Connecting..." : "Connect Wallet"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#181A20] border-gray-700">
          <div className="p-2">
            <p className="text-sm text-gray-400 mb-2">Choose a wallet to connect:</p>
            {connectors.map((connector) => (
              <DropdownMenuItem
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                className="flex items-center p-2 hover:bg-gray-700 cursor-pointer text-white"
                disabled={isPending || isConnecting}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {connector.name}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-[#F0B90B] hover:bg-gray-800 flex items-center gap-2"
        >
          <div className="flex items-center gap-2">
            {isWrongNetwork ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span>{formatAddress(address!)}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-[#181A20] border-gray-700">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Connected Wallet</span>
            {isWrongNetwork ? (
              <Badge variant="destructive" className="text-xs">
                Wrong Network
              </Badge>
            ) : (
              <Badge className="text-xs bg-green-500 text-white">Connected</Badge>
            )}
          </div>

          <div className="mb-3">
            <p className="text-white font-mono text-sm">{formatAddress(address!)}</p>
            <p className="text-gray-400 text-xs mt-1">
              {balance ? `${formatBalance(balance)} ${balance.symbol}` : "Loading..."}
            </p>
          </div>

          {isWrongNetwork && (
            <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
              <p className="text-red-400 text-xs mb-2">Please switch to BNB Smart Chain</p>
              <Button size="sm" onClick={switchToBSC} className="w-full bg-[#F0B90B] text-black hover:bg-[#D4A017]">
                Switch to BSC
              </Button>
            </div>
          )}

          <div className="space-y-1">
            <DropdownMenuItem
              onClick={copyAddress}
              className="flex items-center p-2 hover:bg-gray-700 cursor-pointer text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => window.open(`https://bscscan.com/address/${address}`, "_blank")}
              className="flex items-center p-2 hover:bg-gray-700 cursor-pointer text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on BSCScan
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-gray-700" />

            <DropdownMenuItem
              onClick={handleDisconnect}
              className="flex items-center p-2 hover:bg-gray-700 cursor-pointer text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
