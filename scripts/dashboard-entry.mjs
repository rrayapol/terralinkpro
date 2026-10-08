import fs from 'node:fs';
fs.mkdirSync('dist/dashboard',{recursive:true});
const html=fs.readFileSync('dist/index.html','utf8').replace('content="index, follow"','content="noindex, nofollow"').replace('<title>TERRALINKPRO | Naturally Connected</title>','<title>Referral Dashboard | TERRALINKPRO</title>').replace(/<link rel="canonical"[^>]+>/,'');
fs.writeFileSync('dist/dashboard/index.html',html);
