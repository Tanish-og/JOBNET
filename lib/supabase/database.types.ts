export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          bio: string | null
          linkedin_url: string | null
          skills: string[] | null
          wallet_address: string | null
          profile_image_url: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          bio?: string | null
          linkedin_url?: string | null
          skills?: string[] | null
          wallet_address?: string | null
          profile_image_url?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          bio?: string | null
          linkedin_url?: string | null
          skills?: string[] | null
          wallet_address?: string | null
          profile_image_url?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          required_skills: string[] | null
          budget_min: number | null
          budget_max: number | null
          salary_min: number | null
          salary_max: number | null
          job_type: "full-time" | "part-time" | "contract" | "freelance" | null
          location: string | null
          remote_allowed: boolean | null
          status: "active" | "closed" | "draft"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          required_skills?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          salary_min?: number | null
          salary_max?: number | null
          job_type?: "full-time" | "part-time" | "contract" | "freelance" | null
          location?: string | null
          remote_allowed?: boolean | null
          status?: "active" | "closed" | "draft"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          required_skills?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          salary_min?: number | null
          salary_max?: number | null
          job_type?: "full-time" | "part-time" | "contract" | "freelance" | null
          location?: string | null
          remote_allowed?: boolean | null
          status?: "active" | "closed" | "draft"
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          post_type: "update" | "advice" | "achievement" | "question"
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          post_type?: "update" | "advice" | "achievement" | "question"
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          post_type?: "update" | "advice" | "achievement" | "question"
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          applicant_id: string
          cover_letter: string | null
          resume_url: string | null
          status: "pending" | "reviewed" | "accepted" | "rejected"
          match_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          applicant_id: string
          cover_letter?: string | null
          resume_url?: string | null
          status?: "pending" | "reviewed" | "accepted" | "rejected"
          match_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          applicant_id?: string
          cover_letter?: string | null
          resume_url?: string | null
          status?: "pending" | "reviewed" | "accepted" | "rejected"
          match_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          job_id: string
          transaction_hash: string
          blockchain: "ethereum" | "polygon" | "solana"
          amount: number
          currency: string
          status: "pending" | "confirmed" | "failed"
          admin_wallet: string
          user_wallet: string
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          transaction_hash: string
          blockchain: "ethereum" | "polygon" | "solana"
          amount: number
          currency: string
          status?: "pending" | "confirmed" | "failed"
          admin_wallet: string
          user_wallet: string
          created_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          transaction_hash?: string
          blockchain?: "ethereum" | "polygon" | "solana"
          amount?: number
          currency?: string
          status?: "pending" | "confirmed" | "failed"
          admin_wallet?: string
          user_wallet?: string
          created_at?: string
          confirmed_at?: string | null
        }
      }
      connections: {
        Row: {
          id: string
          requester_id: string
          receiver_id: string
          status: "pending" | "accepted" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          receiver_id: string
          status?: "pending" | "accepted" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          receiver_id?: string
          status?: "pending" | "accepted" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
