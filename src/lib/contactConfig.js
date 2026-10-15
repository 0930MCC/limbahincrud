// Single source of truth for CS / internal contact details, so a future number/email change is
// a one-line edit instead of a grep across the codebase.

// CS WhatsApp number customers get redirected to after submitting a quotation or registration.
// wa.me needs the number in international format with no leading 0 / spaces / punctuation.
export const CS_WHATSAPP_NUMBER = '628512800' + '5532'; // 0851 2800 5532 -> 62 851 2800 5532
export const CS_WHATSAPP_DISPLAY = '0851 2800 5532';

export function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CS_WHATSAPP_NUMBER}?text=${encoded}`;
}

// Email routing for the quotation + contract-draft emails, sent server-side from
// google-apps-script/Code.gs. Documented here too (the .gs constants are the ones that actually
// apply, this is just so the routing rule is visible from the frontend as well):
//   To:      the customer's own email address (so they receive their document)
//   Cc:      EMAIL_CC   (internal LIMBAHIN inbox)
//   Bcc:     EMAIL_BCC  (silent internal copy)
//   Subject: the customer's own email address
export const EMAIL_CC = ['limbahinindonesia@gmail.com'];
export const EMAIL_BCC = ['kelvinfiless@gmail.com'];
