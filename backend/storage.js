import { JSONFilePreset } from "lowdb/node";

const defaultData = { emails: [] };

const db = await JSONFilePreset("emails.json", defaultData);

// Save new OR update existing email
export async function saveEmail(email) {
  const idx = db.data.emails.findIndex(e => e.id === email.id);

  if (idx !== -1) {
    // UPDATE existing email
    db.data.emails[idx] = email;
  } else {
    // CREATE new email
    db.data.emails.push(email);
  }

  await db.write();
}

export async function deleteEmail(id) {
  db.data.emails = db.data.emails.filter((e) => e.id !== id);
  await db.write();
}

export async function clearEmails() {
  db.data.emails = [];
  await db.write();
}

export function getEmails() {
  return db.data.emails;
}
