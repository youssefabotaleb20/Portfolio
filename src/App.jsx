import Toolbar from './components/Toolbar.jsx'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import Services from './components/Services.jsx'
import Skills from './components/Skills.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a href="#work" className="mono sr-only z-[60] bg-ink p-3 text-ground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to work
      </a>
      <Toolbar />
      <main>
        <Hero />
        <Work />
        <Services />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
