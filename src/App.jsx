import { useState, useEffect, useRef, useCallback } from 'react'

const ACCENT_COLORS = ['#FF5229', '#FF8204', '#FFAF01', '#E51300', '#C1001A']

function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function ScrollReveal({ children, className = '' }) {
  const ref = useScrollReveal()
  return <div ref={ref} className={`scroll-reveal ${className}`}>{children}</div>
}

function PixelLogo({ size = 24 }) {
  const grid = [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ]
  const colors = ['#FF5229', '#E51300', '#FF8204', '#C1001A', '#FFAF01']
  const px = size / 5
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect key={`${x}-${y}`} x={x * px} y={y * px} width={px} height={px} fill={colors[(x + y) % colors.length]} />
          ) : null
        )
      )}
    </svg>
  )
}

function PixelCat({ x, y, cellSize }) {
  const catPixels = [
    [0,0,1],[2,0,1],[0,1,1],[1,1,1],[2,1,1],
    [0,2,1],[1,2,1],[2,2,1],[0,3,1],[2,3,1],
  ]
  return (
    <g>
      {catPixels.map(([cx, cy, _], i) => (
        <rect
          key={i}
          x={(x + cx) * cellSize}
          y={(y + cy) * cellSize}
          width={cellSize}
          height={cellSize}
          fill="#101013"
          stroke="#1A1A1E"
          strokeWidth={0.5}
        />
      ))}
      <rect x={(x + 0) * cellSize + cellSize * 0.25} y={(y + 1) * cellSize + cellSize * 0.25} width={cellSize * 0.3} height={cellSize * 0.3} fill="#FFAF01" rx={1} />
      <rect x={(x + 2) * cellSize - cellSize * 0.05} y={(y + 1) * cellSize + cellSize * 0.25} width={cellSize * 0.3} height={cellSize * 0.3} fill="#FFAF01" rx={1} />
    </g>
  )
}

