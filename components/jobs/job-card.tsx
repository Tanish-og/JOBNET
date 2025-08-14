import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, User, Briefcase } from "lucide-react"
import Link from "next/link"
import MatchScore from "@/components/ai/match-score"
import { calculateJobMatch } from "@/lib/ai/matching"

interface JobCardProps {
  job: any
  showMatchScore?: boolean
  userProfile?: any
}

export default function JobCard({ job, showMatchScore = false, userProfile }: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    }
    if (min) {
      return `$${min.toLocaleString()}+`
    }
    return "Salary not specified"
  }

  const formatBudget = (min?: number, max?: number) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    }
    if (min) {
      return `$${min.toLocaleString()}+`
    }
    return "Budget not specified"
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-emerald-500/20 text-emerald-400"
      case "part-time":
        return "bg-blue-500/20 text-blue-400"
      case "contract":
        return "bg-purple-500/20 text-purple-400"
      case "freelance":
        return "bg-orange-500/20 text-orange-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  // Calculate match score if needed
  const matchScore = showMatchScore && userProfile ? (job.matchScore ?? calculateJobMatch(userProfile, job)) : null

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{job.title}</h3>
              <p className="text-slate-400 text-sm flex items-center">
                <User className="w-3 h-3 mr-1" />
                {job.users?.full_name || "Anonymous"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showMatchScore && matchScore !== null && <MatchScore score={matchScore} />}
          <Badge className={getJobTypeColor(job.job_type)}>{job.job_type?.replace("-", " ")}</Badge>
        </div>
      </div>

      <p className="text-slate-300 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-400">
        {job.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
            {job.remote_allowed && " (Remote OK)"}
          </div>
        )}
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(job.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.job_type === "freelance" || job.job_type === "contract"
            ? formatBudget(job.budget_min, job.budget_max)
            : formatSalary(job.salary_min, job.salary_max)}
        </div>
      </div>

      {job.required_skills && job.required_skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.required_skills.slice(0, 5).map((skill: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
              {skill}
            </span>
          ))}
          {job.required_skills.length > 5 && (
            <span className="px-2 py-1 bg-slate-600 text-slate-400 text-xs rounded-full">
              +{job.required_skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link href={`/jobs/${job.id}`}>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
            View Details
          </Button>
        </Link>
        <Link href={`/jobs/${job.id}/apply`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Apply Now</Button>
        </Link>
      </div>
    </div>
  )
}
