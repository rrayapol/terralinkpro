export const cloud = {
  api: (import.meta.env.VITE_REFERRAL_API_URL || '').replace(/\/$/, ''),
  region: import.meta.env.VITE_AWS_REGION || '',
  client: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
};
export const cloudReady = Boolean(cloud.api && cloud.region && cloud.client);
export type Referral = { id: string; createdAt: string; name: string; email: string; message: string; referral: string };
export async function cognito(action: string, body: object) {
  const response = await fetch(`https://cognito-idp.${cloud.region}.amazonaws.com/`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-amz-json-1.1', 'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}` }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Sign-in failed. Please try again.');
  return data;
}
export async function saveEnquiry(data: Omit<Referral, 'id' | 'createdAt'>, id: string, website: string) {
  const response = await fetch(`${cloud.api}/enquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, id, website }) });
  if (!response.ok) throw new Error(response.status === 429 ? 'Too many requests. Please wait and try again.' : 'Could not save your enquiry. Please try again.');
}
