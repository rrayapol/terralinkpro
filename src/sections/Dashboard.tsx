import { useEffect, useState } from 'react';
import { cloud, cloudReady, cognito } from '../lib/api';
import type { Referral } from '../lib/api';
import './dashboard.css';

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [challenge, setChallenge] = useState('');
  const [username, setUsername] = useState('');
  const [rows, setRows] = useState<Referral[]>([]);
  const [cursor, setCursor] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { document.title = 'Referral Dashboard | TERRALINKPRO'; const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex, nofollow'; document.head.append(meta); return () => meta.remove(); }, []);
  async function load(access: string, next = '') {
    const response = await fetch(`${cloud.api}/enquiries${next ? `?cursor=${encodeURIComponent(next)}` : ''}`, { headers: { Authorization: `Bearer ${access}` }, cache: 'no-store' });
    if (response.status === 401 || response.status === 403) { setToken(''); setRows([]); throw new Error('Your session has expired. Please sign in again.'); }
    if (!response.ok) throw new Error('Could not load enquiries. Please try again.');
    const data = await response.json();
    setRows(previous => next ? [...previous, ...data.items] : data.items); setCursor(data.cursor || '');
  }
  const filtered = rows.filter(row => `${row.name} ${row.email} ${row.referral}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="dashboard"><header><a href="/">TERRALINKPRO<span>Referral workspace</span></a>{token && <button onClick={() => { setToken(''); setRows([]); setCursor(''); setError(''); }}>Sign out</button>}</header>
    <main><div className="dash-heading"><div><p className="dash-eyebrow">BUSINESS OVERVIEW</p><h1>Referral dashboard</h1><p>Customer enquiries and the people who referred them.</p></div><a href="/">View website ↗</a></div>
    {!cloudReady ? <section className="dash-login"><h2>Connect your AWS backend</h2><p>The dashboard is ready to connect. Deploy the included AWS setup and configure the website to enable private admin sign-in and shared referral records.</p><p>No customer records are shown or stored in this preview.</p></section> : !token ? <form className="dash-login" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError(''); const form = event.currentTarget; const data = new FormData(form);
      try {
        const result = challenge ? await cognito('RespondToAuthChallenge', { ClientId: cloud.client, ChallengeName: 'NEW_PASSWORD_REQUIRED', Session: challenge, ChallengeResponses: { USERNAME: username, NEW_PASSWORD: data.get('password') } }) : await cognito('InitiateAuth', { ClientId: cloud.client, AuthFlow: 'USER_PASSWORD_AUTH', AuthParameters: { USERNAME: data.get('email'), PASSWORD: data.get('password') } });
        if (result.ChallengeName === 'NEW_PASSWORD_REQUIRED') { setChallenge(result.Session); setUsername(result.ChallengeParameters?.USER_ID_FOR_SRP || String(data.get('email'))); form.reset(); }
        else if (result.AuthenticationResult?.AccessToken) { const access = result.AuthenticationResult.AccessToken; setChallenge(''); await load(access); setToken(access); }
        else throw new Error('This account requires an additional authentication step. Contact your administrator.');
      } catch (err) { setError(err instanceof Error ? err.message : 'Sign-in failed.'); } finally { setBusy(false); }
    }}><h2>{challenge ? 'Set your new password' : 'Admin sign-in'}</h2><p>Only accounts invited by the business owner can access enquiries.</p>{!challenge && <label>Email address<input name="email" type="email" autoComplete="username" required/></label>}<label>{challenge ? 'New password (12+ characters)' : 'Password'}<input name="password" type="password" minLength={challenge ? 12 : undefined} autoComplete={challenge ? 'new-password' : 'current-password'} required/></label><button disabled={busy}>{busy ? 'Please wait…' : challenge ? 'Set password & sign in' : 'Sign in'}</button><p className="dash-small">Need a password reset? Ask the business owner to reset your account in AWS Cognito.</p></form> : <>
      <div className="dash-stats">{[['Enquiries loaded',rows.length],['With referral code',rows.filter(row=>row.referral).length],['Distinct codes',new Set(rows.map(row=>row.referral).filter(Boolean)).size]].map(([label,value])=><section key={label}><span>{label}</span><strong>{value}</strong></section>)}</div>
      <section className="dash-records"><div className="dash-toolbar"><label>Search loaded enquiries<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Name, email or referral code"/></label><button disabled={busy} onClick={async()=>{setBusy(true);setError('');try{await load(token);}catch(err){setError(String(err));}finally{setBusy(false);}}}>Refresh</button></div><p className="dash-small">Enquiries are not confirmed sales. Referral codes are customer supplied and unverified. Counts cover loaded records only.</p>
      {!filtered.length ? <div className="dash-empty"><h2>{rows.length ? 'No matching enquiries' : 'No enquiries yet'}</h2><p>{rows.length ? 'Try another name or code.' : 'New website enquiries will appear here once submitted.'}</p></div> : <div className="dash-table-wrap"><table><thead><tr><th>Received</th><th>Customer</th><th>Referral code</th><th>Enquiry</th></tr></thead><tbody>{filtered.map(row=><tr key={row.id}><td>{new Date(row.createdAt).toLocaleString()}</td><td><strong>{row.name}</strong><span>{row.email}</span></td><td><code>{row.referral || 'No code'}</code></td><td>{row.message}</td></tr>)}</tbody></table></div>}
      {cursor && <button disabled={busy} onClick={async()=>{setBusy(true);setError('');try{await load(token,cursor);}catch(err){setError(String(err));}finally{setBusy(false);}}}>Load more enquiries</button>}</section></>}
    {error && <p role="alert" className="dash-error">{error}</p>}</main></div>;
}
