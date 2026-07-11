import { supabase } from "@/supabase";

const LOOKBOOK_PENDING_KEY = "redsky-lookbook-pending";
const PUBLIC_LOOKBOOK_COLUMNS = [
  "id",
  "title",
  "slug",
  "description",
  "aircraft_name",
  "category",
  "cover_url",
  "pages",
  "size_mb",
  "requires_login",
  "order_index",
].join(",");

function buildError(message, options = {}) {
  const error = new Error(message);
  Object.assign(error, options);
  return error;
}

function getBrowserUserAgent() {
  if (typeof navigator === "undefined") {
    return "";
  }

  return navigator.userAgent || "";
}

export async function getActiveLookbooks() {
  const { data, error } = await supabase
    .from("lookbooks")
    .select(PUBLIC_LOOKBOOK_COLUMNS)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw buildError("No fue posible cargar la biblioteca de aeronaves.", {
      cause: error,
      code: error.code,
    });
  }

  return Array.isArray(data) ? data : [];
}

export async function createLookbookSignedUrl(lookbookId, accessProof) {
  if (!lookbookId || !accessProof?.email || !accessProof?.downloadedAt) {
    throw buildError("El documento ya no esta disponible.");
  }

  const { data, error } = await supabase.functions.invoke("lookbook-signed-url", {
    body: {
      lookbook_id: lookbookId,
      email: accessProof.email,
      downloaded_at: accessProof.downloadedAt,
    },
  });

  if (error) {
    throw buildError(
      "No fue posible generar la URL temporal desde la funcion segura.",
      {
        cause: error,
        code: error.code,
      },
    );
  }

  const signedUrl = data?.signed_url || data?.signedUrl || data?.url;
  if (!signedUrl) {
    throw buildError("La funcion segura no devolvio una URL temporal.");
  }

  return signedUrl;
}

export async function registerLookbookDownload({
  lookbookId,
  userId = null,
  email,
  instagramUsername = null,
}) {
  const downloadedAt = new Date().toISOString();
  const payload = {
    lookbook_id: lookbookId,
    user_id: userId,
    email,
    instagram_username: instagramUsername,
    user_agent: getBrowserUserAgent(),
    downloaded_at: downloadedAt,
  };

  const { error } = await supabase.from("lookbook_downloads").insert(payload);

  if (error) {
    throw buildError("No fue posible registrar la descarga.", {
      cause: error,
      code: error.code,
    });
  }

  return {
    email,
    downloadedAt,
  };
}

export function openLookbookSignedUrl(signedUrl) {
  const link = document.createElement("a");
  link.href = signedUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function normalizeInstagramUsername(value = "") {
  const normalized = String(value).trim().replace(/^@+/, "").toLowerCase();

  if (!normalized) {
    return {
      value: "",
      isValid: true,
    };
  }

  return {
    value: normalized,
    isValid: /^[a-zA-Z0-9._]{1,30}$/.test(normalized),
  };
}

export function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw buildError("Tu sesion expiro. Inicia sesion nuevamente.", {
      cause: error,
      code: error.code,
    });
  }

  return data.session ?? null;
}

export function getUserInstagramUsername(user) {
  const metadata = user?.user_metadata || {};
  const candidates = [
    metadata.instagram_username,
    metadata.instagram,
    metadata.user_name,
    metadata.username,
    metadata.preferred_username,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeInstagramUsername(candidate);
    if (normalized.value && normalized.isValid) {
      return normalized.value;
    }
  }

  return "";
}

export function clearPendingLookbookDownload() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(LOOKBOOK_PENDING_KEY);
}
