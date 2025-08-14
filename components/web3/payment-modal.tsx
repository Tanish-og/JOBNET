"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, CheckCircle, XCircle } from "lucide-react"
import { useWallet } from "@/lib/web3/wallet"
import { processPayment, getPlatformFee } from "@/lib/web3/payments"
import type { PaymentResult } from "@/lib/web3/payments"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (transactionHash: string) => void
  title?: string
  description?: string
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Platform Fee Required",
  description = "A small platform fee is required to post this job.",
}: PaymentModalProps) {
  const { wallet } = useWallet()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<string>(wallet?.type === "phantom" ? "solana" : "ethereum")

  if (!isOpen) return null

  const handlePayment = async () => {
    if (!wallet) return

    setIsProcessing(true)
    setPaymentResult(null)

    try {
      const result = await processPayment(wallet, selectedNetwork)
      setPaymentResult(result)

      if (result.success && result.transactionHash) {
        setTimeout(() => {
          onSuccess(result.transactionHash!)
          onClose()
        }, 2000)
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        error: "Payment processing failed",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const fee = getPlatformFee(selectedNetwork)
  const currency = selectedNetwork === "solana" ? "SOL" : selectedNetwork === "polygon" ? "MATIC" : "ETH"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm">{description}</p>
        </div>

        {!paymentResult && (
          <>
            {/* Network Selection */}
            {wallet?.type === "metamask" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Network</label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-md px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="ethereum">Ethereum Mainnet</option>
                  <option value="polygon">Polygon Mainnet</option>
                </select>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Platform Fee:</span>
                <span className="text-white font-medium">
                  {fee} {currency}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Network:</span>
                <span className="text-white capitalize">{selectedNetwork}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Wallet:</span>
                <span className="text-white text-sm">
                  {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !wallet}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${fee} ${currency}`
                )}
              </Button>
            </div>
          </>
        )}

        {/* Payment Result */}
        {paymentResult && (
          <div className="text-center">
            {paymentResult.success ? (
              <>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Payment Successful!</h3>
                <p className="text-slate-400 text-sm mb-4">Your transaction has been confirmed.</p>
                {paymentResult.transactionHash && (
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-4">
                    <p className="text-xs text-slate-400 mb-1">Transaction Hash:</p>
                    <p className="text-xs text-white font-mono break-all">{paymentResult.transactionHash}</p>
                  </div>
                )}
                <p className="text-emerald-400 text-sm">Redirecting...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">Payment Failed</h3>
                <p className="text-slate-400 text-sm mb-4">{paymentResult.error}</p>
                <div className="flex space-x-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setPaymentResult(null)
                      setIsProcessing(false)
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
