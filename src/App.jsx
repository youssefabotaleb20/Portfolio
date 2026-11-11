import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Work from './components/Work.jsx'
import Services from './components/Services.jsx'
import Skills from './components/Skills.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'

export default function App() {
  return (
    <>
      <a href="#work" className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to work
      </a>
      <Cursor />
      <Nav />
      <main className="relative z-[2]">
        <Hero />
        <Marquee />
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
