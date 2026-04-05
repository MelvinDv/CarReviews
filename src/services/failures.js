import { supabase } from './supabase.js'

export async function getFailures(vehicleId, { from = 0, to = 4, status = null, sort = 'most-voted' } = {}) {
  let query = supabase
    .from('failures')
    .select('*, profiles!failures_user_id_fkey(name, avatar_url), failure_votes(user_id, vote)', { count: 'exact' })
    .eq('vehicle_id', vehicleId)
    .range(from, to)

  if (status) query = query.eq('status', status)

  const { data, error, count } = await query
  if (error) throw error

  const withVotes = data.map(f => ({
    ...f,
    votes: f.failure_votes.filter(v => v.vote === 'up').length -
           f.failure_votes.filter(v => v.vote === 'down').length,
  }))

  withVotes.sort((a, b) =>
    sort === 'most-voted' ? b.votes - a.votes : a.votes - b.votes
  )

  return { failures: withVotes, count }
}

export async function createFailure(vehicleId, userId, { title, problem, solution }) {
  const { error } = await supabase
    .from('failures')
    .insert({
      vehicle_id: vehicleId,
      user_id: userId,
      title,
      problem,
      solution: solution || null,
      status: solution ? 'resolved' : 'open',
    })
  if (error) throw error
}

export async function castVote(failureId, userId, vote) {
  const { data: existing } = await supabase
    .from('failure_votes')
    .select('vote')
    .eq('failure_id', failureId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    if (existing.vote === vote) {
      await supabase.from('failure_votes')
        .delete()
        .eq('failure_id', failureId)
        .eq('user_id', userId)
    } else {
      await supabase.from('failure_votes')
        .update({ vote })
        .eq('failure_id', failureId)
        .eq('user_id', userId)
    }
  } else {
    await supabase.from('failure_votes')
      .insert({ failure_id: failureId, user_id: userId, vote })
  }
}

export async function getUserVotes(userId, failureIds) {
  if (!userId || !failureIds.length) return {}
  const { data } = await supabase
    .from('failure_votes')
    .select('failure_id, vote')
    .eq('user_id', userId)
    .in('failure_id', failureIds)

  return Object.fromEntries((data ?? []).map(v => [v.failure_id, v.vote]))
}
