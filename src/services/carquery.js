const BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles'

export async function getMakes() {
  const res = await fetch(`${BASE_URL}/getallmakes?format=json`)
  const data = await res.json()
  return data.Results.map(m => ({
    title: m.Make_Name,
    value: m.Make_Name,
  })).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getModels(make) {
  const res = await fetch(`${BASE_URL}/getmodelsformake/${encodeURIComponent(make)}?format=json`)
  const data = await res.json()
  return data.Results.map(m => ({
    title: m.Model_Name,
    value: m.Model_Name,
  })).sort((a, b) => a.title.localeCompare(b.title))
}

export function getYears() {
  const current = new Date().getFullYear()
  return Array.from({ length: current - 1990 + 1 }, (_, i) => String(current - i))
}

export async function getVehicleInfo(make, model, year) {
  const res = await fetch(
    `${BASE_URL}/getmodelsformakeyear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
  )
  const data = await res.json()
  return data.Results?.find(r => r.Model_Name.toLowerCase() === model.toLowerCase()) ?? null
}
