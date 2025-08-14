import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wallet, Shield, Zap } from "lucide-react"
import Link from "next/link"
import WalletConnectButton from "@/components/web3/wallet-connect-button"

export default async function WalletPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-white">Wallet Connection</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Wallet Connection */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">
              Connect your Web3 wallet to enable blockchain payments and access premium features.
            </p>

            <WalletConnectButton className="mb-6" />

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">Secure Connection</h3>
                  <p className="text-slate-400 text-sm">Your wallet connection is encrypted and secure</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">Fast Transactions</h3>
                  <p className="text-slate-400 text-sm">Quick and efficient blockchain payments</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Wallet className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">Multi-Chain Support</h3>
                  <p className="text-slate-400 text-sm">Support for Ethereum, Polygon, and Solana</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Why Connect Your Wallet?</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Post jobs with blockchain payment verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Receive payments directly to your wallet</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Access premium networking features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Verify your professional credentials on-chain</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-6">
              <h3 className="text-amber-400 font-medium mb-2">Platform Fees</h3>
              <p className="text-amber-300/80 text-sm mb-3">Small platform fees are required for certain actions:</p>
              <ul className="space-y-1 text-amber-300/80 text-sm">
                <li>• Job posting: 0.0001 SOL or 0.00001 ETH</li>
                <li>• Premium features: Variable based on usage</li>
                <li>• All fees go towards platform maintenance</li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
              <h3 className="text-blue-400 font-medium mb-2">Supported Networks</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-blue-300">
                  <strong>Ethereum:</strong>
                  <br />
                  Mainnet, Sepolia Testnet
                </div>
                <div className="text-blue-300">
                  <strong>Polygon:</strong>
                  <br />
                  Mainnet, Mumbai Testnet
                </div>
                <div className="text-blue-300 col-span-2">
                  <strong>Solana:</strong>
                  <br />
                  Mainnet, Devnet
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
