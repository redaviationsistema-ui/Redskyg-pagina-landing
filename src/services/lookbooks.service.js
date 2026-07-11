import { supabase } from "@/supabase";

const LOOKBOOK_BUCKET = "lookbooks";
const LOOKBOOK_PENDING_KEY = "redsky-lookbook-pending";
const DOWNLOAD_MIGRATION_SQL =
  "alter table public.lookbook_downloads add column if not exists instagram_username text;";

let schemaCapabilitiesPromise;
let facebookAvailabilityPromise;

function buildError(message, options = {}) {
  const error = new Error(message);
  Object.assign(error, options);
  return error;
}

export function getLookbookPendingKey() {
  return LOOKBOOK_PENDING_KEY;
}

export function getDownloadMigrationSql() {
  return DOWNLOAD_MIGRATION_SQL;
}

export async function getLookbookSchemaCapabilities() {
  if (!schemaCapabilitiesPromise) {
    schemaCapabilitiesPromise = Promise.all([
      supabase
        .from("lookbooks")
        .select(
          "id,title,slug,description,aircraft_name,category,cover_url,pdf_path,pages,size_mb,is_active,requires_login,order_index,created_at,updated_at",
        )
        .limit(1),
      supabase
        .from("lookbook_downloads")
        .select("id,lookbook_id,user_id,email,downloaded_at")
        .limit(1),
      supabase
        .from("lookbook_downloads")
        .select("instagram_username")
        .limit(1),
    ]).then(([lookbooksResult, downloadsResult, instagramResult]) => ({
      lookbooksReady: !lookbooksResult.error,
      downloadsReady: !downloadsResult.error,
      hasInstagramUsernameColumn: !instagramResult.error,
      errors: {
        lookbooks: lookbooksResult.error,
        downloads: downloadsResult.error,
        instagramColumn: instagramResult.error,
      },
    }));
  }

  return schemaCapabilitiesPromise;
}

export async function getActiveLookbooks() {
  const { data, error } = await supabase
    .from("lookbooks")
    .select("*")
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

export async function createLookbookSignedUrl(pdfPath, expiresIn = 120) {
  if (!pdfPath) {
    throw buildError("El documento ya no está disponible.");
  }

  const { data, error } = await supabase.storage
    .from(LOOKBOOK_BUCKET)
    .createSignedUrl(pdfPath, expiresIn);

  if (error || !data?.signedUrl) {
    throw buildError("No fue posible generar el acceso al documento.", {
      cause: error,
      code: error?.code,
    });
  }

  return data.signedUrl;
}

export async function registerLookbookDownload({
  lookbookId,
  userId,
  email,
  instagramUsername,
}) {
  const capabilities = await getLookbookSchemaCapabilities();

  if (!capabilities.hasInstagramUsernameColumn) {
    throw buildError(
      "Falta la columna instagram_username en lookbook_downloads. Ejecuta la migracion indicada antes de habilitar descargas.",
      {
        code: "LOOKBOOK_INSTAGRAM_COLUMN_MISSING",
        migrationSql: DOWNLOAD_MIGRATION_SQL,
      },
    );
  }

  const payload = {
    lookbook_id: lookbookId,
    user_id: userId,
    email,
    instagram_username: instagramUsername,
    downloaded_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("lookbook_downloads").insert(payload);

  if (error) {
    throw buildError("No fue posible registrar la descarga.", {
      cause: error,
      code: error.code,
    });
  }
}

export async function fetchLookbookBlob(signedUrl) {
  const response = await fetch(signedUrl);

  if (!response.ok) {
    throw buildError("No fue posible obtener el documento.");
  }

  return response.blob();
}

export function triggerLookbookDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

export function normalizeInstagramUsername(value = "") {
  const normalized = String(value).trim().replace(/^@+/, "").toLowerCase();
  const isValid = /^[a-zA-Z0-9._]{1,30}$/.test(normalized);

  return {
    value: normalized,
    isValid,
  };
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw buildError("Tu sesión expiró. Inicia sesión nuevamente.", {
      cause: error,
      code: error.code,
    });
  }

  return data.session ?? null;
}

export async function sendLookbookMagicLink(email, redirectTo) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    throw buildError("No fue posible iniciar sesión con ese correo.", {
      cause: error,
      code: error.code,
    });
  }
}

export async function signInWithFacebook(redirectTo) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo,
      skipBrowserRedirect: false,
    },
  });

  if (error) {
    throw buildError("No fue posible continuar con Facebook.", {
      cause: error,
      code: error.code,
    });
  }

  return data;
}

export async function checkFacebookOAuthAvailable() {
  if (!facebookAvailabilityPromise) {
    facebookAvailabilityPromise = supabase.auth
      .signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: "https://example.com",
          skipBrowserRedirect: true,
        },
      })
      .then(({ data, error }) => !error && Boolean(data?.url))
      .catch(() => false);
  }

  return facebookAvailabilityPromise;
}

export async function saveInstagramUsername(instagramUsername) {
  const { error } = await supabase.auth.updateUser({
    data: {
      instagram_username: instagramUsername,
    },
  });

  if (error) {
    throw buildError("No fue posible guardar tu usuario de Instagram.", {
      cause: error,
      code: error.code,
    });
  }
}

export function readPendingLookbookDownload() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(LOOKBOOK_PENDING_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.sessionStorage.removeItem(LOOKBOOK_PENDING_KEY);
    return null;
  }
}

export function writePendingLookbookDownload(payload) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(LOOKBOOK_PENDING_KEY, JSON.stringify(payload));
}

export function clearPendingLookbookDownload() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(LOOKBOOK_PENDING_KEY);
}
