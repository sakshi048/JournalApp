'use client'

import { useState } from 'react'
import { BookOpen, Menu, X, ChevronDown } from 'lucide-react'

type View = 'landing' | 'signup' | 'login'

function Header({ setView, onScroll }: { setView: (view: View) => void; onScroll: (id: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (id: string) => {
    onScroll(id)
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50/95 backdrop-blur-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center">
            <BookOpen size={18} className="text-amber-50" />
          </div>
          <div>
            <div className="font-serif text-sm font-semibold text-amber-900">JournalApp</div>
            <div className="text-xs text-amber-700 font-medium">by Sakshi</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-8 text-sm">
            <button onClick={() => handleNavClick('features')} className="text-amber-900 hover:text-amber-700 transition-colors">Features</button>
            <button onClick={() => handleNavClick('about')} className="text-amber-900 hover:text-amber-700 transition-colors">About</button>
            <button onClick={() => handleNavClick('faq')} className="text-amber-900 hover:text-amber-700 transition-colors">FAQ</button>
            <button onClick={() => handleNavClick('contact')} className="text-amber-900 hover:text-amber-700 transition-colors">Contact</button>
          </nav>

          <div className="flex gap-3 pl-8 border-l border-amber-200">
            <button onClick={() => setView('login')} className="px-4 py-2 text-sm text-amber-900 hover:text-amber-700 transition-colors">Login</button>
            <button onClick={() => setView('signup')} className="px-5 py-2 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 text-sm font-medium rounded-lg hover:shadow-lg transition-all">
              Start Writing →
            </button>
          </div>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-amber-900">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-50 border-b border-amber-200 p-4 space-y-3">
          <button onClick={() => handleNavClick('features')} className="block w-full text-left py-2 text-amber-900">Features</button>
          <button onClick={() => handleNavClick('about')} className="block w-full text-left py-2 text-amber-900">About</button>
          <button onClick={() => handleNavClick('faq')} className="block w-full text-left py-2 text-amber-900">FAQ</button>
          <button onClick={() => handleNavClick('contact')} className="block w-full text-left py-2 text-amber-900">Contact</button>
          <div className="flex gap-2 pt-2 border-t border-amber-200">
            <button onClick={() => { setView('login'); setMobileMenuOpen(false) }} className="flex-1 px-4 py-2 text-sm text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-100">Login</button>
            <button onClick={() => { setView('signup'); setMobileMenuOpen(false) }} className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 text-sm font-medium rounded-lg">Start Writing</button>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero({ setView }: { setView: (view: View) => void }) {
  return (
    <section 
      id="hero"
      className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/journal-hero.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
        <p className="text-amber-100 text-sm font-semibold tracking-widest uppercase mb-6">
          A QUIET SPACE FOR YOUR INNER WORLD
        </p>
        
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Write your way<br />toward a more<br />
          <span className="text-amber-200">meaningful life</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Capture the ordinary, understand your patterns, and make room for what matters most.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setView('signup')}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-amber-900 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Writing →
          </button>
          <button 
            onClick={() => setView('signup')}
            className="px-8 py-4 border-2 border-amber-200 text-white font-semibold rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Explore Journal
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <ChevronDown className="text-white/60" size={32} />
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { num: '01', title: 'Write Freely', desc: 'Put your thoughts into words in a simple, distraction-free space.' },
    { num: '02', title: 'Track Your Mood', desc: 'See the sentiment behind your entries and notice emotional patterns over time.' },
    { num: '03', title: 'Build Better Habits', desc: 'Create small routines and see your consistency day by day.' },
    { num: '04', title: 'Private by Design', desc: 'Your journal is personal. Keep your reflections in a space designed around privacy.' }
  ]

  return (
    <section id="features" className="py-24 bg-amber-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-100 mb-4 text-center">
          Everything you need to make reflection a habit.
        </h2>
        <p className="text-amber-200 text-center mb-16 max-w-2xl mx-auto">
          Simple, powerful tools designed for your everyday journaling practice.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((f, i) => (
            <div key={i} className="bg-amber-800/60 p-8 rounded-xl border border-amber-600 hover:border-amber-400 hover:shadow-lg transition-all">
              <div className="text-3xl font-serif font-bold text-amber-300 mb-3">{f.num}</div>
              <h3 className="text-xl font-semibold text-amber-50 mb-3">{f.title}</h3>
              <p className="text-amber-100">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  const principles = [
    { num: '01', title: 'Write Freely', desc: 'A simple space to put your thoughts into words without distractions.' },
    { num: '02', title: 'Understand Your Mood', desc: 'Reflect on your entries and notice emotional patterns over time.' },
    { num: '03', title: 'Keep Your Moments Private', desc: 'A personal space designed around simplicity, privacy, and control.' }
  ]

  return (
    <section id="about" className="py-24 bg-amber-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-amber-900 mb-6">
              A little space to slow down,<br />reflect, and understand yourself.
            </h2>
            <p className="text-lg text-amber-800 mb-8">
              JournalApp is a personal journaling space built by Sakshi Gharat to make everyday reflection simple, private, and meaningful.
            </p>
            <div className="text-sm text-amber-700 mb-8">
              <p className="font-semibold">Built by Sakshi Gharat</p>
              <p>Personal Portfolio Project</p>
            </div>
          </div>

          <div className="space-y-6">
            {principles.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-serif font-bold text-amber-700 mb-2">{p.num}</div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">{p.title}</h3>
                <p className="text-amber-800">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(0)
  const faqs = [
    { q: 'Is JournalApp free to use?', a: 'Yes, JournalApp is completely free. Build your journaling habit without any cost.' },
    { q: 'How does mood/sentiment tracking work?', a: 'Your entries are analyzed to identify emotional sentiment, helping you see patterns over time.' },
    { q: 'Are my journal entries private?', a: 'Absolutely. Your journal is private by default. Your entries are encrypted and only accessible to you.' },
    { q: 'Can I edit or delete a journal entry?', a: 'Yes, you can edit your entries anytime or delete them if you prefer.' },
    { q: 'Can I create habits and track consistency?', a: 'Yes, create habits and track your daily consistency to build positive routines.' },
    { q: 'How is my account protected?', a: 'We use industry-standard JWT authentication and encryption to keep your account and data secure.' }
  ]

  return (
    <section id="faq" className="py-24 bg-amber-800">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-100 mb-16 text-center">
          Questions, answered.
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-amber-700/50 border border-amber-600 rounded-lg overflow-hidden backdrop-blur-sm">
              <button
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full p-6 flex justify-between items-center hover:bg-amber-600/40 transition-colors text-left"
              >
                <span className="font-semibold text-amber-50">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-amber-200 transform transition-transform ${openIdx === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-6 text-amber-100 border-t border-amber-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <section id="contact" className="py-24 bg-amber-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl text-amber-900 mb-4 text-center">
          Have a thought to share?
        </h2>
        <p className="text-amber-800 text-center mb-12">
          Whether you have feedback, found something that could be better, or simply want to say hello — I'd love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border-2 border-amber-200 space-y-6 shadow-md">
          {submitted && (
            <div className="p-4 bg-amber-100 border border-amber-300 rounded-lg text-amber-900 text-center font-semibold">
              Thank you! Your message has been received.
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-amber-50"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-amber-50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">Message</label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 bg-amber-50 resize-none"
              placeholder="What's on your mind?"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Send Message →
          </button>
        </form>

        <div className="mt-12 p-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border border-amber-200 text-center shadow-sm">
          <p className="text-sm text-amber-700 mb-2">Creator</p>
          <h3 className="font-serif text-2xl text-amber-900 font-semibold">Sakshi Gharat</h3>
          <p className="text-amber-800 mt-2">Creator of JournalApp</p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-amber-900 text-amber-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-8">
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">JournalApp</h3>
            <p className="text-amber-200 text-sm">A quiet place for your thoughts. Built by Sakshi Gharat</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Product</h4>
            <ul className="space-y-2 text-sm text-amber-200">
              <li><button onClick={() => handleScroll('features')} className="hover:text-amber-50">Features</button></li>
              <li><a href="#" className="hover:text-amber-50">Habits</a></li>
              <li><a href="#" className="hover:text-amber-50">Journal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Company</h4>
            <ul className="space-y-2 text-sm text-amber-200">
              <li><button onClick={() => handleScroll('about')} className="hover:text-amber-50">About</button></li>
              <li><button onClick={() => handleScroll('faq')} className="hover:text-amber-50">FAQ</button></li>
              <li><button onClick={() => handleScroll('contact')} className="hover:text-amber-50">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber-100">Account</h4>
            <ul className="space-y-2 text-sm text-amber-200">
              <li><a href="#" className="hover:text-amber-50">Login</a></li>
              <li><a href="#" className="hover:text-amber-50">Start Writing</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-800 pt-8 text-center text-sm text-amber-200">
          <p>© 2026 JournalApp · Built by Sakshi Gharat</p>
        </div>
      </div>
    </footer>
  )
}

export default function Landing({ setView }: { setView: (view: View) => void }) {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header setView={setView} onScroll={handleScroll} />
      
      <main>
        <Hero setView={setView} />
        <Features />
        <About />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
