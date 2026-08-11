import { supabase } from "@/supabase";

const BUCKET = "experiences";
const VILLAS = "experience_villas";
const IMAGES = "experience_villa_images";

const villaOverrides = {
  "amada-202": { badge: "Beach Club Privado", category: "Beachfront", features: ["Frente al mar", "Beach Club", "Piscina privada", "Concierge"] },
  "casa-enmar": { badge: "Arquitectura Contemporánea", category: "Arquitectura", features: ["Diseño contemporáneo", "Frente al Caribe", "Piscina privada", "Concierge"] },
  "casa-isla-blanca": { badge: "Frente al Mar", category: "Beachfront", features: ["Playa privada", "Vistas panorámicas", "Piscina", "Concierge"] },
  "casa-milah": { badge: "Villa de Lujo", category: "Arquitectura", features: ["Jardines tropicales", "Piscina privada", "Espacios abiertos", "Concierge"] },
  "villa-caiman": { badge: "Experiencia Boutique", category: "Boutique", features: ["Naturaleza", "Diseño boutique", "Piscina privada", "Concierge"] },
  "villa-castillo": { badge: "Vista al Océano", category: "Beachfront", features: ["Vista panorámica", "Piscina infinita", "Terraza", "Concierge"] },
  "villa-moriska": { badge: "Frente a la Playa", category: "Beachfront", features: ["Acceso directo al mar", "Piscina", "Terraza", "Concierge"] },
  "villa-serena": { badge: "Frente al Mar", category: "Boutique", features: ["Vista al Caribe", "Piscina privada", "Espacios amplios", "Concierge"] },
};

function publicUrl(path) {
  return path ? supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl : "";
}

function metadata(villa) {
  const override = villaOverrides[villa.slug] || {};
  return {
    badge: override.badge || "Residencia privada",
    category: override.category || "Boutique",
    features: override.features || [],
    amenities: override.amenities || override.features || [],
    description: override.description || "Una residencia privada seleccionada para ofrecer confort, privacidad y una experiencia excepcional en uno de los destinos más exclusivos de México.",
  };
}

function normalizeVilla(villa) {
  const images = (villa.experience_villa_images || [])
    .filter((image) => image.is_active)
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));
  const cover = images.find((image) => image.image_path === villa.cover_path)
    || images.find((image) => image.is_cover)
    || images[0];
  return {
    ...villa,
    ...metadata(villa),
    coverUrl: publicUrl(cover?.image_path),
    imageUrls: images.map((image) => publicUrl(image.image_path)),
    images: images.map((image) => ({ name: image.id, url: publicUrl(image.image_path) })),
  };
}

const gallerySelect = "*, experience_villa_images(id, image_path, sort_order, is_cover, is_active)";

export async function getVillas() {
  const { data, error } = await supabase.from(VILLAS).select(gallerySelect)
    .eq("is_active", true).order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map(normalizeVilla).filter((villa) => villa.coverUrl);
}

export async function getVilla(slug) {
  if (!/^[a-z0-9-]+$/i.test(slug || "")) return null;
  const { data, error } = await supabase.from(VILLAS).select(gallerySelect)
    .eq("slug", slug).eq("is_active", true).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const villa = normalizeVilla(data);
  return villa.images.length ? villa : null;
}

export async function getFeaturedVillas(limit = 3) {
  const { data, error } = await supabase
    .from("experience_villas")
    .select("slug,name,destination,cover_path,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(limit);

  const featured = error ? [] : (data || [])
    .filter((villa) => villa.slug && villa.cover_path)
    .map((villa) => ({
      slug: villa.slug,
      name: villa.name || titleFromSlug(villa.slug),
      destination: villa.destination || "México",
      coverUrl: publicUrl(villa.cover_path.replace(/^\/+/, "")),
    }));

  if (featured.length) return featured;

  const storageVillas = await getVillas();
  return storageVillas.slice(0, limit).map(({ slug, name, destination, coverUrl }) => ({
    slug,
    name,
    destination,
    coverUrl,
  }));
}

export function subscribeToVillas(onChange) {
  const channel = supabase.channel("public-experience-villas")
    .on("postgres_changes", { event: "*", schema: "public", table: VILLAS }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: IMAGES }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}
