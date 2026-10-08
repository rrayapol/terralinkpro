import Dashboard from './sections/Dashboard';
import { LaunchOffer } from './sections/LaunchOffer';
import { Founder } from './sections/Founder';
import { Navbar } from './components/Navbar';
import { Hero, Features, Technology } from './sections/Product';
import { Showcase } from './sections/Showcase';
import { FAQ, Contact, Footer } from './sections/Engagement';
export default function App(){if(/^\/dashboard\/?$/.test(window.location.pathname))return <Dashboard/>;return <><a className="skip-link" href="#main">Skip to content</a><Navbar/><main id="main"><Hero/><Showcase/><LaunchOffer/><Features/><Technology/><Founder/><FAQ/><Contact/></main><Footer/></>;}


