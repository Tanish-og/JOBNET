"use client"

import type React from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"
import { useState, useRef } from "react"
import { postJob } from "@/lib/actions"
import PaymentModal from "@/components/web3/payment-modal"
import { useWallet } from "@/lib/web3/wallet"

interface JobPostFormProps {
  hasWallet: boolean
}

function SubmitButton({
  hasWallet,
  onPaymentRequired,
}: {
  hasWallet: boolean
  onPaymentRequired: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="button"
      onClick={(e) => onPaymentRequired(e)}
      disabled={pending || !hasWallet}
      className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Posting Job...
        </>
      ) : (
        "Review & Pay Fee"
      )}
    </Button>
  )
}

export default function JobPostForm({ hasWallet }: JobPostFormProps) {
  const [state, formAction] = useActionState(postJob, null)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [jobType, setJobType] = useState("full-time")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const { wallet } = useWallet()
  const formRef = useRef<HTMLFormElement>(null)

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const handlePaymentRequired = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!formRef.current) return

    const data = new FormData(formRef.current)

    data.set("requiredSkills", skills.join(","))

    setFormData(data)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (transactionHash: string) => {
    if (formData) {
      formData.set("transactionHash", transactionHash)
      formData.set("walletAddress", wallet?.address || "")
      formData.set("blockchain", wallet?.type === "phantom" ? "solana" : "ethereum")

      formAction(formData)
    }
    setShowPaymentModal(false)
  }

  return (
    <>
      <form ref={formRef} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{state.error}</div>
        )}

        {state?.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg">
            {state.success}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title" className="text-slate-300">
            Job Title *
          </Label>
          <Input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g., Senior React Developer"
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-slate-300">
            Job Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            required
            placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
            rows={6}
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="jobType" className="text-slate-300">
              Job Type *
            </Label>
            <select
              id="jobType"
              name="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-600 text-white rounded-md px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="e.g., San Francisco, CA or Remote"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remoteAllowed"
            name="remoteAllowed"
            className="w-4 h-4 text-emerald-600 bg-slate-900 border-slate-600 rounded focus:ring-emerald-500"
          />
          <Label htmlFor="remoteAllowed" className="text-slate-300">
            Remote work allowed
          </Label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">
              {jobType === "freelance" || jobType === "contract" ? "Budget Min ($)" : "Salary Min ($)"}
            </Label>
            <Input
              name={jobType === "freelance" || jobType === "contract" ? "budgetMin" : "salaryMin"}
              type="number"
              placeholder="50000"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">
              {jobType === "freelance" || jobType === "contract" ? "Budget Max ($)" : "Salary Max ($)"}
            </Label>
            <Input
              name={jobType === "freelance" || jobType === "contract" ? "budgetMax" : "salaryMax"}
              type="number"
              placeholder="80000"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-slate-300">Required Skills</Label>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-emerald-400 hover:text-emerald-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add required skill (e.g., React, Python, Design)"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <Button
              type="button"
              onClick={addSkill}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <input type="hidden" name="requiredSkills" value={skills.join(",")} />
        </div>

        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-2">Platform Fee Required</h3>
          <p className="text-blue-300/80 text-sm mb-2">
            A small platform fee is required to post a job. This helps maintain the quality of our job listings and
            prevents spam.
          </p>
          <div className="text-blue-300/80 text-sm">
            <strong>Fees:</strong> 0.0001 SOL (Solana) or 0.00001 ETH/MATIC (Ethereum/Polygon)
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton hasWallet={hasWallet} onPaymentRequired={handlePaymentRequired} />
        </div>
      </form>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        title="Job Posting Fee"
        description="Pay the platform fee to publish your job listing."
      />
    </>
  )
}
