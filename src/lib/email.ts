import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Remetente: troca para um domínio verificado (ex: "Carnavei <pedidos@carnavei.com>")
// quando o domínio existir. onboarding@resend.dev só entrega pro e-mail da conta Resend.
const FROM = process.env.EMAIL_FROM || "Carnavei <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

const BRAND = {
  paper: "#FBF8F4",
  ink: "#2B2530",
  inkSoft: "#6b6470",
  terracotta: "#D46429",
  line: "#E7DFD6",
};

function brl(cents: number) {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

// Wrapper HTML comum a todos os e-mails da marca.
function shell(inner: string) {
  return `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;background:${BRAND.paper};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#fff;border:1px solid ${BRAND.line};border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px;border-bottom:1px solid ${BRAND.line};">
          <span style="font-size:22px;font-weight:700;letter-spacing:.04em;color:${BRAND.terracotta};">CARNAVEI</span>
        </td></tr>
        <tr><td style="padding:32px;">${inner}</td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid ${BRAND.line};color:${BRAND.inkSoft};font-size:12px;">
          Carnavei · Acessórios artesanais · Este é um e-mail automático.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:${BRAND.terracotta};color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:999px;">${label}</a>`;

// ── Recuperação de senha ──────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = shell(`
    <h1 style="margin:0 0 12px;font-size:22px;">Redefinir sua senha</h1>
    <p style="margin:0 0 20px;color:${BRAND.inkSoft};font-size:15px;line-height:1.6;">
      Recebemos um pedido para redefinir a senha da sua conta Carnavei.
      Clique no botão abaixo para criar uma nova senha. O link expira em 1 hora.
    </p>
    <p style="margin:0 0 24px;">${btn(resetUrl, "Redefinir senha")}</p>
    <p style="margin:0;color:${BRAND.inkSoft};font-size:13px;line-height:1.6;">
      Se você não pediu isso, pode ignorar este e-mail — sua senha continua a mesma.
    </p>`);
  return resend.emails.send({ from: FROM, to, subject: "Redefinir sua senha · Carnavei", html });
}

// ── Confirmação de pedido (cliente) ───────────────────────────────────
type OrderEmailData = {
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; unitPrice: number }[];
  subtotal: number;
  shippingPrice: number;
  total: number;
  shippingService: string;
  address: { street: string; number: string; complement?: string; district: string; city: string; state: string; cep: string };
  orderRef: string;
};

function itemsRows(items: OrderEmailData["items"]) {
  return items
    .map(
      (it) =>
        `<tr><td style="padding:6px 0;font-size:14px;">${it.name} <span style="color:${BRAND.inkSoft};">×${it.qty}</span></td>
         <td style="padding:6px 0;font-size:14px;text-align:right;">${brl(it.unitPrice * it.qty)}</td></tr>`
    )
    .join("");
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const a = data.address;
  const html = shell(`
    <h1 style="margin:0 0 8px;font-size:22px;">Pedido confirmado! 🎉</h1>
    <p style="margin:0 0 20px;color:${BRAND.inkSoft};font-size:15px;line-height:1.6;">
      Obrigada pela sua compra, ${data.customerName.split(" ")[0]}. Recebemos seu pagamento e já vamos preparar seu pedido <strong>#${data.orderRef}</strong>.
    </p>
    <table role="presentation" width="100%" style="border-top:1px solid ${BRAND.line};margin-bottom:8px;">
      ${itemsRows(data.items)}
    </table>
    <table role="presentation" width="100%" style="border-top:1px solid ${BRAND.line};padding-top:8px;">
      <tr><td style="padding:4px 0;font-size:14px;color:${BRAND.inkSoft};">Frete (${data.shippingService})</td><td style="padding:4px 0;font-size:14px;text-align:right;color:${BRAND.inkSoft};">${brl(data.shippingPrice)}</td></tr>
      <tr><td style="padding:4px 0;font-size:16px;font-weight:700;">Total</td><td style="padding:4px 0;font-size:16px;font-weight:700;text-align:right;">${brl(data.total)}</td></tr>
    </table>
    <p style="margin:24px 0 4px;font-size:13px;font-weight:600;">Entrega</p>
    <p style="margin:0;color:${BRAND.inkSoft};font-size:13px;line-height:1.6;">
      ${a.street}, ${a.number}${a.complement ? " · " + a.complement : ""}<br>
      ${a.district} · ${a.city}/${a.state} · CEP ${a.cep}
    </p>`);
  return resend.emails.send({ from: FROM, to: data.customerEmail, subject: `Pedido confirmado #${data.orderRef} · Carnavei`, html });
}

// ── Novo pedido (admin) ───────────────────────────────────────────────
export async function sendAdminOrderEmail(data: OrderEmailData) {
  if (!ADMIN_EMAIL) return; // sem admin configurado, não envia
  const html = shell(`
    <h1 style="margin:0 0 8px;font-size:20px;">Novo pedido #${data.orderRef}</h1>
    <p style="margin:0 0 16px;color:${BRAND.inkSoft};font-size:14px;">
      ${data.customerName} · ${data.customerEmail}
    </p>
    <table role="presentation" width="100%" style="border-top:1px solid ${BRAND.line};margin-bottom:8px;">
      ${itemsRows(data.items)}
    </table>
    <p style="margin:8px 0 0;font-size:16px;font-weight:700;">Total: ${brl(data.total)} <span style="font-weight:400;color:${BRAND.inkSoft};font-size:13px;">(frete ${data.shippingService}: ${brl(data.shippingPrice)})</span></p>`);
  return resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `🛍️ Novo pedido #${data.orderRef} — ${brl(data.total)}`, html });
}
