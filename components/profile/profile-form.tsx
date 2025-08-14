"use client"

import type React from "react"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"
import { updateProfile } from "@/lib/actions"
import { useState } from "react"
import WalletConnectButton from "@/components/web3/wallet-connect-button"
import SkillExtractor from "@/components/ai/skill-extractor"

interface ProfileFormProps {
  profile: any
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        "Update Profile"
      )}
    </Button>
  )
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, null)
  const [skills, setSkills] = useState<string[]>(profile?.skills || [])
  const [newSkill, setNewSkill] = useState("")
  const [walletAddress, setWalletAddress] = useState(profile?.wallet_address || "")

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

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
  }

  const handleSkillsExtracted = (extractedSkills: string[]) => {
    const newSkills = [...skills]
    for (const skill of extractedSkills) {
      if (!newSkills.includes(skill)) {
        newSkills.push(skill)
      }
    }
    setSkills(newSkills)
  }

  return (
    <div className="space-y-8">
      {/* AI Skill Extractor */}
      <SkillExtractor onSkillsExtracted={handleSkillsExtracted} />

      {/* Profile Form */}
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{state.error}</div>
        )}

        {state?.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg">
            {state.success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-slate-300">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              defaultValue={profile?.full_name || ""}
              placeholder="John Doe"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              defaultValue={profile?.location || ""}
              placeholder="San Francisco, CA"
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-slate-300">
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile?.bio || ""}
            placeholder="Tell us about yourself, your experience, and what you're looking for..."
            rows={4}
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl" className="text-slate-300">
            LinkedIn URL
          </Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            defaultValue={profile?.linkedin_url || ""}
            placeholder="https://linkedin.com/in/yourprofile"
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-slate-300">Wallet Connection</Label>
          <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
            <WalletConnectButton onConnect={handleWalletConnect} />
            <input type="hidden" name="walletAddress" value={walletAddress} />
            {walletAddress && (
              <p className="text-xs text-slate-400 mt-2">Connected wallet will be saved to your profile</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-slate-300">Skills</Label>

          {/* Skills Display */}
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

          {/* Add Skill Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill (e.g., React, Python, Design)"
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

          {/* Hidden input to submit skills */}
          <input type="hidden" name="skills" value={skills.join(",")} />
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}
