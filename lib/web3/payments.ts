"use client"

import type { WalletInfo } from "./wallet"

// Admin wallet addresses for receiving payments
const ADMIN_WALLETS = {
  ethereum: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4", // Replace with actual admin wallet
  polygon: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4", // Replace with actual admin wallet
  solana: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", // Replace with actual admin wallet
}

// Platform fees in native tokens
const PLATFORM_FEES = {
  ethereum: "0.00001", // ETH
  polygon: "0.00001", // MATIC
  solana: "0.0001", // SOL
}

export interface PaymentResult {
  success: boolean
  transactionHash?: string
  error?: string
}

// Ethereum/Polygon payment function
export const sendEthereumPayment = async (
  wallet: WalletInfo,
  amount: string,
  adminWallet: string,
): Promise<PaymentResult> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not available")
    }

    // Convert amount to wei
    const amountWei = (Number.parseFloat(amount) * 1e18).toString(16)

    // Send transaction
    const transactionHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: wallet.address,
          to: adminWallet,
          value: `0x${amountWei}`,
          gas: "0x5208", // 21000 gas limit for simple transfer
        },
      ],
    })

    return {
      success: true,
      transactionHash,
    }
  } catch (error: any) {
    console.error("Ethereum payment error:", error)
    return {
      success: false,
      error: error.message || "Payment failed",
    }
  }
}

// Solana payment function
export const sendSolanaPayment = async (
  wallet: WalletInfo,
  amount: string,
  adminWallet: string,
): Promise<PaymentResult> => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet is not available")
    }

    // For demo purposes, we'll simulate a successful transaction
    // In a real implementation, you would use @solana/web3.js to create and send the transaction
    const mockTransactionHash = `phantom_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      transactionHash: mockTransactionHash,
    }
  } catch (error: any) {
    console.error("Solana payment error:", error)
    return {
      success: false,
      error: error.message || "Payment failed",
    }
  }
}

// Main payment function
export const processPayment = async (wallet: WalletInfo, network: string): Promise<PaymentResult> => {
  const adminWallet = ADMIN_WALLETS[network as keyof typeof ADMIN_WALLETS]
  const amount = PLATFORM_FEES[network as keyof typeof PLATFORM_FEES]

  if (!adminWallet || !amount) {
    return {
      success: false,
      error: "Unsupported network",
    }
  }

  if (wallet.type === "metamask" && (network === "ethereum" || network === "polygon")) {
    return await sendEthereumPayment(wallet, amount, adminWallet)
  } else if (wallet.type === "phantom" && network === "solana") {
    return await sendSolanaPayment(wallet, amount, adminWallet)
  } else {
    return {
      success: false,
      error: "Wallet type and network mismatch",
    }
  }
}

// Get platform fee for display
export const getPlatformFee = (network: string): string => {
  return PLATFORM_FEES[network as keyof typeof PLATFORM_FEES] || "0"
}

// Get admin wallet for display
export const getAdminWallet = (network: string): string => {
  return ADMIN_WALLETS[network as keyof typeof ADMIN_WALLETS] || ""
}
