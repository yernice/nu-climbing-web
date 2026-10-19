// Google Apps Script for the NU Climbing registrations sheet.
// Paste into the sheet's Extensions > Apps Script and deploy as a web app (steps in back/README.md).
// The backend posts every new registration here; each event gets its own tab.

// Must be exactly the same as SHEETS_SECRET in back/.env. Never commit the real value.
const SECRET = 'PASTE SHEETS_SECRET FROM back/.env HERE';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== SECRET) return reply({ ok: false, error: 'wrong secret' });

  // Two registrations arriving together must not both create the same tab.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const tabName = (data.event + ' (' + data.eventDate + ')').replace(/[\[\]*?\/\\:]/g, ' ').slice(0, 95);
    let sheet = book.getSheetByName(tabName);
    if (!sheet) {
      sheet = book.insertSheet(tabName);
      sheet.appendRow(['ID', 'Registered at', 'Name', 'Email', 'Phone']);
      sheet.setFrozenRows(1);
      sheet.getRange('1:1').setFontWeight('bold');
    }

    // The backend may resend a registration; keep one row per registration ID.
    const existing = sheet.getRange('A:A').createTextFinder(String(data.id)).matchEntireCell(true).findNext();
    if (!existing) {
      sheet.appendRow([data.id, data.registeredAt, asText(data.name), asText(data.email), asText(data.phone)]);
    }
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Visitors type these values. A leading ' makes Sheets show "=..." or "+7 ..." as plain text
// instead of running it as a formula or turning a phone number into a number.
function asText(value) {
  const text = String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
