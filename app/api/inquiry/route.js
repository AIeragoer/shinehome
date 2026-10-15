// 询盘 API：写入 HubSpot CRM + 发送自动回执（Resend）+ 通知销售
// 环境变量（Vercel Dashboard → Settings → Environment Variables）：
//   HUBSPOT_PRIVATE_APP_TOKEN, HUBSPOT_PIPELINE
//   RESEND_API_KEY, SALES_NOTIFY_EMAIL

// App Router：命名导出 + Web Response API；兼容 JSON（fetch）与表单编码（HTML form 原生提交）
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";
  let body = {};
  if (contentType.includes("application/json")) {
    body = await req.json().catch(() => ({}));
  } else {
    const form = await req.formData().catch(() => null);
    if (form) body = Object.fromEntries(form.entries());
  }

  const { name, email, company, country, product, message } = body;
  if (!name || !email) return json({ error: "name and email are required" }, 400);

  try {
    // 1. 同步到 HubSpot：创建/更新联系人 + 创建询盘工单
    await syncToHubSpot({ name, email, company, country, product, message });

    // 2. 给客户发自动回执 + 给销售发通知邮件（Resend）
    await sendEmails({ name, email, product, message });
  } catch (e) {
    console.error("inquiry pipeline error:", e);
    // 不阻塞用户：即使 CRM/邮件失败也返回成功，可配合重试队列
  }

  // 表单原生提交 → 跳转感谢页；AJAX JSON 提交 → 返回 JSON
  if (contentType.includes("form")) {
    return new Response(null, { status: 303, headers: { Location: "/inquiry/success" } });
  }
  return json({ ok: true });
}

async function syncToHubSpot(lead) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return console.warn("HUBSPOT_PRIVATE_APP_TOKEN not set, skip CRM sync");
  const h = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  // 创建/更新联系人（按 email 去重）
  await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST", headers: h,
    body: JSON.stringify({
      properties: {
        email: lead.email, firstname: lead.name, company: lead.company || "",
        country: lead.country || "", hs_lead_status: "NEW",
        lifecyclestage: "lead",
      },
    }),
  });

  // 创建 DEAL / TICKET 记录询盘内容（可按需选用对象类型）
  await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
    method: "POST", headers: h,
    body: JSON.stringify({
      properties: {
        hs_note_body: `Inquiry — Product: ${lead.product || "-"} | Country: ${lead.country || "-"}\n${lead.message || ""}`,
      },
    }),
  });
}

async function sendEmails({ name, email, product, message }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return console.warn("RESEND_API_KEY not set, skip emails");
  const h = { "Content-Type": "application/json", Authorization: `Bearer ${key}` };
  const post = (payload) =>
    fetch("https://api.resend.com/emails", { method: "POST", headers: h, body: JSON.stringify(payload) });

  // 自动回执给客户
  await post({
    from: "ShineHome Sales <sales@shinehome.com>",
    to: [email],
    subject: "Thank you for your inquiry — ShineHome",
    html: `<p>Dear ${name},</p><p>Thank you for contacting ShineHome. Our export team will reply with pricing and MOQ details within 24 hours.</p><p><b>Your inquiry:</b><br/>${product || "-"}<br/>${message || ""}</p><p>ShineHome — Premium Replica Furniture</p>`,
  });

  // 通知销售
  await post({
    from: "ShineHome Bot <bot@shinehome.com>",
    to: [process.env.SALES_NOTIFY_EMAIL || "sales@shinehome.com"],
    subject: `🔔 New inquiry from ${name} (${email})`,
    html: `<p>Product: ${product || "-"}</p><p>Message: ${message || "-"}</p>`,
  });
}
