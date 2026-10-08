import { useRef, useState } from 'react';
import { brand } from '../data/content';
import { ReferralField } from './ReferralField';
import { initialReferral, whatsappEnquiryUrl } from '../lib/referrals';
import { cloudReady, saveEnquiry } from '../lib/api';

export function EnquiryForm() {
  const [referral, setReferral] = useState(initialReferral);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const request = useRef({ payload: '', id: '' });
  return <form onSubmit={async event => {
    event.preventDefault(); if (busy) return; const form = event.currentTarget;
    const data = new FormData(form); const payload = { name: String(data.get('name')).trim(), email: String(data.get('email')).trim(), message: String(data.get('message')).trim(), referral: referral.trim().toUpperCase() };
    const enquiry = `TERRALINKPRO enquiry\nName: ${payload.name}\nEmail: ${payload.email}\nReferral code (unverified): ${payload.referral || 'None'}\n\n${payload.message}`;
    setBusy(true); setStatus(''); setWhatsapp('');
    try {
      const serialized = JSON.stringify(payload);
      if (request.current.payload !== serialized) request.current = { payload: serialized, id: crypto.randomUUID() };
      if (cloudReady) {
        await saveEnquiry(payload, request.current.id, String(data.get('website') || ''));
        setStatus('Thank you. Your enquiry has been saved for the TERRALINKPRO team.');
        if (brand.whatsapp) setWhatsapp(whatsappEnquiryUrl(brand.whatsapp, enquiry));
      } else if (brand.whatsapp) { setWhatsapp(whatsappEnquiryUrl(brand.whatsapp, enquiry)); setStatus('Continue below and press Send in WhatsApp. This website has not saved your enquiry.'); }
      else if (brand.email) { window.location.href = `mailto:${brand.email}?subject=TERRALINKPRO%20enquiry&body=${encodeURIComponent(enquiry)}`; setStatus('Send your enquiry from your email app.'); }
      else setStatus(`Preview complete${payload.referral ? ` with referral code ${payload.referral} (unverified)` : ''}. Your enquiry has not been sent or stored. Contact details will be added when available.`);
    } catch (err) { setStatus(err instanceof Error ? err.message : 'Could not save your enquiry. Please try again.'); } finally { setBusy(false); }
  }}><div className="form-heading"><h3>Let’s connect</h3><span>{cloudReady ? 'SEND AN ENQUIRY' : 'CONTACT PREVIEW'}</span></div>
    <label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={100}/>
    <label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254}/>
    <ReferralField value={referral} onChange={setReferral}/>
    <label htmlFor="message">Your message</label><textarea id="message" name="message" placeholder="What would you like to know?" rows={3} required maxLength={2000}/>
    <div style={{display:'none'}} aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    {cloudReady && <p className="form-note">By submitting, you agree that TERRALINKPRO may store your name, email, message and referral code to respond to your enquiry.</p>}
    <button className="button" type="submit" disabled={busy}>{busy ? 'Saving…' : cloudReady ? 'Send enquiry' : brand.whatsapp ? 'Prepare WhatsApp enquiry' : 'Preview enquiry'}</button>
    {whatsapp && <a className="button" href={whatsapp} target="_blank" rel="noreferrer">Continue on WhatsApp</a>}
    <p className="form-note">{cloudReady ? 'Your enquiry is shared with the TERRALINKPRO team.' : 'Cloud storage is not connected. Preview entries are not stored.'} Please do not include sensitive health information.</p><p role="status" className="form-status">{status}</p>
  </form>;
}
