import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Stats from '../components/Stats';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CommandPalette from '../components/CommandPalette';
import MobileActionBar from '../components/MobileActionBar';

/*
 * The main single-page portfolio (route "/"). The AI voice concierge no longer
 * lives here — it's on the dedicated /qlue-live demonstration screen.
 */
const Portfolio = () => (
  <>
    {/* Command Palette — Cmd/Ctrl+K (button on mobile) */}
    <CommandPalette />

    {/* Sticky mobile action bar (Résumé / Contact) */}
    <MobileActionBar />

    <Navbar />
    <main>
      <Hero />
      <About />
      <Skills />
      <Stats />
      <Projects />
      <Contact />
    </main>
    <Footer />
  </>
);

export default Portfolio;
