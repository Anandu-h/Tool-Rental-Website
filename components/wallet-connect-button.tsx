"use client"

import { useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, ExternalLink, Download, Smartphone, Monitor } from "lucide-react"
import { SUPPORTED_WALLETS, detectInstalledWallets, isMobile } from "@/lib/web3-config"

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)
  const [installedWallets, setInstalledWallets] = useState<string[]>([])

  useEffect(() => {
    setInstalledWallets(detectInstalledWallets())
  }, [])

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setIsOpen(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Connected</Badge>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(address)}
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#F0B90B] text-black hover:bg-[#D4A017]">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#181A20] border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Connect Your Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Device Type Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            {isMobile() ? (
              <>
                <Smartphone className="w-4 h-4" />
                Mobile Device Detected
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4" />
                Desktop Device Detected
              </>
            )}
          </div>

          {/* Installed Wallets */}
          {installedWallets.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Installed Wallets</h3>
              <div className="space-y-2">
                {SUPPORTED_WALLETS.filter((wallet) => installedWallets.includes(wallet.id)).map((wallet) => (
                  <Card
                    key={wallet.id}
                    className="bg-[#0B0E11] border-gray-700 hover:border-[#F0B90B] transition-colors cursor-pointer"
                  >
                    <CardContent className="p-3">
                      <Button
                        onClick={() => handleConnect("injected")}
                        disabled={isPending}
                        className="w-full justify-start bg-transparent hover:bg-gray-700 text-white p-0 h-auto"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{wallet.icon}</span>
                          <div className="text-left">
                            <div className="font-medium">{wallet.name}</div>
                            <div className="text-xs text-gray-400">{wallet.description}</div>
                          </div>
                          <Badge className="ml-auto bg-green-500/10 text-green-400 border-green-500/20">
                            Installed
                          </Badge>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available Wallets to Download */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              {installedWallets.length > 0 ? "Other Wallets" : "Recommended Wallets"}
            </h3>
            <div className="space-y-2">
              {SUPPORTED_WALLETS.filter((wallet) => !installedWallets.includes(wallet.id)).map((wallet) => (
                <Card key={wallet.id} className="bg-[#0B0E11] border-gray-700">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{wallet.name}</div>
                        <div className="text-xs text-gray-400">{wallet.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          onClick={() => {
                            const url = isMobile() ? wallet.mobileDeepLink : wallet.downloadUrl
                            window.open(url, "_blank")
                          }}
                        >
                          {isMobile() ? (
                            <>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              Install
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* WalletConnect Option */}
          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={() => handleConnect("walletConnect")}
              disabled={isPending}
              className="w-full bg-[#3B99FC] hover:bg-[#2B89EC] text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              WalletConnect
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">Connect with 300+ wallets using WalletConnect</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
