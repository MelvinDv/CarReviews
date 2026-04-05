import { supabase } from './supabase.js'

export async function resolveVehicle(make, model, year) {
  const { data, error } = await supabase
    .from('vehicles')
    .select('id')
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .single()

  if (data) return data.id

  const { data: created, error: insertError } = await supabase
    .from('vehicles')
    .insert({ make, model, year: parseInt(year) })
    .select('id')
    .single()

  if (insertError) throw insertError
  return created.id
}

export async function getReviews(vehicleId, { from = 0, to = 2 } = {}) {
  const { data, error, count } = await supabase
    .from('reviews')
    .select('*, profiles(name, avatar_url)', { count: 'exact' })
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { reviews: data, count }
}

export async function getVehicleRating(vehicleId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('vehicle_id', vehicleId)

  if (error || !data.length) return { average: null, count: 0 }

  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { average: Math.round(avg * 10) / 10, count: data.length }
}

export async function createReview(vehicleId, userId, { rating, title, body }) {
  const { error } = await supabase
    .from('reviews')
    .insert({ vehicle_id: vehicleId, user_id: userId, rating, title, body })

  if (error) throw error
}
