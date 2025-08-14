"use client"

import { useState, useEffect } from "react"

export interface WalletInfo {
  address: string
  balance: string
  network: string
  type: "metamask" | "phantom"
}

// MetaMask/Ethereum wallet functions
export const connectMetaMask = async (): Promise<WalletInfo | null> => {
  if (typeof window === "undefined") return null

  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    if (accounts.length === 0) {
      throw new Error("No accounts found")
    }

    // Get balance
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    })

    // Get network
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    })

    const networkNames: { [key: string]: string } = {
      "0x1": "Ethereum Mainnet",
      "0x89": "Polygon Mainnet",
      "0x13881": "Polygon Mumbai Testnet",
      "0xaa36a7": "Ethereum Sepolia Testnet",
    }

    return {
      address: accounts[0],
      balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
      network: networkNames[chainId] || `Unknown (${chainId})`,
      type: "metamask",
    }
  } catch (error) {
    console.error("MetaMask connection error:", error)
    throw error
  }
}

// Phantom/Solana wallet functions
export const connectPhantom = async (): Promise<WalletInfo | null> => {
  if (typeof window === "undefined") return null

  try {
    // Check if Phantom is installed
    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet is not installed")
    }

    // Connect to Phantom
    const response = await window.solana.connect()
    const publicKey = response.publicKey.toString()

    // Get balance (this would require a Solana RPC connection in a real app)
    // For demo purposes, we'll show 0
    const balance = "0.0000"

    return {
      address: publicKey,
      balance,
      network: "Solana Devnet",
      type: "phantom",
    }
  } catch (error) {
    console.error("Phantom connection error:", error)
    throw error
  }
}

// Hook for wallet connection
export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = async (type: "metamask" | "phantom") => {
    setIsConnecting(true)
    setError(null)

    try {
      let walletInfo: WalletInfo | null = null

      if (type === "metamask") {
        walletInfo = await connectMetaMask()
      } else if (type === "phantom") {
        walletInfo = await connectPhantom()
      }

      if (walletInfo) {
        setWallet(walletInfo)
        // Store in localStorage for persistence
        localStorage.setItem("connectedWallet", JSON.stringify(walletInfo))
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setError(null)
    localStorage.removeItem("connectedWallet")
  }

  // Check for existing connection on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      try {
        setWallet(JSON.parse(savedWallet))
      } catch (error) {
        console.error("Error parsing saved wallet:", error)
        localStorage.removeItem("connectedWallet")
      }
    }
  }, [])

  return {
    wallet,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  }
}

// Type declarations for window objects
declare global {
  interface Window {
    ethereum?: any
    solana?: any
  }
}
