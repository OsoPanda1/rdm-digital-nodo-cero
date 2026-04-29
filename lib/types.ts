export type Federation = {
  id: string
  name: string
  motto: string | null
  description: string | null
  color_hex: string | null
  icon: string | null
  domain: string | null
  active: boolean
  modules: string[]
}

export type TerritoryPOI = {
  id: string
  name: string
  category: string
  municipality: string
  lat: number
  lng: number
  altitude_m: number | null
  description: string | null
  significance: string | null
  federation_id: string | null
}

export type Manuscript = {
  id: string
  tomo_number: number
  title: string
  subtitle: string | null
  description: string | null
  status: string
  word_count: number
  author: string
  ritual_name: string
  orcid: string
}

export type Repository = {
  id: string
  name: string
  full_name: string
  description: string | null
  url: string
  language: string | null
  topics: string[] | null
  federation_id: string | null
  classification: string | null
  stars: number
  pushed_at: string | null
}

export type Profile = {
  id: string
  display_name: string | null
  full_name: string | null
  role: string
  orcid: string | null
  citizenship_id: string | null
  consent_citemesh: boolean
}

export type Wallet = {
  user_id: string
  balance_mxn_cents: number
  balance_tamv_credits: number
  reputation: number
}

export type EventRow = {
  id: string
  title: string
  description: string | null
  category: string
  federation_id: string | null
  starts_at: string
  capacity: number | null
  registered_count: number
}

export type Product = {
  id: string
  merchant_id: string
  name: string
  description: string | null
  price_cents: number
  currency: string
  image_url: string | null
  active: boolean
}

export type Merchant = {
  id: string
  business_name: string
  category: string | null
  description: string | null
  municipality: string | null
  cover_url: string | null
  verified: boolean
}
