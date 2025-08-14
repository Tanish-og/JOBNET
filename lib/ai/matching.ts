"use client"

// Simple text similarity function using Jaccard similarity
function calculateJaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])

  if (union.size === 0) return 0
  return intersection.size / union.size
}

// Extract keywords from text
function extractKeywords(text: string): Set<string> {
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "must",
    "shall",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
  ])

  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word)),
  )
}

// Calculate skill match score
function calculateSkillMatch(userSkills: string[], jobSkills: string[]): number {
  if (!userSkills?.length || !jobSkills?.length) return 0

  const userSkillsSet = new Set(userSkills.map((skill) => skill.toLowerCase()))
  const jobSkillsSet = new Set(jobSkills.map((skill) => skill.toLowerCase()))

  return calculateJaccardSimilarity(userSkillsSet, jobSkillsSet)
}

// Calculate text similarity between user bio and job description
function calculateTextSimilarity(userBio: string, jobDescription: string): number {
  if (!userBio || !jobDescription) return 0

  const userKeywords = extractKeywords(userBio)
  const jobKeywords = extractKeywords(jobDescription)

  return calculateJaccardSimilarity(userKeywords, jobKeywords)
}

// Calculate location match
function calculateLocationMatch(userLocation: string, jobLocation: string, remoteAllowed: boolean): number {
  if (remoteAllowed) return 1.0
  if (!userLocation || !jobLocation) return 0.5

  const userLoc = userLocation.toLowerCase()
  const jobLoc = jobLocation.toLowerCase()

  if (userLoc === jobLoc) return 1.0
  if (userLoc.includes(jobLoc) || jobLoc.includes(userLoc)) return 0.8

  // Check for same city/state
  const userParts = userLoc.split(",").map((part) => part.trim())
  const jobParts = jobLoc.split(",").map((part) => part.trim())

  for (const userPart of userParts) {
    for (const jobPart of jobParts) {
      if (userPart === jobPart) return 0.6
    }
  }

  return 0.2
}

// Main matching function
export function calculateJobMatch(user: any, job: any): number {
  const skillWeight = 0.5
  const textWeight = 0.3
  const locationWeight = 0.2

  const skillMatch = calculateSkillMatch(user.skills || [], job.required_skills || [])
  const textMatch = calculateTextSimilarity(user.bio || "", job.description || "")
  const locationMatch = calculateLocationMatch(user.location || "", job.location || "", job.remote_allowed || false)

  const totalScore = skillMatch * skillWeight + textMatch * textWeight + locationMatch * locationWeight

  return Math.round(totalScore * 100) / 100 // Round to 2 decimal places
}

// Get match score category
export function getMatchCategory(score: number): {
  category: string
  color: string
  description: string
} {
  if (score >= 0.8) {
    return {
      category: "Excellent Match",
      color: "text-emerald-400",
      description: "Your skills and experience align perfectly with this role",
    }
  } else if (score >= 0.6) {
    return {
      category: "Good Match",
      color: "text-blue-400",
      description: "You have most of the required skills for this position",
    }
  } else if (score >= 0.4) {
    return {
      category: "Partial Match",
      color: "text-yellow-400",
      description: "Some of your skills match this role requirements",
    }
  } else {
    return {
      category: "Low Match",
      color: "text-slate-400",
      description: "Limited alignment with your current profile",
    }
  }
}

// Extract skills from text using simple keyword matching
export function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    // Programming Languages
    "javascript",
    "python",
    "java",
    "typescript",
    "c++",
    "c#",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    // Web Technologies
    "react",
    "vue",
    "angular",
    "node.js",
    "express",
    "next.js",
    "nuxt",
    "svelte",
    "html",
    "css",
    "sass",
    "tailwind",
    // Databases
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "sqlite",
    "firebase",
    "supabase",
    // Cloud & DevOps
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "terraform",
    "jenkins",
    "github actions",
    // Design
    "figma",
    "sketch",
    "adobe",
    "photoshop",
    "illustrator",
    "ui/ux",
    "design",
    "prototyping",
    // Data & AI
    "machine learning",
    "data science",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    // Mobile
    "react native",
    "flutter",
    "ios",
    "android",
    "mobile development",
    // Other
    "git",
    "agile",
    "scrum",
    "project management",
    "leadership",
    "communication",
  ]

  const textLower = text.toLowerCase()
  const foundSkills: string[] = []

  for (const skill of commonSkills) {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  }

  return foundSkills
}

// Generate job recommendations based on user profile
export function generateJobRecommendations(user: any, jobs: any[]): any[] {
  if (!jobs?.length) return []

  const jobsWithScores = jobs.map((job) => ({
    ...job,
    matchScore: calculateJobMatch(user, job),
  }))

  // Sort by match score (highest first) and return top matches
  return jobsWithScores.sort((a, b) => b.matchScore - a.matchScore).filter((job) => job.matchScore > 0.2) // Only show jobs with some relevance
}