function PixelGrid() {
  const [tiles, setTiles] = useState([])
  const cols = 32
  const rows = 10
  const containerRef = useRef(null)

  useEffect(() => {
    const initial = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        initial.push({
          id: `${r}-${c}`,
          color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
          opacity: 0.3 + Math.random() * 0.7,
        })
      }
    }
    setTiles(initial)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTiles(prev => {
        const next = [...prev]
        const count = 8 + Math.floor(Math.random() * 12)
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * next.length)
          next[idx] = {
            ...next[idx],
            color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
            opacity: 0.3 + Math.random() * 0.7,
          }
        }
        return next
      })
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const cellSize = 100 / cols
  const viewH = (rows / cols) * 100

  return (
    <div ref={containerRef} className="w-full relative mt-8 md:mt-12">
      <svg viewBox={`0 0 100 ${viewH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {tiles.map((tile, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          return (
            <rect
              key={tile.id}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={tile.color}
              opacity={tile.opacity}
              style={{ transition: 'fill 0.8s ease, opacity 0.8s ease' }}
            />
          )
        })}

        <g style={{ animation: 'rotateDiamond 8s linear infinite', transformOrigin: `${14 * cellSize + cellSize / 2}px ${3 * cellSize + cellSize / 2}px` }}>
          <rect
            x={14 * cellSize}
            y={3 * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#E51300"
            transform={`rotate(45, ${14 * cellSize + cellSize / 2}, ${3 * cellSize + cellSize / 2})`}
          />
        </g>

        <PixelCat x={20} y={6} cellSize={cellSize} />

        <text x={1 * cellSize} y={(rows - 1) * cellSize} fill="#FAFAF4" fontSize={cellSize * 0.65} fontFamily="'Roboto Mono', monospace" fontWeight="500" letterSpacing="0.15em" opacity="0.85">
          FRONTIER AI
        </text>
        <text x={22 * cellSize} y={2 * cellSize} fill="#FAFAF4" fontSize={cellSize * 0.65} fontFamily="'Roboto Mono', monospace" fontWeight="500" letterSpacing="0.15em" opacity="0.85">
          IN YOUR HANDS
        </text>
      </svg>
    </div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = ['Products', 'Solutions', 'Research', 'Developers', 'Blog', 'Customers', 'Company']

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg-primary/95 backdrop-blur-sm border-b border-border-subtle' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="#" className="flex-shrink-0"><PixelLogo size={28} /></a>
          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <a key={l} href="#" className="text-text-primary/70 hover:text-text-primary text-[14px] font-medium transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-text-primary/60 hover:text-text-primary transition-colors" aria-label="Toggle theme">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </button>
          <button className="px-4 py-[7px] text-[13px] font-medium text-text-primary border border-text-primary/20 rounded-full hover:border-text-primary/40 transition-colors">
            Start building <span className="ml-1 text-[10px]">&#9662;</span>
          </button>
          <button className="px-4 py-[7px] text-[13px] font-medium bg-text-primary text-bg-primary rounded-full hover:bg-text-primary/90 transition-colors">
            Contact sales <span className="ml-0.5">&#8250;</span>
          </button>
        </div>
        <button className="lg:hidden text-text-primary" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-bg-primary border-t border-border-subtle px-6 py-4 space-y-3">
          {links.map(l => (
            <a key={l} href="#" className="block text-text-primary/70 hover:text-text-primary text-[15px]">{l}</a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button className="px-4 py-2 text-[13px] font-medium text-text-primary border border-text-primary/20 rounded-full">Start building</button>
            <button className="px-4 py-2 text-[13px] font-medium bg-text-primary text-bg-primary rounded-full">Contact sales</button>
          </div>
        </div>
      )}
    </nav>
  )
}

function FeaturedNewsCard() {
  const items = [
    "In-region inference, open models, and new European infrastructure for sovereign AI.",
    "Introducing Shieldstral — advanced content safety for AI deployments.",
    "Introducing Robostral Navigate — autonomous navigation intelligence.",
    "Introducing Mistral OCR 4 — state-of-the-art document understanding.",
  ]
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length)
  const next = () => setIdx(i => (i + 1) % items.length)

  return (
    <div className="bg-bg-secondary border border-border-subtle p-4 max-w-sm">
      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-primary/50 mb-2">Featured News</div>
      <p className="text-[13px] text-text-primary/80 leading-relaxed mb-3">{items[idx]}</p>
      <div className="flex gap-2">
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center border border-text-primary/10 text-text-primary/50 hover:text-text-primary hover:border-text-primary/30 transition-colors text-sm">&lsaquo;</button>
        <button onClick={next} className="w-7 h-7 flex items-center justify-center border border-text-primary/10 text-text-primary/50 hover:text-text-primary hover:border-text-primary/30 transition-colors text-sm">&rsaquo;</button>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-16 relative">
      <div className="max-w-[1400px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-12 pt-12 md:pt-20">
          <h1 className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[90px] font-normal leading-[1.05] tracking-tight">
            Frontier AI.<br />In your hands.
          </h1>
          <p className="text-[18px] md:text-[22px] lg:text-[24px] text-text-primary/60 leading-relaxed max-w-md lg:pt-4">
            We help organizations build tailored AI systems to solve the world's hardest problems.
          </p>
        </div>
        <PixelGrid />
        <div className="flex flex-col sm:flex-row justify-between items-end mt-6 gap-4">
          <div />
          <div className="flex items-end gap-8">
            <FeaturedNewsCard />
            <div className="hidden md:flex flex-col gap-1 pb-4">
              {[0, 1, 2].map(i => (
                <span key={i} className="text-text-primary/30 text-lg" style={{ animation: `pulse 2s ease-in-out ${i * 0.3}s infinite` }}>&#8595;</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CustomerCard({ tag, statement }) {
  return (
    <div className="bg-bg-secondary border border-border-subtle p-6 flex flex-col justify-between group hover:border-text-primary/10 transition-colors">
      <div>
        <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-primary/40 block mb-3">{tag}</span>
        <p className="text-[15px] md:text-[16px] text-text-primary/90 leading-snug">{statement}</p>
      </div>
      <a href="#" className="inline-flex items-center gap-1 text-[13px] text-text-primary/50 hover:text-text-primary mt-4 transition-colors group-hover:text-text-primary/70">
        Learn more <span>&#8250;</span>
      </a>
    </div>
  )
}

function CustomerProof() {
  const customers = [
    { tag: 'Financial Services', statement: 'HSBC boosts productivity with Mistral.' },
    { tag: 'Technology and Software', statement: 'ASML accelerates advanced semiconductor lithography with Mistral.' },
    { tag: 'Transportation and Logistics', statement: 'CMA CGM streamlines global maritime operations with Mistral.' },
    { tag: 'Public Sector', statement: 'Austrian Academy of Sciences unlocks Ancient Greek with Mistral.' },
    { tag: 'Public Sector', statement: 'The European Patent Office accelerates innovation with Mistral.' },
    { tag: 'Manufacturing', statement: 'Stellantis accelerates automotive innovation with Mistral.' },
  ]
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((c, i) => <CustomerCard key={i} tag={c.tag} statement={c.statement} />)}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ProductCard({ name, description, accent }) {
  return (
    <div className="bg-bg-secondary border border-border-subtle p-6 group hover:border-text-primary/10 transition-colors flex flex-col">
      <div className={`w-8 h-8 mb-4 rounded-sm`} style={{ backgroundColor: accent || '#FF5229', opacity: 0.8 }} />
      <h3 className="text-[18px] md:text-[20px] font-medium mb-2">{name}</h3>
      {description && <p className="text-[14px] text-text-primary/50 leading-relaxed">{description}</p>}
    </div>
  )
}

function ProductGrid() {
  const products = [
    { name: 'Vibe', description: 'AI agent for long-horizon work.', accent: '#FF5229' },
    { name: 'Studio', description: 'Build, test, and run AI agents and apps.', accent: '#FF8204' },
    { name: 'Forge', description: 'Train, align, and evaluate custom AI models.', accent: '#FFAF01' },
    { name: 'Applied AI services', description: null, accent: '#E51300' },
    { name: 'Frontier models', description: null, accent: '#C1001A' },
    { name: 'AI Cloud', description: 'Frontier-scale infrastructure for training and inference.', accent: '#0082E6' },
  ]
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-normal tracking-tight mb-10 md:mb-14">
            Do it all with Mistral.
          </h2>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => <ProductCard key={i} {...p} />)}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function AccentGraphic({ colors, variant = 0 }) {
  const [offsets, setOffsets] = useState(() =>
    Array.from({ length: 16 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, s: 10 + Math.random() * 30 }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setOffsets(prev =>
        prev.map(p => ({
          x: p.x + (Math.random() - 0.5) * 4,
          y: p.y + (Math.random() - 0.5) * 4,
          s: Math.max(8, Math.min(40, p.s + (Math.random() - 0.5) * 4)),
        }))
      )
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full aspect-square max-w-[400px] relative overflow-hidden bg-bg-primary border border-border-subtle">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {offsets.map((o, i) => (
          <rect
            key={i}
            x={o.x}
            y={o.y}
            width={o.s}
            height={o.s}
            fill={colors[i % colors.length]}
            opacity={0.4 + (i % 3) * 0.2}
            style={{ transition: 'all 1.2s ease-in-out' }}
          />
        ))}
      </svg>
    </div>
  )
}

function FeatureSection({ heading, discover, discoverLabel, paragraph, tags, reversed, colors }) {
  return (
    <section className="py-16 md:py-28 border-t border-border-subtle">
      <div className="max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-start`}>
            <div className="flex-1 min-w-0">
              <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-normal tracking-tight mb-4">{heading}</h2>
              <a href="#" className="inline-flex items-center gap-1 text-accent-orange hover:text-accent-bright-orange text-[15px] font-medium mb-5 transition-colors">
                {discoverLabel} <span>&#8250;</span>
              </a>
              <p className="text-[16px] md:text-[18px] text-text-primary/60 leading-relaxed mb-8 max-w-lg">{paragraph}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {tags.map((t, i) => (
                  <span key={i} className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-primary/35 leading-relaxed">
                    {t}{i < tags.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1 flex justify-center w-full">
              <AccentGraphic colors={colors} variant={reversed ? 1 : 0} />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function FeatureSections() {
  const sections = [
    {
      heading: 'Autonomous work.',
      discoverLabel: 'Discover Vibe',
      paragraph: 'AI agent for long-horizon tasks, fluent in your knowledge and tools.',
      tags: ['Enterprise Knowledge Search', 'Structured Data Analysis', 'Document and Report Synthesis', 'Multi-Step Task Scheduling', 'Persistent Memory and Reusable Skills'],
      colors: ['#FF5229', '#E51300', '#C1001A'],
    },
    {
      heading: 'Autonomous coding.',
      discoverLabel: 'Discover Vibe for code',
      paragraph: 'Ship faster with a stack that meets devs where they work.',
      tags: ['Async Code Generation', 'Architecture-Aware Reasoning', 'Legacy Code Translation', 'Automated CI/CD and Code Reviews', 'Test and Documentation Authoring'],
      colors: ['#FF8204', '#FFAF01', '#FF5229'],
    },
    {
      heading: 'AI application development.',
      discoverLabel: 'Discover Studio',
      paragraph: 'Build and deploy AI apps with complete control over every component.',
      tags: ['Agent Orchestration', 'End-to-End Observability', 'Unified AI Registry', 'Evals, Judges, and Guardrails', 'Full Deployment Portability'],
      colors: ['#FFAF01', '#FF8204', '#E51300'],
    },
    {
      heading: 'Custom model development.',
      discoverLabel: 'Discover Forge',
      paragraph: 'Turn proprietary knowledge into model intelligence with full lifecycle control.',
      tags: ['Enterprise Domain Adaptation', 'End-to-End Model Training', 'Reinforcement Learning and Distillation', 'Synthetic Data Generation', 'Evaluation and Lifecycle Management'],
      colors: ['#E51300', '#C1001A', '#FF5229'],
    },
    {
      heading: 'Infrastructure for training and inference.',
      discoverLabel: 'Discover Compute',
      paragraph: "The frontier-grade infrastructure and orchestration platform behind Mistral's own models is now yours to build on.",
      tags: ['Dedicated GPU Clusters'],
      colors: ['#0082E6', '#B9DAFF', '#FF5229'],
    },
    {
      heading: 'Advanced R&D.',
      discoverLabel: 'Discover applied AI',
      paragraph: 'Tailored, domain-specialized AI developed in close collaboration with your teams.',
      tags: ['Model Customization', 'Value Realization', 'Deployment Services', 'Use Case Acceleration', 'Enterprise Activation'],
      colors: ['#C1001A', '#E51300', '#FF8204'],
    },
  ]

  return (
    <>
      {sections.map((s, i) => (
        <FeatureSection key={i} {...s} reversed={i % 2 === 1} />
      ))}
    </>
  )
}

function ServiceCard({ title, description }) {
  return (
    <div className="bg-bg-secondary border border-border-subtle p-6 hover:border-text-primary/10 transition-colors">
      <h3 className="text-[17px] font-medium mb-2">{title}</h3>
      <p className="text-[14px] text-text-primary/50 leading-relaxed">{description}</p>
    </div>
  )
}

function ServicesSection() {
  const services = [
    { title: 'Use case acceleration.', description: 'Prioritize high-value use cases and take them to production fast.' },
    { title: 'Elite AI expertise.', description: 'A cross-functional team that takes initiatives from kickoff to production at scale.' },
    { title: 'Deep customization.', description: 'Customize and optimize models for your domain.' },
    { title: 'Enterprise activation.', description: 'Deploy AI in your environment with full control.' },
  ]
  return (
    <section className="py-20 md:py-32 border-t border-border-subtle">
      <div className="max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-[32px] md:text-[44px] lg:text-[52px] font-normal tracking-tight mb-3">Supported by expert partnership.</h2>
          <p className="text-[16px] md:text-[18px] text-text-primary/50 leading-relaxed mb-10 max-w-2xl">
            Work with world-class AI scientists to enable transformation that drives impact.
          </p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => <ServiceCard key={i} {...s} />)}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function DeploymentSection() {
  const deployments = [
    { title: 'Self-hosted.', description: 'Deploy Studio on virtual cloud, edge, or on-premises infrastructure with complete data sovereignty.' },
    { title: 'Mistral cloud.', description: "Get started with Studio hosted on Mistral's infrastructure, with data hosted in the EU." },
    { title: 'Cloud providers.', description: 'Access Studio via Google Cloud, AWS, Azure, SAP, IBM, Snowflake, NVIDIA, Outscale, and more.' },
  ]
  return (
    <section className="py-20 md:py-32 border-t border-border-subtle">
      <div className="max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-primary/50 mb-3">AI Deployments Designed for Privacy.</div>
          <p className="text-[16px] md:text-[18px] text-text-primary/50 leading-relaxed mb-10 max-w-2xl">
            Deploy anywhere. Own everything. Keep your data exactly where it belongs.
          </p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deployments.map((d, i) => (
              <div key={i} className="bg-bg-secondary border border-border-subtle p-6">
                <h3 className="text-[17px] font-medium mb-2">{d.title}</h3>
                <p className="text-[14px] text-text-primary/50 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-20 md:py-32 border-t border-border-subtle">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <ScrollReveal>
          <div className="font-mono text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-text-primary/60 mb-4">Own Your Own AI Future.</div>
          <p className="text-[18px] md:text-[22px] text-text-primary/60 leading-relaxed max-w-xl mx-auto mb-8">
            Build, customize, and deploy tailored AI solutions with complete control.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 text-[14px] font-medium bg-text-primary text-bg-primary rounded-sm hover:bg-text-primary/90 transition-colors">
              Start building
            </button>
            <button className="px-6 py-3 text-[14px] font-medium text-text-primary border border-text-primary/20 rounded-sm hover:border-text-primary/40 transition-colors">
              Contact sales
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Footer() {
  const columns = [
    { title: 'Products', links: ['Vibe', 'Studio', 'Forge', 'AI Cloud', 'Frontier Models', 'Applied AI'] },
    { title: 'Solutions', links: ['Financial Services', 'Technology', 'Manufacturing', 'Public Sector', 'Transportation'] },
    { title: 'Developers', links: ['Documentation', 'API Reference', 'Community', 'GitHub', 'Discord'] },
    { title: 'Company', links: ['About', 'Careers', 'Blog', 'Newsroom', 'Contact'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Security'] },
  ]
  return (
    <footer className="border-t border-border-subtle py-16">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-shrink-0">
            <PixelLogo size={32} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 flex-1">
            {columns.map((col, i) => (
              <div key={i}>
                <h4 className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-primary/40 mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-[13px] text-text-primary/50 hover:text-text-primary transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-text-primary/30">&copy; 2024 Mistral AI. All rights reserved.</p>
          <div className="flex gap-4">
            {['X', 'LinkedIn', 'GitHub', 'Discord'].map((s, i) => (
              <a key={i} href="#" className="text-[12px] text-text-primary/30 hover:text-text-primary/60 transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="bg-bg-primary text-text-primary min-h-screen">
      <Navbar />
      <Hero />
      <CustomerProof />
      <ProductGrid />
      <FeatureSections />
      <ServicesSection />
      <DeploymentSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
