import { useRef } from 'react'
import Navbar            from './components/Navbar.jsx'
import Hero              from './components/Hero.jsx'
import About             from './components/About.jsx'
import TechStack         from './components/TechStack.jsx'
import Projects          from './components/Projects.jsx'
import Contact           from './components/Contact.jsx'
import Footer            from './components/Footer.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import CustomCursor      from './components/CustomCursor.jsx'

export default function App() {
  const scrollRef = useRef(null)

  return (
    <>
      <CustomCursor />
      <Navbar scrollContainer={scrollRef} />
      <div
        ref={scrollRef}
        className="scroll-container"
        style={{ height: '100vh', overflowY: 'scroll' }}
      >
        <Hero scrollContainer={scrollRef} />

        {/* Particle canvas spans everything after the hero */}
        <div className="relative">
          <ParticleBackground />
          <About />
          <TechStack />
          <Projects />
          <Contact />
          <Footer scrollContainer={scrollRef} />
        </div>
      </div>
    </>
  )
}
