import { getMatchCategory } from "@/lib/ai/matching"
import { TrendingUp } from "lucide-react"

interface MatchScoreProps {
  score: number
  showDetails?: boolean
}

export default function MatchScore({ score, showDetails = false }: MatchScoreProps) {
  const { category, color, description } = getMatchCategory(score)
  const percentage = Math.round(score * 100)

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <TrendingUp className={`w-4 h-4 ${color}`} />
        <span className={`font-medium ${color}`}>{percentage}%</span>
      </div>
      {showDetails && (
        <div>
          <span className={`text-sm font-medium ${color}`}>{category}</span>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      )}
    </div>
  )
}
