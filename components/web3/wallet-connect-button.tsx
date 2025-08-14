"use client"

import { Button } from "@/components/ui/button"
import { Wallet, Loader2, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/web3/wallet"
import { useState } from "react"

interface WalletConnectButtonProps {
  onConnect?: (address: string) => void
  className?: string
}

export default function WalletConnectButton({ onConnect, className }: WalletConnectButtonProps) {
  const { wallet, isConnecting, error, connectWallet, disconnectWallet } = useWallet()
  const [showOptions, setShowOptions] = useState(false)

  const handleConnect = async (type: "metamask" | "phantom") => {
    await connectWallet(type)
    setShowOptions(false)
    if (wallet?.address && onConnect) {
      onConnect(wallet.address)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (wallet) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-emerald-400 font-medium text-sm">
                  {wallet.type === "metamask" ? "MetaMask" : "Phantom"}
                </p>
                <p className="text-emerald-300 text-xs">{formatAddress(wallet.address)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 text-sm font-medium">
                {wallet.balance} {wallet.type === "metamask" ? "ETH" : "SOL"}
              </p>
              <p className="text-emerald-300 text-xs">{wallet.network}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
        >
          Disconnect Wallet
        </Button>
      </div>
    )
  }

  if (showOptions) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-center">
          <p className="text-slate-300 text-sm mb-3">Choose your wallet:</p>
        </div>

        <Button
          onClick={() => handleConnect("metamask")}
          disabled={isConnecting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <img src="/metamask-logo.png" alt="MetaMask" className="w-5 h-5 mr-2" />
          )}
          Connect MetaMask
        </Button>

        <Button
          onClick={() => handleConnect("phantom")}
          disabled={isConnecting}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
        >
          {isConnecting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <img src="/phantom-wallet-logo.png" alt="Phantom" className="w-5 h-5 mr-2" />
          )}
          Connect Phantom
        </Button>

        <Button
          onClick={() => setShowOptions(false)}
          variant="outline"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
        >
          Cancel
        </Button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Button onClick={() => setShowOptions(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-400 mb-1">Don't have a wallet?</p>
        <div className="flex justify-center space-x-4 text-xs">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 flex items-center"
          >
            Get MetaMask <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 flex items-center"
          >
            Get Phantom <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  )
}
