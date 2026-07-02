import nodemailer from 'nodemailer';

const BUSINESS_NAME = 'MimiRichies Bite';
const BUSINESS_PHONE = '+234 814 580 1171';
const BUSINESS_EMAIL = 'richardtls651@gmail.com';
const BUSINESS_ADDRESS = 'Pentagon Hotel & Suites, Choba, Port Harcourt';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function wrapper(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${BUSINESS_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <div style="width:60px;height:60px;background:rgba(255,255,255,0.18);border-radius:14px;display:inline-block;line-height:60px;font-size:30px;margin-bottom:12px;">🍢</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${BUSINESS_NAME}</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:0.8px;text-transform:uppercase;">Premium Shawarma &amp; Grill</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#ffffff;padding:40px;">
      ${content}
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 8px;color:#64748b;font-size:13px;">${BUSINESS_ADDRESS}</p>
      <p style="margin:0 0 16px;color:#64748b;font-size:13px;">
        <a href="tel:${BUSINESS_PHONE}" style="color:#f97316;text-decoration:none;">${BUSINESS_PHONE}</a>
        &nbsp;&middot;&nbsp;
        <a href="mailto:${BUSINESS_EMAIL}" style="color:#f97316;text-decoration:none;">${BUSINESS_EMAIL}</a>
      </p>
      <p style="margin:0;color:#94a3b8;font-size:11px;">&copy; ${new Date().getFullYear()} ${BUSINESS_NAME}. All rights reserved.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function orderRow(label, value) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
      <span style="color:#64748b;font-size:13px;">${label}</span>
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;">
      <span style="color:#0f172a;font-size:13px;font-weight:600;">${value}</span>
    </td>
  </tr>`;
}

function ctaButton(text, href) {
  return `<a href="${href}" style="display:inline-block;background:#f97316;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;margin-top:24px;">${text}</a>`;
}

// ─── 1. Order Received → Customer ────────────────────────────────────────────
export function buildOrderConfirmationEmail({ name, food, location, phone, instructions, orderId }) {
  const content = `
    <h2 style="margin:0 0 6px;color:#0f172a;font-size:20px;font-weight:700;">Thanks for your order, ${name.split(' ')[0]}!</h2>
    <p style="margin:0 0 28px;color:#475569;font-size:15px;line-height:1.6;">
      We've got it and we're getting things ready. Your food will be on its way shortly.
    </p>

    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#ea580c;text-transform:uppercase;letter-spacing:0.8px;">Order Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Order', food)}
        ${orderRow('Delivering to', location)}
        ${instructions ? orderRow('Your note', instructions) : ''}
        ${orderId ? orderRow('Reference', `#${orderId}`) : ''}
      </table>
    </div>

    <p style="margin:0 0 6px;color:#0f172a;font-size:15px;font-weight:600;">Need to reach us?</p>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      Call or WhatsApp us on <a href="tel:${BUSINESS_PHONE}" style="color:#f97316;font-weight:600;">${BUSINESS_PHONE}</a> and we'll sort you out right away.
    </p>
  `;
  return wrapper(content);
}

// ─── 2. New Order Alert → Admin ───────────────────────────────────────────────
export function buildNewOrderAdminEmail({ name, phone, email, food, location, instructions, orderId }) {
  const content = `
    <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:28px;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">New order just came in</p>
    </div>

    <h2 style="margin:0 0 24px;color:#0f172a;font-size:20px;font-weight:700;">${food}</h2>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Customer', name)}
        ${orderRow('Phone', phone)}
        ${orderRow('Email', email)}
        ${orderRow('Item ordered', food)}
        ${orderRow('Deliver to', location)}
        ${instructions ? orderRow('Instructions', instructions) : ''}
        ${orderId ? orderRow('Order ID', `#${orderId}`) : ''}
      </table>
    </div>

    <p style="margin:0;color:#64748b;font-size:13px;">Log in to the admin panel to update the order status and keep the customer informed.</p>
    ${ctaButton('Open Admin Panel', 'http://localhost:3000/admin/orders')}
  `;
  return wrapper(content);
}

// ─── 3. Status Update → Customer ─────────────────────────────────────────────
const STATUS_COPY = {
  preparing: {
    headline: 'Your order is being prepared!',
    message: "Great news — we've started working on your order. Our kitchen is on it and things are moving along nicely.",
    badge: '#2563eb',
    badgeBg: '#eff6ff',
    badgeText: 'In the Kitchen',
  },
  completed: {
    headline: 'Your order is on its way!',
    message: "Your food has left the kitchen and is heading to you. Enjoy your meal — you deserve it.",
    badge: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeText: 'Out for Delivery',
  },
  cancelled: {
    headline: 'Your order was cancelled',
    message: "We're sorry your order couldn't go through this time. If you have questions or want to reorder, we're just a call away.",
    badge: '#dc2626',
    badgeBg: '#fef2f2',
    badgeText: 'Cancelled',
  },
};

export function buildStatusUpdateEmail({ name, food, location, status, orderId }) {
  const copy = STATUS_COPY[status];
  if (!copy) return null;

  const content = `
    <div style="text-align:center;margin-bottom:32px;">
      <span style="display:inline-block;background:${copy.badgeBg};color:${copy.badge};font-size:12px;font-weight:700;padding:6px 16px;border-radius:50px;letter-spacing:0.5px;text-transform:uppercase;">${copy.badgeText}</span>
    </div>

    <h2 style="margin:0 0 10px;color:#0f172a;font-size:20px;font-weight:700;text-align:center;">${copy.headline}</h2>
    <p style="margin:0 0 32px;color:#475569;font-size:15px;line-height:1.7;text-align:center;">${copy.message}</p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${orderRow('Your name', name)}
        ${orderRow('Order', food)}
        ${orderRow('Delivery address', location)}
        ${orderId ? orderRow('Reference', `#${orderId}`) : ''}
      </table>
    </div>

    <p style="margin:0;color:#64748b;font-size:13px;text-align:center;">
      Questions? Call us on <a href="tel:${BUSINESS_PHONE}" style="color:#f97316;font-weight:600;">${BUSINESS_PHONE}</a>
    </p>
  `;
  return wrapper(content);
}

// ─── Sender ───────────────────────────────────────────────────────────────────
export async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${BUSINESS_NAME}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
