// Temporary mock data — replace with Supabase queries once the `listings` table is created.
// Required schema:
//   listings(id, user_id, make, model, year, price, km, condition, legal_status,
//            transmission, has_ac, city, description, contact, features text[], seller_name, created_at)

export const LISTINGS = [
  {
    id: 1, make: 'Nissan', model: 'Versa', year: 2020, km: 45200,
    condition: 'usado', city: 'CDMX', price: 189500,
    description: 'Versión Advance, llantas nuevas, uso particular. Se entrega con verificación vigente.',
    legal_status: 'mexicano', transmission: 'manual', has_ac: true,
    seller_name: 'Ana R.', contact: '+52 55 1234 5678',
    features: ['Mexicano', 'Manual', '4 cilindros', 'Aire acondicionado', 'Factura original'],
    images: [], created_at: '2026-07-01T10:00:00Z',
  },
  {
    id: 2, make: 'Mazda', model: '3', year: 2017, km: 82000,
    condition: 'seminuevo', city: 'Guadalajara', price: 215000,
    description: 'Hatchback s Grand Touring, único dueño, servicios en agencia. Pantalla reemplazada por garantía.',
    legal_status: 'mexicano', transmission: 'automatica', has_ac: true,
    seller_name: 'Carlos M.', contact: '+52 33 9876 5432',
    features: ['Mexicano', 'Automática', '4 cilindros', 'Aire acondicionado', 'Quemacocos', 'Único dueño'],
    images: [], created_at: '2026-07-02T14:00:00Z',
  },
  {
    id: 3, make: 'Nissan', model: 'Sentra', year: 2022, km: 18700,
    condition: 'seminuevo', city: 'CDMX', price: 335000,
    description: 'Exclusive tope de gama, como nuevo. Asistencias de manejo y garantía transferible.',
    legal_status: 'mexicano', transmission: 'cvt', has_ac: true,
    seller_name: 'Diego H.', contact: '+52 55 5555 4444',
    features: ['Mexicano', 'CVT', '4 cilindros', 'Aire acondicionado', 'Garantía de agencia', 'CarPlay'],
    images: [], created_at: '2026-07-03T09:00:00Z',
  },
  {
    id: 4, make: 'Toyota', model: 'Corolla', year: 2019, km: 55000,
    condition: 'usado', city: 'Monterrey', price: 265000,
    description: 'Sedan LE, excelente condición, mantenimiento al corriente.',
    legal_status: 'mexicano', transmission: 'automatica', has_ac: true,
    seller_name: 'María L.', contact: '+52 81 1111 2222',
    features: ['Mexicano', 'Automática', '4 cilindros', 'Aire acondicionado'],
    images: [], created_at: '2026-07-03T11:00:00Z',
  },
  {
    id: 5, make: 'Volkswagen', model: 'Jetta', year: 2021, km: 28000,
    condition: 'seminuevo', city: 'CDMX', price: 298000,
    description: 'Comfortline, único dueño, todo original de agencia.',
    legal_status: 'mexicano', transmission: 'automatica', has_ac: true,
    seller_name: 'Roberto P.', contact: '+52 55 7777 8888',
    features: ['Mexicano', 'Automática', '4 cilindros', 'Aire acondicionado', 'Único dueño'],
    images: [], created_at: '2026-07-04T08:00:00Z',
  },
  {
    id: 6, make: 'Honda', model: 'Civic', year: 2018, km: 71000,
    condition: 'usado', city: 'Puebla', price: 245000,
    description: 'Sport, motor turbo, impecable, factura al corriente.',
    legal_status: 'mexicano', transmission: 'manual', has_ac: true,
    seller_name: 'Fernanda G.', contact: '+52 22 3333 4444',
    features: ['Mexicano', 'Manual', '4 cilindros Turbo', 'Aire acondicionado', 'Factura original'],
    images: [], created_at: '2026-07-04T10:00:00Z',
  },
  {
    id: 7, make: 'Kia', model: 'Rio', year: 2023, km: 8000,
    condition: 'seminuevo', city: 'CDMX', price: 285000,
    description: 'LX, como nuevo, primer dueño, garantía de agencia vigente.',
    legal_status: 'mexicano', transmission: 'automatica', has_ac: true,
    seller_name: 'Pedro S.', contact: '+52 55 6666 7777',
    features: ['Mexicano', 'Automática', '4 cilindros', 'Aire acondicionado', 'Garantía de agencia'],
    images: [], created_at: '2026-07-04T12:00:00Z',
  },
  {
    id: 8, make: 'Chevrolet', model: 'Aveo', year: 2019, km: 68000,
    condition: 'usado', city: 'Querétaro', price: 145000,
    description: 'LTZ, motor 1.6, buen estado general, factura original.',
    legal_status: 'mexicano', transmission: 'manual', has_ac: true,
    seller_name: 'Sofía T.', contact: '+52 44 2222 3333',
    features: ['Mexicano', 'Manual', '4 cilindros', 'Aire acondicionado'],
    images: [], created_at: '2026-07-04T14:00:00Z',
  },
  {
    id: 9, make: 'Ford', model: 'Fiesta', year: 2016, km: 95000,
    condition: 'usado', city: 'Tijuana', price: 118000,
    description: 'SE, motor 1.6, transmisión automática, buen estado.',
    legal_status: 'legalizado_mx', transmission: 'automatica', has_ac: true,
    seller_name: 'Miguel Á.', contact: '+52 66 4444 5555',
    features: ['Legalizado MX', 'Automática', '4 cilindros', 'Aire acondicionado'],
    images: [], created_at: '2026-07-04T15:00:00Z',
  },
]

export function filterListings(listings, {
  search = '', sort = 'recent',
  priceMin = null, priceMax = null,
  makes = [], yearMin = null, yearMax = null,
  conditions = [], legalStatuses = [], transmissions = [], hasAc = false,
} = {}) {
  let result = listings.filter(l => {
    if (search) {
      const q = search.toLowerCase()
      if (!l.make.toLowerCase().includes(q) && !l.model.toLowerCase().includes(q)) return false
    }
    if (priceMin && l.price < priceMin) return false
    if (priceMax && l.price > priceMax) return false
    if (makes.length && !makes.includes(l.make)) return false
    if (yearMin && l.year < yearMin) return false
    if (yearMax && l.year > yearMax) return false
    if (conditions.length && !conditions.includes(l.condition)) return false
    if (legalStatuses.length && !legalStatuses.includes(l.legal_status)) return false
    if (transmissions.length && !transmissions.includes(l.transmission)) return false
    if (hasAc && !l.has_ac) return false
    return true
  })

  if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
  else if (sort === 'km_asc') result.sort((a, b) => a.km - b.km)
  else result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return result
}
