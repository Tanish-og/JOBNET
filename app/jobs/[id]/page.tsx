import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, DollarSign, User, Briefcase, Users } from "lucide-react"
import Link from "next/link"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  if (params.id === "post") {
    redirect("/jobs/post")
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let job: any = null
  try {
    // Get job details with user information
    const { data: fetchedJob, error } = await supabase
      .from("jobs")
      .select(`
        *,
        users!jobs_user_id_fkey (
          full_name,
          profile_image_url,
          bio,
          location
        )
      `)
      .eq("id", params.id)
      .single()

    if (error || !fetchedJob) {
      notFound()
    }

    job = fetchedJob
  } catch (error) {
    console.error("Error fetching job:", error)
    notFound()
  }

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

  const isOwner = job.user_id === user.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/jobs">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              {!isOwner && (
                <Link href={`/jobs/${job.id}/apply`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Apply Now</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                    <p className="text-slate-400 flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {job.users?.full_name || "Anonymous"}
                    </p>
                  </div>
                </div>
                <Badge className={getJobTypeColor(job.job_type)}>{job.job_type?.replace("-", " ")}</Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                {job.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                    {job.remote_allowed && " (Remote OK)"}
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {job.job_type === "freelance" || job.job_type === "contract"
                    ? formatBudget(job.budget_min, job.budget_max)
                    : formatSalary(job.salary_min, job.salary_max)}
                </div>
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{job.description}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Employer Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">About the Employer</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-medium mb-1">{job.users?.full_name || "Anonymous"}</h4>
                {job.users?.location && (
                  <p className="text-slate-400 text-sm flex items-center justify-center mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {job.users.location}
                  </p>
                )}
                {job.users?.bio && <p className="text-slate-300 text-sm leading-relaxed">{job.users.bio}</p>}
              </div>
            </div>

            {/* Job Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Job Type:</span>
                  <span className="text-white capitalize">{job.job_type?.replace("-", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remote:</span>
                  <span className="text-white">{job.remote_allowed ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Posted:</span>
                  <span className="text-white">{new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 capitalize">{job.status}</span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            {!isOwner && (
              <Link href={`/jobs/${job.id}/apply`} className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3">
                  <Users className="w-4 h-4 mr-2" />
                  Apply for this Job
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
