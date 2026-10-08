/** International WhatsApp number, including country code. No enquiry is sent automatically. */
export function whatsappEnquiryUrl(number: string, enquiry: string) {
  const digits = number.replace(/[\s()+-]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(digits)) throw new Error('Configure a valid international WhatsApp number.');
  return `https://wa.me/${digits}?text=${encodeURIComponent(enquiry)}`;
}

export const codePattern = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;

export function initialReferral() {
  const code = (new URLSearchParams(window.location.search).get('ref') ?? '').trim().toUpperCase();
  return codePattern.test(code) ? code : '';
}

