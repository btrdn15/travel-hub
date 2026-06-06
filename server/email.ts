import nodemailer from "nodemailer";

export type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function normalizeSmtpPass(pass: string | undefined): string {
  return (pass ?? "").replace(/\s+/g, "");
}

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      normalizeSmtpPass(process.env.SMTP_PASS),
  );
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  if (!isSmtpConfigured()) {
    console.warn(
      "[email] SMTP not configured — add SMTP_HOST, SMTP_USER, SMTP_PASS to .env",
    );
    console.warn("[email] Would send to:", options.to);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: normalizeSmtpPass(process.env.SMTP_PASS),
      },
    });

    const from =
      process.env.SMTP_FROM ||
      `"Olon Nuur Travel" <${process.env.SMTP_USER}>`;

    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text.replace(/\n/g, "<br>\n"),
    });

    console.log("[email] Sent to:", options.to);
    return true;
  } catch (error) {
    console.error("[email] Failed to send to", options.to, error);
    return false;
  }
}
