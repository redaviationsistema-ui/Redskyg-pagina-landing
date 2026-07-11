import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET_NAME = "lookbook-pdfs";
const SIGNED_URL_TTL_SECONDS = 120;
const ACCESS_WINDOW_MINUTES = 10;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Metodo no permitido." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Faltan variables de entorno de Supabase." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const body = await request.json().catch(() => ({}));
    const lookbookId = body.lookbook_id || body.lookbookId;
    const email = String(body.email || "").trim().toLowerCase();
    const downloadedAt = body.downloaded_at || body.downloadedAt;

    if (!lookbookId || !email || !downloadedAt) {
      return jsonResponse(
        { error: "lookbook_id, email y downloaded_at son requeridos." },
        400,
      );
    }

    const { data: lookbook, error: lookbookError } = await admin
      .from("lookbooks")
      .select("id,pdf_path,is_active")
      .eq("id", lookbookId)
      .eq("is_active", true)
      .maybeSingle();

    if (lookbookError) {
      throw lookbookError;
    }

    if (!lookbook?.pdf_path) {
      return jsonResponse({ error: "El documento ya no esta disponible." }, 404);
    }

    const accessCutoff = new Date(
      Date.now() - ACCESS_WINDOW_MINUTES * 60 * 1000,
    ).toISOString();

    const { data: accessRows, error: accessError } = await admin
      .from("lookbook_downloads")
      .select("id")
      .eq("lookbook_id", lookbook.id)
      .eq("email", email)
      .eq("downloaded_at", downloadedAt)
      .is("user_id", null)
      .gte("downloaded_at", accessCutoff)
      .order("downloaded_at", { ascending: false })
      .limit(1);

    if (accessError) {
      throw accessError;
    }

    if (!accessRows?.length) {
      return jsonResponse({ error: "Primero registra la descarga." }, 403);
    }

    const { data: signedData, error: signedError } = await admin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(lookbook.pdf_path, SIGNED_URL_TTL_SECONDS);

    if (signedError || !signedData?.signedUrl) {
      throw signedError || new Error("No se pudo firmar el documento.");
    }

    return jsonResponse({ signed_url: signedData.signedUrl });
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: "No fue posible generar la URL temporal." }, 500);
  }
});
