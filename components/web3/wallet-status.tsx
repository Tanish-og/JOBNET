"use client"

import { useWallet } from "@/lib/web3/wallet"
import { Wallet, AlertCircle } from "lucide-react"

export default function WalletStatus() {
  const { wallet, error } = useWallet()

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-400">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Wallet Error</span>
      </div>
    )
  }

  if (wallet) {
    return (
      <div className="flex items-center space-x-2 text-emerald-400">
        <Wallet className="w-4 h-4" />
        <span className="text-sm">{wallet.type === "metamask" ? "MetaMask" : "Phantom"} Connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-slate-400">
      <Wallet className="w-4 h-4" />
      <span className="text-sm">No Wallet Connected</span>
    </div>
  )
}
