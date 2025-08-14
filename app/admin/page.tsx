import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminDashboard() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // For demo purposes, check if user email contains "admin" or use a specific admin email
  const isAdmin = user.email?.includes("admin") || user.email === "admin@jobportal.com"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Fetch admin statistics
  const { data: totalUsers } = await supabase.from("profiles").select("id", { count: "exact" })
  const { data: totalJobs } = await supabase.from("jobs").select("id", { count: "exact" })
  const { data: totalPayments } = await supabase.from("payments").select("id", { count: "exact" })

  // Calculate total revenue
  const { data: payments } = await supabase.from("payments").select("amount, currency")
  const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0

  // Fetch recent payments with user details
  const { data: recentPayments } = await supabase
    .from("payments")
    .select(`
      *,
      profiles!inner(full_name, email),
      jobs!inner(title)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch recent jobs
  const { data: recentJobs } = await supabase
    .from("jobs")
    .select(`
      *,
      profiles!inner(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Monitor platform activity and manage operations</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <div className="h-4 w-4 text-emerald-600">👥</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers?.length || 0}</div>
              <p className="text-xs text-slate-600">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <div className="h-4 w-4 text-blue-600">💼</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalJobs?.length || 0}</div>
              <p className="text-xs text-slate-600">Job postings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <div className="h-4 w-4 text-purple-600">💳</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPayments?.length || 0}</div>
              <p className="text-xs text-slate-600">Blockchain transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="h-4 w-4 text-green-600">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toFixed(6)}</div>
              <p className="text-xs text-slate-600">Platform fees collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payments">Recent Payments</TabsTrigger>
            <TabsTrigger value="jobs">Recent Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Blockchain Payments</CardTitle>
                <CardDescription>Latest platform fee payments from users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments?.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{payment.profiles.full_name}</p>
                        <p className="text-sm text-slate-600">{payment.profiles.email}</p>
                        <p className="text-sm text-slate-500">Job: {payment.jobs.title}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {payment.blockchain}
                          </Badge>
                          <Badge variant={payment.status === "confirmed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="font-medium">
                          {payment.amount} {payment.currency}
                        </p>
                        <p className="text-xs text-slate-500">{new Date(payment.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {!recentPayments?.length && <p className="text-center text-slate-500 py-8">No payments yet</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Latest jobs posted on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentJobs?.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-slate-600">Posted by: {job.profiles.full_name}</p>
                        <p className="text-sm text-slate-500">{job.profiles.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {job.job_type}
                          </Badge>
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>{job.status}</Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm text-slate-500">{new Date(job.created_at).toLocaleDateString()}</p>
                        {job.location && <p className="text-sm text-slate-600">{job.location}</p>}
                        {job.remote_allowed && (
                          <Badge variant="outline" className="text-xs">
                            Remote OK
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {!recentJobs?.length && <p className="text-center text-slate-500 py-8">No jobs posted yet</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
