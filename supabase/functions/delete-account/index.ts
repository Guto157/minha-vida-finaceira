import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido." }), {
      status: 405, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const authorization = req.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Faça login para excluir sua conta." }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Serviço de exclusão ainda não configurado." }), {
      status: 503, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const userResponse = await fetch(supabaseUrl + "/auth/v1/user", {
      headers: { apikey: anonKey, Authorization: authorization },
    });
    if (!userResponse.ok) {
      return new Response(JSON.stringify({ error: "Sessão inválida ou expirada. Entre novamente." }), {
        status: 401, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const user = await userResponse.json();
    if (!user || !user.id) throw new Error("Não foi possível confirmar a conta.");

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: dataError } = await admin
      .from("user_finance_data")
      .delete()
      .eq("user_id", user.id);
    if (dataError) throw dataError;

    const { error: accountError } = await admin.auth.admin.deleteUser(user.id);
    if (accountError) throw accountError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Falha ao excluir a conta." }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});