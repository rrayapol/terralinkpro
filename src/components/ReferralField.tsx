import { useState } from 'react';
import { Link, Users } from 'lucide-react';

import { codePattern } from '../lib/referrals';

export function ReferralField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [shareLink, setShareLink] = useState('');
  const [status, setStatus] = useState('');
  async function copyLink() {
    const code = value.trim().toUpperCase();
    if (!codePattern.test(code)) {
      setStatus('Enter 3–32 letters, numbers, hyphens or underscores, starting with a letter or number.');
      return;
    }
    const url = new URL('https://www.terralinkpro.net/');
    url.searchParams.set('ref', code);
    const link = url.toString();
    setShareLink(link);
    try {
      await navigator.clipboard.writeText(link);
      setStatus('Referral link copied. Code approval is still required.');
    } catch {
      setStatus('Select and copy your referral link below.');
    }
  }
  return <div className="referral-panel">
    <label htmlFor="referral"><Users size={18} aria-hidden="true"/> Referred by someone? <span>Optional</span></label>
    <p id="referral-help">Add their referral code so it can accompany your enquiry.</p>
    <input id="referral" name="referral" value={value} onChange={event => { onChange(event.target.value.toUpperCase()); setShareLink(''); setStatus(''); }} placeholder="Enter referral code" minLength={3} maxLength={32} pattern="[A-Za-z0-9][A-Za-z0-9_\-]{2,31}" title="3–32 letters, numbers, hyphens or underscores; start with a letter or number." autoComplete="off" spellCheck={false} aria-describedby="referral-help referral-note"/>
    <p id="referral-note">Codes are subject to confirmation by TERRALINKPRO. Entering a code does not apply a discount.</p>
    <details className="referral-share"><summary><Link size={15} aria-hidden="true"/> Share a referral link</summary><p>Already have a code assigned by TERRALINKPRO? Enter it above and copy a link that fills it in for your visitors.</p><button type="button" className="referral-copy" onClick={copyLink}>Copy referral link</button>{shareLink && <label className="referral-link-label">Your referral link<input readOnly value={shareLink} onFocus={event => event.target.select()}/></label>}<p role="status">{status}</p></details>
  </div>;
}
