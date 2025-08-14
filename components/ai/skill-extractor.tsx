"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { extractSkillsFromText } from "@/lib/ai/matching"
import { Sparkles, Copy } from "lucide-react"

interface SkillExtractorProps {
  onSkillsExtracted: (skills: string[]) => void
}

export default function SkillExtractor({ onSkillsExtracted }: SkillExtractorProps) {
  const [text, setText] = useState("")
  const [extractedSkills, setExtractedSkills] = useState<string[]>([])
  const [isExtracting, setIsExtracting] = useState(false)

  const handleExtract = async () => {
    if (!text.trim()) return

    setIsExtracting(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const skills = extractSkillsFromText(text)
    setExtractedSkills(skills)
    setIsExtracting(false)
  }

  const handleCopySkills = () => {
    if (extractedSkills.length > 0) {
      onSkillsExtracted(extractedSkills)
      setText("")
      setExtractedSkills([])
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Skill Extractor</h3>
      </div>

      <p className="text-slate-400 text-sm mb-4">
        Paste your resume, job description, or any text to automatically extract relevant skills.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="extractText" className="text-slate-300">
            Paste your text here
          </Label>
          <Textarea
            id="extractText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume, LinkedIn profile, or any professional text here..."
            rows={6}
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 resize-none"
          />
        </div>

        <Button
          onClick={handleExtract}
          disabled={!text.trim() || isExtracting}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isExtracting ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Extracting Skills...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Extract Skills
            </>
          )}
        </Button>

        {extractedSkills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Extracted Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
            <Button
              onClick={handleCopySkills}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Add to Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
