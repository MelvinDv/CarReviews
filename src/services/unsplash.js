const ACCESS_KEY = "9d384ztcZlU_7OPD1hmoKRmvUaChq4GmXR7LWCZ0ea0";

export async function getCarImage(make, model, year) {
  if (!ACCESS_KEY) {
    // Fallback mientras no hay key configurada
    return `https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80`;
  }

  const query = encodeURIComponent(`${make} ${model} ${year} car`);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } },
  );
  const data = await res.json();
  return data.results?.[0]?.urls?.regular ?? null;
}
