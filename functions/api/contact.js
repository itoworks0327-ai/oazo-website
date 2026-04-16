/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * 環境変数（Cloudflare Dashboard で設定）:
 *   RESEND_API_KEY  - Resend (https://resend.com) の API キー
 *   CONTACT_FROM    - 送信元メールアドレス（Resend で検証済みドメイン）
 *                     例: "oazo contact <noreply@oazo-apparel.com>"
 *                     未設定なら Resend の onboarding@resend.dev を使用（要検証域のみ送信可）
 *   CONTACT_TO      - 受信メールアドレス（未設定なら oazo.tamura@gmail.com）
 */

const HEADERS_JSON = { 'Content-Type': 'application/json; charset=utf-8' };

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid JSON' }), {
      status: 400, headers: HEADERS_JSON,
    });
  }

  const name    = (data.name    || '').toString().trim().slice(0, 100);
  const company = (data.company || '').toString().trim().slice(0, 100);
  const email   = (data.email   || '').toString().trim().slice(0, 200);
  const type    = (data.type    || '').toString().trim().slice(0, 100);
  const message = (data.message || '').toString().trim().slice(0, 5000);

  if (!name || !email || !type || !message) {
    return new Response(JSON.stringify({ ok: false, error: '必須項目が未入力です' }), {
      status: 400, headers: HEADERS_JSON,
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'メールアドレスの形式が正しくありません' }), {
      status: 400, headers: HEADERS_JSON,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: 'サーバー設定が未完了です (RESEND_API_KEY)' }), {
      status: 500, headers: HEADERS_JSON,
    });
  }

  const to   = env.CONTACT_TO   || 'oazo.tamura@gmail.com';
  const from = env.CONTACT_FROM || 'oazo contact <onboarding@resend.dev>';

  const subject = `【お問い合わせ】${type} - ${name}様より`;
  const text =
    `■ お名前: ${name}\n` +
    `■ 会社名: ${company || '（未記入）'}\n` +
    `■ メールアドレス: ${email}\n` +
    `■ お問い合わせ種別: ${type}\n\n` +
    `■ ご相談内容:\n${message}\n\n` +
    `--\n` +
    `このメールは oazo-apparel.com のお問い合わせフォームから送信されました。`;

  const html =
    `<div style="font-family:sans-serif;line-height:1.8">` +
    `<h2 style="color:#4a9e5c">oazo-apparel.com お問い合わせ</h2>` +
    `<table style="border-collapse:collapse">` +
    `<tr><td><b>お名前</b></td><td>${escapeHtml(name)}</td></tr>` +
    `<tr><td><b>会社名</b></td><td>${escapeHtml(company || '（未記入）')}</td></tr>` +
    `<tr><td><b>メール</b></td><td>${escapeHtml(email)}</td></tr>` +
    `<tr><td><b>種別</b></td><td>${escapeHtml(type)}</td></tr>` +
    `</table>` +
    `<hr style="margin:16px 0;border:none;border-top:1px solid #eee">` +
    `<p><b>ご相談内容</b></p>` +
    `<div style="background:#fdf6ee;padding:12px 16px;border-radius:8px;white-space:pre-wrap">${escapeHtml(message)}</div>` +
    `</div>`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error('Resend error:', resp.status, body);
    return new Response(JSON.stringify({ ok: false, error: '送信に失敗しました。お手数ですが直接メールをお送りください。' }), {
      status: 502, headers: HEADERS_JSON,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: HEADERS_JSON,
  });
}

export function onRequest({ request }) {
  return new Response(JSON.stringify({ ok: false, error: 'method not allowed' }), {
    status: 405,
    headers: { ...HEADERS_JSON, 'Allow': 'POST' },
  });
}
