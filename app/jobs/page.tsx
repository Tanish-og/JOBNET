import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, MapPin, Plus, Sparkles, Database } from "lucide-react"
import Link from "next/link"
import JobCard from "@/components/jobs/job-card"
import { generateJobRecommendations } from "@/lib/ai/matching"

interface SearchParams {
  search?: string
  location?: string
  type?: string
  recommended?: string
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let userProfile = null
  let jobs = null
  let databaseError = false

  try {
    // First check if tables exist by attempting a simple query
    const { error: tableCheckError } = await supabase.from("users").select("id").limit(1)

    if (tableCheckError && tableCheckError.message.includes("does not exist")) {
      databaseError = true
    } else {
      // Tables exist, proceed with normal queries
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profileError) {
        userProfile = profileData
      }

      // Build query based on search parameters
      let query = supabase
        .from("jobs")
        .select(`
          *,
          users!jobs_posted_by_fkey (
            full_name,
            profile_image_url
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })

      // Apply filters
      if (searchParams.search) {
        query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
      }

      if (searchParams.location) {
        query = query.ilike("location", `%${searchParams.location}%`)
      }

      if (searchParams.type) {
        query = query.eq("job_type", searchParams.type)
      }

      const { data: jobsData, error: jobsError } = await query

      if (!jobsError) {
        jobs = jobsData
      }
    }
  } catch (error) {
    console.error("Database connection error:", error)
    databaseError = true
  }

  // Generate AI recommendations if requested
  let displayJobs = jobs || []
  let isRecommended = false

  if (searchParams.recommended === "true" && userProfile && jobs) {
    displayJobs = generateJobRecommendations(userProfile, jobs)
    isRecommended = true
  }

  if (databaseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold text-white">Browse Jobs</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Database Setup Required</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              The database tables need to be created before you can browse jobs. Please run the SQL scripts in your
              Supabase dashboard.
            </p>
            <div className="space-y-2 text-sm text-slate-500 mb-8">
              <p>1. Go to your Supabase dashboard</p>
              <p>2. Navigate to SQL Editor</p>
              <p>3. Run scripts/01-create-tables.sql</p>
              <p>4. Run scripts/02-seed-data.sql</p>
              <p>5. Run scripts/03-security-policies.sql</p>
            </div>
            <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-white">{isRecommended ? "Recommended Jobs" : "Browse Jobs"}</h1>
            </div>
            <div className="flex items-center space-x-2">
              {!isRecommended && (
                <Link href="/jobs?recommended=true">
                  <Button
                    variant="outline"
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white bg-transparent"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Recommendations
                  </Button>
                </Link>
              )}
              <Link href="/jobs/post">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        {!isRecommended && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
            <form method="GET" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    name="search"
                    placeholder="Search jobs..."
                    defaultValue={searchParams.search}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    name="location"
                    placeholder="Location..."
                    defaultValue={searchParams.location}
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <select
                  name="type"
                  defaultValue={searchParams.type}
                  className="bg-slate-900/50 border border-slate-600 text-white rounded-md px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* AI Recommendations Header */}
        {isRecommended && (
          <div className="bg-purple-500/10 border border-purple-500/50 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">AI-Powered Job Recommendations</h2>
            </div>
            <p className="text-purple-300/80">
              These jobs are personalized based on your skills, experience, and preferences. Match scores show how well
              each role aligns with your profile.
            </p>
            <div className="mt-4">
              <Link href="/jobs">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
                  View All Jobs
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="space-y-6">
          {displayJobs && displayJobs.length > 0 ? (
            displayJobs.map((job) => (
              <JobCard key={job.id} job={job} showMatchScore={isRecommended} userProfile={userProfile} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {isRecommended ? (
                  <Sparkles className="w-8 h-8 text-slate-400" />
                ) : (
                  <Search className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isRecommended ? "No recommendations found" : "No jobs found"}
              </h3>
              <p className="text-slate-400 mb-4">
                {isRecommended
                  ? "Complete your profile with skills and bio to get better recommendations."
                  : "Try adjusting your search criteria or check back later."}
              </p>
              {isRecommended ? (
                <Link href="/profile">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Complete Profile</Button>
                </Link>
              ) : (
                <Link href="/jobs/post">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Post the First Job</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
