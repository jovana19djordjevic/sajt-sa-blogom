"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";

export type SubscribeState = {
  status: "idle" | "done" | "error";
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Unesi ispravnu email adresu." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Newsletter: RESEND_API_KEY is not set.");
    return {
      status: "error",
      message: "Prijava trenutno nije dostupna. Pokušaj kasnije.",
    };
  }

  const resend = new Resend(apiKey);
  const segmentId = process.env.RESEND_SEGMENT_ID;

  const { error } = await resend.contacts.create({
    email,
    unsubscribed: false,
    segments: segmentId ? [{ id: segmentId }] : undefined,
  });
  // An existing contact counts as success, so the form doesn't reveal who is subscribed.
  if (error && !/already exists/i.test(error.message)) {
    console.error("Newsletter: failed to create contact.", error);
    return {
      status: "error",
      message: "Prijava nije uspela. Pokušaj ponovo za koji minut.",
    };
  }

  // The welcome email needs a verified domain in Resend; until then it is skipped.
  const from = process.env.RESEND_FROM_EMAIL;
  if (from) {
    const { error: sendError } = await resend.emails.send({
      from,
      to: email,
      subject: `Dobrodošlica u newsletter – ${site.name}`,
      html: welcomeHtml(),
    });
    if (sendError) {
      console.error("Newsletter: failed to send welcome email.", sendError);
    }
  }

  return { status: "done" };
}

function welcomeHtml() {
  return `<div style="background:#103b28;padding:40px 24px;font-family:Arial,sans-serif;color:#f7f9f7">
  <div style="max-width:520px;margin:0 auto">
    <p style="display:inline-block;background:#92ff5f;color:#103b28;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin:0 0 24px">Newsletter</p>
    <h1 style="font-size:32px;line-height:1.1;margin:0 0 16px">Hvala što si se prijavio/la!</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;color:#cff1d2">Jednom mesečno stižu novi postovi, kombinacije koje vredi probati i komadi koje trenutno nosim. Do tada, svrati na blog.</p>
    <a href="${site.url}/blog" style="display:inline-block;background:#92ff5f;color:#103b28;border-radius:999px;padding:12px 24px;font-weight:bold;text-decoration:none">Čitaj blog</a>
    <p style="font-size:13px;color:#a9c4b3;margin:32px 0 0">${site.name}</p>
  </div>
</div>`;
}
