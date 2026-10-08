import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { brand } from '../data/content';
export function Container({children,className=''}:{children:ReactNode;className?:string}) { return <div className={`container ${className}`}>{children}</div>; }
export function Section({children,id,className=''}:{children:ReactNode;id?:string;className?:string}) { return <section id={id} className={`section ${className}`}><Container>{children}</Container></section>; }
export function Button({children,href,secondary=false}:{children:ReactNode;href:string;secondary?:boolean}) { return <a className={`button ${secondary?'secondary':''}`} href={href}>{children}</a>; }
export function Brand({footer=false}:{footer?:boolean}) {return <a className="brand" href="#home" aria-label={`${brand.name} home`}><span className="brand-image shine-surface"><img src="/brand-header.webp" alt="TERRALINKPRO — Naturally Connected" width="420" height="280" loading={footer?'lazy':'eager'}/></span></a>;}
export function Eyebrow({children}:{children:ReactNode}) {return <p className="eyebrow">{children}</p>;}
export function FeatureCard({icon:Icon,title,text,status}:{icon:LucideIcon;title:string;text:string;status?:string}) {return <article className="feature-card"><span className="icon-box"><Icon size={23} strokeWidth={1.4}/></span><h3>{title}</h3><p>{text}</p>{status&&<span className="status">{status}</span>}</article>;}
export function Signal({className=''}:{className?:string}) {return <svg aria-hidden="true" className={`signal ${className}`} viewBox="0 0 600 100" fill="none"><path d="M0 52H95L110 46L125 58L141 52H190L208 52L224 20L244 86L265 35L280 52H350L363 44L378 58L391 52H600" stroke="currentColor" strokeWidth="1.4"/><path d="M0 52H600" stroke="currentColor" strokeOpacity=".12"/></svg>;}


