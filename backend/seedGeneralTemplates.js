import mongoose from "mongoose";
import dotenv from "dotenv";
import Template from "./models/Template.js";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/email_app";

function baseWrap({ title, preheader, heading, body, ctaText, ctaUrl, accent = "#111827" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;font-size:1px;color:#f6f7fb;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader || ""}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;background:#f6f7fb;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:18px 22px;background:${accent};color:#ffffff;">
                <div style="font-size:12px;opacity:0.85;">{{company_name}}</div>
                <div style="margin-top:6px;font-size:18px;font-weight:800;">${heading}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px;font-size:14px;line-height:1.65;">
                ${body}
                ${
                  ctaText
                    ? `<div style="margin-top:16px;">
                     <a href="${ctaUrl || "{{cta_url}}"}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 16px;border-radius:10px;">${ctaText}</a>
                   </div>`
                    : ""
                }
                <p style="margin:18px 0 0 0;">Regards,<br/>{{sender_name}}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                If you have questions, reply to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const templates = [
  {
    title: "basic email (simple)",
    category: "basic",
    description: "A clean, minimal email layout suitable for most messages.",
    image: "/images/templates/basic.svg",
    html: baseWrap({
      title: "Basic Email",
      heading: "A simple update",
      preheader: "A clean, minimal email layout.",
      body: `
        <p style="margin:0;"><strong>Hi {{name}},</strong></p>
        <p style="margin:10px 0 0 0;">This is a simple template you can use for announcements, updates, or general communication.</p>
        <p style="margin:10px 0 0 0;">Add your content here. You can include links, lists, and a call-to-action.</p>
      `,
      ctaText: "Primary action",
      ctaUrl: "{{cta_url}}",
      accent: "#111827",
    }),
  },
  {
    title: "greeting email",
    category: "greeting",
    description: "A warm greeting email for welcoming someone or saying hello.",
    image: "/images/templates/greeting.svg",
    html: baseWrap({
      title: "Greeting",
      heading: "Hello, {{name}}!",
      preheader: "Just a quick note to say hi.",
      body: `
        <p style="margin:0;">I hope you’re doing well. I wanted to reach out and connect with you.</p>
        <p style="margin:10px 0 0 0;">If you’re available, let’s schedule a quick chat this week.</p>
      `,
      ctaText: "Book a time",
      ctaUrl: "{{cta_url}}",
      accent: "#2563eb",
    }),
  },
  {
    title: "wishes (birthday/occasion)",
    category: "wishes",
    description: "Wishes for birthdays, anniversaries, or special occasions.",
    image: "/images/templates/wishes.svg",
    html: baseWrap({
      title: "Wishes",
      heading: "Happy {{occasion}}!",
      preheader: "Sending you warm wishes.",
      body: `
        <p style="margin:0;">Dear {{name}},</p>
        <p style="margin:10px 0 0 0;">Wishing you a wonderful {{occasion}} filled with joy, good health, and success.</p>
        <p style="margin:10px 0 0 0;">Enjoy your day!</p>
      `,
      accent: "#9a3412",
    }),
  },
  {
    title: "formal email",
    category: "formal",
    description: "A professional formal email with structured sections.",
    image: "/images/templates/formal.svg",
    html: baseWrap({
      title: "Formal Email",
      heading: "{{subject}}",
      preheader: "A formal message from {{company_name}}.",
      body: `
        <p style="margin:0;">Dear {{recipient_name}},</p>
        <p style="margin:10px 0 0 0;">I hope this message finds you well. I am writing to {{reason}}.</p>
        <p style="margin:10px 0 0 0;">Please find the key points below:</p>
        <ul style="margin:8px 0 0 18px;padding:0;">
          <li>Point 1</li>
          <li>Point 2</li>
          <li>Point 3</li>
        </ul>
      `,
      accent: "#111827",
    }),
  },
  {
    title: "interview invitation",
    category: "interview",
    description: "Invite a candidate for an interview with schedule and location details.",
    image: "/images/templates/interview.svg",
    html: baseWrap({
      title: "Interview Invitation",
      heading: "Interview Invitation",
      preheader: "We’d like to invite you for an interview.",
      body: `
        <p style="margin:0;">Hi {{candidate_name}},</p>
        <p style="margin:10px 0 0 0;">Thank you for applying for the <strong>{{job_title}}</strong> role. We’d like to invite you for an interview.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:12px 14px;background:#f9fafb;font-weight:800;">Details</td></tr>
          <tr><td style="padding:12px 14px;">
            <div><strong>Date:</strong> {{date}}</div>
            <div style="margin-top:6px;"><strong>Time:</strong> {{time}}</div>
            <div style="margin-top:6px;"><strong>Mode:</strong> {{mode}}</div>
            <div style="margin-top:6px;"><strong>Location/Link:</strong> {{location_or_link}}</div>
          </td></tr>
        </table>
        <p style="margin:14px 0 0 0;">Please reply to confirm your availability.</p>
      `,
      accent: "#7c3aed",
    }),
  },
  {
    title: "job application acknowledgment",
    category: "jobs",
    description: "Confirm that a job application has been received.",
    image: "/images/templates/jobs.svg",
    html: baseWrap({
      title: "Application Received",
      heading: "We received your application",
      preheader: "Thanks for applying.",
      body: `
        <p style="margin:0;">Hi {{candidate_name}},</p>
        <p style="margin:10px 0 0 0;">Thank you for applying to <strong>{{company_name}}</strong>. We received your application for the <strong>{{job_title}}</strong> role.</p>
        <p style="margin:10px 0 0 0;">If your profile matches our requirements, we’ll reach out with next steps.</p>
      `,
      accent: "#0f766e",
    }),
  },
  {
    title: "follow-up email (after meeting)",
    category: "follow-up",
    description: "A polite follow-up after a meeting or call.",
    image: "/images/templates/follow-up.svg",
    html: baseWrap({
      title: "Follow-up",
      heading: "Thanks for your time",
      preheader: "Follow-up summary and next steps.",
      body: `
        <p style="margin:0;">Hi {{name}},</p>
        <p style="margin:10px 0 0 0;">It was great speaking with you. Here’s a quick recap:</p>
        <ul style="margin:8px 0 0 18px;padding:0;">
          <li>Topic 1</li>
          <li>Topic 2</li>
          <li>Next step</li>
        </ul>
        <p style="margin:12px 0 0 0;">If I missed anything, just reply and I’ll update it.</p>
      `,
      accent: "#111827",
    }),
  },
  {
    title: "thank you email",
    category: "thank-you",
    description: "A short thank-you note for help, time, or support.",
    image: "/images/templates/thank-you.svg",
    html: baseWrap({
      title: "Thank You",
      heading: "Thank you!",
      preheader: "We appreciate your time and support.",
      body: `
        <p style="margin:0;">Hi {{name}},</p>
        <p style="margin:10px 0 0 0;">Thank you for your help with {{topic}}. I really appreciate it.</p>
      `,
      accent: "#166534",
    }),
  },
  {
    title: "apology email",
    category: "support",
    description: "A professional apology email with resolution steps.",
    image: "/images/templates/support.svg",
    html: baseWrap({
      title: "Apology",
      heading: "We’re sorry",
      preheader: "An update regarding your recent experience.",
      body: `
        <p style="margin:0;">Hi {{name}},</p>
        <p style="margin:10px 0 0 0;">We sincerely apologize for {{issue}}.</p>
        <p style="margin:10px 0 0 0;">Here’s what we’re doing to fix it:</p>
        <ul style="margin:8px 0 0 18px;padding:0;">
          <li>Action step 1</li>
          <li>Action step 2</li>
          <li>Expected resolution: {{eta}}</li>
        </ul>
      `,
      accent: "#991b1b",
    }),
  },
  {
    title: "offer letter (job)",
    category: "jobs",
    description: "A simple offer letter layout for job offers.",
    image: "/images/templates/jobs.svg",
    html: baseWrap({
      title: "Offer Letter",
      heading: "Offer Letter",
      preheader: "Your offer from {{company_name}}.",
      body: `
        <p style="margin:0;">Dear {{candidate_name}},</p>
        <p style="margin:10px 0 0 0;">We are pleased to offer you the position of <strong>{{job_title}}</strong> at <strong>{{company_name}}</strong>.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:12px 14px;background:#f9fafb;font-weight:800;">Offer summary</td></tr>
          <tr><td style="padding:12px 14px;">
            <div><strong>Start date:</strong> {{start_date}}</div>
            <div style="margin-top:6px;"><strong>Compensation:</strong> {{compensation}}</div>
            <div style="margin-top:6px;"><strong>Location:</strong> {{location}}</div>
          </td></tr>
        </table>
        <p style="margin:14px 0 0 0;">Please confirm acceptance by replying to this email by <strong>{{deadline}}</strong>.</p>
      `,
      accent: "#111827",
    }),
  },
  {
    title: "resignation email",
    category: "formal",
    description: "A polite resignation email template.",
    image: "/images/templates/formal.svg",
    html: baseWrap({
      title: "Resignation",
      heading: "Resignation",
      preheader: "Notice of resignation.",
      body: `
        <p style="margin:0;">Dear {{manager_name}},</p>
        <p style="margin:10px 0 0 0;">Please accept this email as formal notice of my resignation from my position as <strong>{{role}}</strong>, effective <strong>{{last_working_day}}</strong>.</p>
        <p style="margin:10px 0 0 0;">Thank you for the opportunities and support during my time at {{company_name}}. I will do my best to ensure a smooth transition.</p>
      `,
      accent: "#111827",
    }),
  },
  {
    title: "interview thank you (candidate)",
    category: "interview",
    description: "A candidate thank-you email after an interview.",
    image: "/images/templates/interview.svg",
    html: baseWrap({
      title: "Interview Thank You",
      heading: "Thank you for the interview",
      preheader: "Appreciation note after the interview.",
      body: `
        <p style="margin:0;">Hi {{interviewer_name}},</p>
        <p style="margin:10px 0 0 0;">Thank you for taking the time to speak with me about the <strong>{{job_title}}</strong> position.</p>
        <p style="margin:10px 0 0 0;">I’m excited about the opportunity and happy to share additional information if needed.</p>
        <p style="margin:18px 0 0 0;">Best regards,<br/>{{candidate_name}}</p>
      `,
      accent: "#7c3aed",
    }),
  },
];

async function run() {
  await mongoose.connect(mongoUrl);

  await Template.deleteMany({});
  await Template.insertMany(
    templates.map((t) => ({
      title: t.title,
      category: t.category,
      description: t.description,
      image: t.image,
      html: t.html,
      usedCount: 0,
      updatedAt: new Date(),
    }))
  );

  console.log(`Seeded ${templates.length} templates into emailtemplates`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
