export interface RankUser {
  position: number
  user_name: string
}

export interface RankApi {
  api_display_name: string
  api_name: string
  popularity: number
  position: number
  top_users: RankUser[]
}

export type GlobalTopUsers = RankUser[]
