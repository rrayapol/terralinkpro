import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Brand, Container } from './UI';
import { navigation } from '../data/content';
export function Navbar(){
 const [open,setOpen]=useState(false);const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const scroll=()=>setScrolled(window.scrollY>20);scroll();window.addEventListener('scroll',scroll,{passive:true});return()=>window.removeEventListener('scroll',scroll);},[]);
 useEffect(()=>{if(!open)return;const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);document.getElementById('menu-toggle')?.focus();}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[open]);
 return <header className={`navbar ${scrolled?'scrolled':''}`}><Container className="nav-inner"><Brand/><button id="menu-toggle" className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav id="navigation" aria-label="Main navigation" className={open?'nav-links open':'nav-links'}>{navigation.map(([name,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{name}</a>)}<a className="nav-cta" href="#features" onClick={()=>setOpen(false)}>Learn More</a></nav></Container></header>;
}
