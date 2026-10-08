# AWS referral dashboard setup

The frontend is ready at `/dashboard`. It is NOT connected to AWS until the stack is deployed and the frontend rebuilt with its outputs. No AWS resources have been created by this delivery.

## 1. Create backend
In AWS Console choose your intended region, open CloudFormation > Create stack > With new resources (standard). Upload `aws/cloudformation.json`. Name the stack `terralinkpro-referrals`. Set SiteOrigin to `https://www.terralinkpro.net` (no trailing slash). Acknowledge creation of IAM roles and create the stack. Resources incur AWS usage charges. The template provisions DynamoDB (with point-in-time recovery), Lambda, HTTP API and a dedicated Cognito pool. Public sign-up is disabled. Wait for CREATE_COMPLETE.

## 2. Connect website
From the stack Outputs copy ApiUrl, Region and ClientId. In the project create `.env.local` using `.env.example`:

```
VITE_REFERRAL_API_URL=<ApiUrl>
VITE_AWS_REGION=<Region>
VITE_COGNITO_CLIENT_ID=<ClientId>
```

These are public configuration identifiers, never put AWS access keys or passwords in VITE variables. Run `npm run build` and redeploy the CONTENTS of dist to AWS Amplify. The build includes a dashboard/index.html entry. If the host returns a 404 for `/dashboard`, add an Amplify SPA rewrite to /index.html (200), preserving existing asset routes. `/dashboard/` is also supported. Only the www origin is allowed by the API; redirect the apex to www at your host.

## 3. Invite the administrator
Open Cognito > User pools > the pool matching the UserPoolId output > Users > Create user. Use your admin email, mark email verified, choose a temporary password and send the invitation. Do not share passwords in this chat. All users invited to this dedicated pool are administrators, so only invite trusted staff. Visit https://www.terralinkpro.net/dashboard and sign in, then set a permanent password (12+ characters, uppercase/lowercase/number/symbol). This implementation supports password sign-in and initial password change. For a reset, use Cognito's administrator reset flow; MFA challenge flows are not implemented. Sessions are memory-only and expire after one hour; refreshing the page requires signing in again.

## 4. Confirm before launch
Submit a test enquiry with code TEST001 from the public site. Confirm it appears after admin sign-in. Verify unauthenticated GET /enquiries returns 401/403. Test search, refresh, pagination and sign-out. Submitted codes are unverified, not verified commissions or sales. Each page loads up to 100 records; search/counts apply to loaded rows only, and scan results are not globally ordered. No sample customers are seeded.

The public POST endpoint validates fields, limits payload size and uses idempotent request IDs. API throttling and a honeypot provide basic abuse controls; they do not prevent distributed spam. Add stronger bot protection if needed. No automatic retention/deletion policy is configured: establish an operating retention policy and delete records in DynamoDB as needed. Update the website's operator contact and privacy policy before collecting real customer enquiries. DynamoDB is retained on stack deletion to avoid losing records; remove separately when intentionally retiring the service.

WhatsApp is optional: set brand.whatsapp in src/data/content.ts to your business international number. Saving to AWS works without WhatsApp. A saved enquiry does not prove a WhatsApp message was sent.

## Maintenance
Edit aws/handler.cjs then run `node aws/generate-template.mjs` before updating the stack. AWS includes the DynamoDB SDK in the selected Node runtime. No account credentials are embedded. The deployment has not been tested in a live AWS account in this workspace.
