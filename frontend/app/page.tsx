'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BarChart3, Bell, BookOpen, Check, ChevronRight, Flame, Heart, Home, Lightbulb, LockKeyhole, LogOut, Menu, Plus, Search, Settings, Sparkles, Tag, Target, TrendingUp, UserRound, X } from 'lucide-react'
import { api, clearToken, getStoredUsername, getToken, setStoredUsername, setToken } from '@/lib/api'

type View = 'today' | 'journal' | 'habits' | 'insights' | 'profile'
type AuthView = 'landing' | 'login' | 'signup'

type Entry = { id: string; title: string; content: string; date: string; sentiment?: string; tags: string[] }
type Habit = { id: string; name: string; category?: string; reminderTime?: string; color?: string; completions: Record<string, boolean> }

const TAG_OPTIONS = ['Gratitude', 'Self Growth', 'Health', 'Family', 'Work', 'Relationships']
const SENTIMENT_LABEL: Record<string, string> = { HAPPY: 'Happy', SAD: 'Sad', ANGRY: 'Angry', ANXIOUS: 'Anxious' }

function toId(x: unknown): string { return typeof x === 'string' ? x : (x as { toString: () => string })?.toString?.() ?? '' }
function weekDates(): string[] {
  const now = new Date()
  const day = (now.getDay() + 6) % 7 // Monday = 0
  const monday = new Date(now); monday.setDate(now.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d.toISOString().slice(0, 10) })
}
function todayKey() { return new Date().toISOString().slice(0, 10) }
function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return isToday ? `Today · ${time}` : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} · ${time}`
}

function Logo() { return <div className="app-logo"><div className="logo-symbol"><BookOpen size={19} /></div><div><strong>Journal<span>App</span></strong><small>by Sakshi Gharat</small></div></div> }
function Button({ children, onClick, variant = 'primary', type = 'button', disabled }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'ghost'; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={`btn btn-${variant}`}>{children}</button>
}
function Leaf({ className = '' }: { className?: string }) {
  return <svg className={`leaf-decor ${className}`} viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 4C30 4 6 22 6 48C6 68 16 82 30 86C44 82 54 68 54 48C54 22 30 4 30 4Z" stroke="currentColor" strokeWidth="1.4" />
    <path d="M30 6V84" stroke="currentColor" strokeWidth="1.2" />
    <path d="M30 20L18 30M30 34L16 42M30 48L18 56M30 62L20 68" stroke="currentColor" strokeWidth="1" />
  </svg>
}

function AppHeader({ setView, username }: { setView: (v: View) => void; username: string }) {
  return <header className="app-header">
    <button className="mobile-menu" aria-label="Open navigation"><Menu size={20} /></button>
    <div className="header-search"><Search size={15} /><input placeholder="Search your journal..." aria-label="Search journal" /></div>
    <div className="header-actions"><Bell size={18} /><button className="avatar" onClick={() => setView('profile')}>{username.charAt(0).toUpperCase()}</button><span className="user-name">{username}</span><ChevronRight size={14} /></div>
  </header>
}
function Sidebar({ view, setView, onLogout }: { view: View; setView: (v: View) => void; onLogout: () => void }) {
  const links = [{ key: 'today' as View, label: 'Today', icon: Home }, { key: 'journal' as View, label: 'Journal', icon: BookOpen }, { key: 'habits' as View, label: 'Habits', icon: Target }, { key: 'insights' as View, label: 'Insights', icon: BarChart3 }, { key: 'profile' as View, label: 'Profile', icon: UserRound }]
  return <aside className="sidebar">
    <div className="sidebar-brand"><Logo /></div>
    <nav>{links.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setView(key)} className={view === key ? 'active' : ''}><Icon size={16} />{label}</button>)}</nav>
    <div className="sidebar-bottom">
      <button onClick={onLogout}><LogOut size={16} />Log out</button>
      <button className="new-entry-link" onClick={() => setView('journal')}><Plus size={16} />New entry</button>
    </div>
  </aside>
}
function Shell({ children, view, setView, username, onLogout }: { children: React.ReactNode; view: View; setView: (v: View) => void; username: string; onLogout: () => void }) {
  return <div className="workspace">
    <AppHeader setView={setView} username={username} />
    <Sidebar view={view} setView={setView} onLogout={onLogout} />
    <main className="workspace-main">{children}</main>
    <nav className="mobile-nav">{[['today', Home, 'Today'], ['journal', BookOpen, 'Journal'], ['habits', Target, 'Habits'], ['insights', BarChart3, 'Insights'], ['profile', UserRound, 'Profile']].map(([key, Icon, label]) => { const I = Icon as typeof Home; return <button key={key as string} className={view === key ? 'active' : ''} onClick={() => setView(key as View)}><I size={17} /><span>{label as string}</span></button> })}</nav>
  </div>
}
function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <span className="section-kicker">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>
}
function TagPicker({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const toggle = (tag: string) => {
    if (value.includes(tag)) onChange(value.filter(t => t !== tag))
    else if (value.length < 3) onChange([...value, tag])
  }
  return <div className="tag-picker">
    <div className="tag-picker-label"><Tag size={13} /> Themes (up to 3)</div>
    <div className="tag-options">{TAG_OPTIONS.map(tag => <button type="button" key={tag} className={value.includes(tag) ? 'selected' : ''} onClick={() => toggle(tag)}>{tag}</button>)}</div>
  </div>
}
function StatCard({ value, label, icon: Icon, tone }: { value: string; label: string; icon: typeof Flame; tone: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={17} /></div><div><strong>{value}</strong><span>{label}</span></div></div>
}

// ---------- Auth ----------
function AuthForm({ mode, onAuthed, switchMode }: { mode: 'login' | 'signup'; onAuthed: (username: string) => void; switchMode: (m: AuthView) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) { setError('Please fill in both fields.'); return }
    setLoading(true)
    try {
      if (mode === 'signup') {
        await api.signup(username.trim(), password)
        const token = await api.login(username.trim(), password)
        setToken(token); setStoredUsername(username.trim())
      } else {
        const token = await api.login(username.trim(), password)
        setToken(token); setStoredUsername(username.trim())
      }
      onAuthed(username.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page">
    <Leaf className="auth-leaf-1" />
    <Leaf className="auth-leaf-2" />
    <div className="auth-card">
      <Logo />
      <div className="auth-tabs">
        <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
        <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Sign Up</button>
      </div>
      <h1>{mode === 'login' ? 'Welcome back' : 'Begin your journal'}</h1>
      <p className="auth-sub">{mode === 'login' ? 'Log in to continue your journaling journey.' : 'Create an account to start writing.'}</p>
      <form onSubmit={submit} className="auth-form">
        <label>Username<input value={username} onChange={e => setUsername(e.target.value)} placeholder="your.username" autoComplete="username" /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {error && <p className="auth-error">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}</Button>
      </form>
      <p className="auth-switch">{mode === 'login' ? <>Don&apos;t have an account? <button onClick={() => switchMode('signup')}>Sign up</button></> : <>Already have an account? <button onClick={() => switchMode('login')}>Login</button></>}</p>
    </div>
  </main>
}

const FAQS = [
  { q: 'Is JournalApp free to use?', a: 'Yes, JournalApp is free to use. You can write, track your mood, and build habits without any cost.' },
  { q: 'How does mood/sentiment tracking work?', a: 'Every entry you write is gently analyzed to detect the underlying sentiment, so you can see your emotional patterns over time.' },
  { q: 'Are my journal entries private?', a: 'Yes. Your entries are visible only to you and are protected behind your account.' },
  { q: 'Can I edit or delete a journal entry?', a: 'Yes, you can update or remove any entry at any time from your Journal page.' },
  { q: 'Can I create habits and track consistency?', a: 'Yes. The Habits page lets you create small rituals and track daily consistency with a weekly view.' },
  { q: 'How is my account protected?', a: 'Your account is protected with secure authentication and your password is never stored in plain text.' },
]
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return <div className={`faq-item ${open ? 'open' : ''}`}>
    <button onClick={() => setOpen(!open)}>{q}<ChevronRight size={15} className="faq-chevron" /></button>
    {open && <p>{a}</p>}
  </div>
}
function Landing({ setAuthView }: { setAuthView: (v: AuthView) => void }) {
  return <main className="landing-page">
    <header className="landing-header"><Logo /><nav><a href="#about">About</a><a href="#how">Features</a><a href="#faq">FAQ</a><a href="#footer">Contact</a><Button variant="outline" onClick={() => setAuthView('login')}>Login</Button><Button onClick={() => setAuthView('signup')}>Start Writing</Button></nav></header>
    <section className="landing-hero-photo">
      <img src="/journal-hero.png" alt="Open journal, pen, coffee and dried flowers in warm morning light" />
      <div className="landing-hero-overlay">
        <span className="section-kicker">HOW IT WORKS</span>
        <h1>A quiet space for<br /><em>your thoughts.</em></h1>
        <p>Write freely, reflect on your days,<br />and keep the moments that matter.</p>
        <Button onClick={() => setAuthView('signup')}>Start Writing <ArrowRight size={15} /></Button>
      </div>
    </section>

    <section id="how" className="landing-steps">
      <span className="section-kicker">HOW IT WORKS</span>
      <h2>A simple 3-step process</h2>
      <div className="steps-row">
        <div className="step-item"><span className="step-icon"><span>01</span><BookOpen size={20} /></span><h3>Write Your Thoughts</h3><p>Write about your day, your feelings, or anything on your mind.</p></div>
        <div className="step-item"><span className="step-icon"><span>02</span><BarChart3 size={20} /></span><h3>Understand Your Mood</h3><p>Our sentiment analysis helps you understand your emotional patterns.</p></div>
        <div className="step-item"><span className="step-icon"><span>03</span><Sparkles size={20} /></span><h3>Build Better Habits</h3><p>Create small habits and stay consistent with daily tracking.</p></div>
      </div>
    </section>

    <section className="landing-features">
      <div><BookOpen size={19} /><b>Write freely</b><span>Give your thoughts a place to land.</span></div>
      <div><Heart size={19} /><b>Track your mood</b><span>Notice the patterns behind your days.</span></div>
      <div><LockKeyhole size={19} /><b>Private by design</b><span>Your space stays personal.</span></div>
    </section>

    <section id="about" className="landing-about"><Leaf className="about-leaf" /><span className="section-kicker">THE PERSON BEHIND THE PAGE</span><h2>A small space for the moments between moments.</h2><p>JournalApp is a personal journaling workspace created by Sakshi Gharat.</p></section>

    <section id="faq" className="landing-faq">
      <span className="section-kicker">FREQUENTLY ASKED QUESTIONS</span>
      <h2>Questions, answered.</h2>
      <div className="faq-list">{FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}</div>
    </section>

    <footer id="footer" className="landing-footer">
      <div className="footer-top">
        <div className="footer-brand"><Logo /><p>A quiet place for your thoughts.</p><span>Built by Sakshi Gharat · Personal Portfolio Project</span></div>
        <div className="footer-col"><h4>Product</h4><a href="#how">Features</a><a href="#">Habits</a><a href="#">Journal</a></div>
        <div className="footer-col"><h4>Company</h4><a href="#about">About</a><a href="#faq">FAQ</a><a href="#footer">Contact</a></div>
        <div className="footer-col"><h4>Account</h4><button onClick={() => setAuthView('login')}>Login</button><button onClick={() => setAuthView('signup')}>Start Writing</button></div>
        <Leaf className="footer-leaf" />
      </div>
      <div className="footer-bottom">© 2026 JournalApp · Built by Sakshi Gharat</div>
    </footer>
  </main>
}

// ---------- Today ----------
function Today({ entries, habits, setView, openEntry, loading }: { entries: Entry[]; habits: Habit[]; setView: (v: View) => void; openEntry: (e: Entry) => void; loading: boolean }) {
  const today = todayKey()
  const complete = habits.filter(h => h.completions?.[today]).length
  const recent = entries.slice(0, 4)
  return <div className="content-wrap">
    <PageHeading eyebrow={new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()} title="Good morning." description="A little time for yourself can change the whole shape of a day." action={<Button onClick={() => setView('journal')}><Plus size={15} /> New entry</Button>} />
    <section className="today-grid">
      <div className="today-main">
        <div className="panel prompt-card"><Leaf className="panel-leaf" /><div><span className="section-kicker">TODAY&apos;S REFLECTION</span><h2>What would make today feel meaningful?</h2><p>Take a few quiet minutes to write whatever comes up.</p></div><Button variant="outline" onClick={() => setView('journal')}>Write a reflection <ArrowRight size={15} /></Button></div>
        <div className="section-row"><h2>Recent entries</h2><button onClick={() => setView('journal')}>View journal <ArrowRight size={13} /></button></div>
        {loading ? <p className="muted-label">Loading…</p> : recent.length === 0 ? <div className="empty-state"><Leaf className="empty-leaf" /><p>No entries yet. Your first page is waiting.</p></div> : <div className="entry-stack">{recent.map(entry => <button className="entry-row" key={entry.id} onClick={() => openEntry(entry)}><div className="entry-date">{formatDate(entry.date).split(' · ')[0]}<small>{formatDate(entry.date).split(' · ')[1]}</small></div><div className="entry-content"><h3>{entry.title}</h3><p>{entry.content}</p></div>{entry.sentiment && <span className="entry-mood">{SENTIMENT_LABEL[entry.sentiment] || entry.sentiment}</span>}<ChevronRight size={15} /></button>)}</div>}
      </div>
      <aside className="today-side">
        <div className="panel habit-summary"><div className="panel-title"><h2>Today&apos;s habits</h2><button onClick={() => setView('habits')}>See all</button></div><div className="habit-summary-count"><strong>{complete}/{habits.length}</strong><span>completed</span></div>{habits.slice(0, 5).map(h => <div className="mini-habit" key={h.id}><span className="habit-dot sage" /><span>{h.name}</span><Check size={14} className={h.completions?.[today] ? 'is-complete' : ''} /></div>)}</div>
        <div className="panel gentle-card"><Lightbulb size={19} /><h3>Be gentle with yourself</h3><p>Progress does not have to be loud to be real.</p></div>
      </aside>
    </section>
  </div>
}

// ---------- Journal ----------
function Journal({ entries, refresh, loading }: { entries: Entry[]; refresh: () => void; loading: boolean }) {
  const [query, setQuery] = useState('')
  const [writing, setWriting] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const filtered = useMemo(() => entries.filter(e => `${e.title} ${e.content}`.toLowerCase().includes(query.toLowerCase())), [entries, query])

  const save = async () => {
    if (!title.trim() || !body.trim()) return
    setSaving(true); setError('')
    try {
      await api.createEntry({ title: title.trim(), content: body.trim(), tags })
      setTitle(''); setBody(''); setTags([]); setWriting(false)
      refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save entry.')
    } finally { setSaving(false) }
  }
  const remove = async (id: string) => {
    try { await api.deleteEntry(id); refresh() } catch { /* ignore */ }
  }

  return <div className="content-wrap">
    <PageHeading title="Journal" description="A place for everything on your mind." action={<Button onClick={() => setWriting(!writing)}><Plus size={15} /> New entry</Button>} />
    {writing && <div className="panel writer-panel">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your entry a title..." aria-label="Entry title" />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write what is on your mind..." aria-label="Entry content" />
      <TagPicker value={tags} onChange={setTags} />
      {error && <p className="auth-error">{error}</p>}
      <div className="writer-actions"><Button variant="ghost" onClick={() => setWriting(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save entry'}</Button></div>
    </div>}
    <div className="journal-toolbar"><div className="search-field"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search entries..." /></div></div>
    {loading ? <p className="muted-label">Loading…</p> : filtered.length === 0 ? <div className="empty-state"><Leaf className="empty-leaf" /><p>No entries match yet. Start writing to fill this page.</p></div> : <div className="journal-list">{filtered.map(entry => <article className="journal-card" key={entry.id}>
      <div className="journal-card-top"><span>{formatDate(entry.date)}</span>{entry.sentiment && <span className="entry-mood">{SENTIMENT_LABEL[entry.sentiment] || entry.sentiment}</span>}</div>
      <h2>{entry.title}</h2><p>{entry.content}</p>
      {entry.tags?.length > 0 && <div className="entry-tags">{entry.tags.map(t => <span key={t}>{t}</span>)}</div>}
      <button onClick={() => remove(entry.id)} className="delete-link">Delete</button>
    </article>)}</div>}
  </div>
}

// ---------- Habits ----------
function Habits({ habits, refresh, loading }: { habits: Habit[]; refresh: () => void; loading: boolean }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [toggleError, setToggleError] = useState('')
  const week = weekDates()
  const today = todayKey()

  const add = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try { await api.createHabit({ name: name.trim(), category: 'Personal', reminderTime: '8:00 AM' }); setName(''); setShowForm(false); refresh() }
    catch { /* ignore */ } finally { setSaving(false) }
  }
  const toggleDay = async (id: string, date: string) => {
    setToggleError('')
    try { await api.toggleHabit(id, date); refresh() }
    catch (err) { setToggleError(err instanceof Error ? err.message : 'Could not update habit — check backend is restarted with the latest Habit.java.') }
  }

  const completedToday = habits.filter(h => h.completions?.[today]).length
  const weekPct = habits.length ? Math.round(habits.reduce((sum, h) => sum + week.filter(d => h.completions?.[d]).length, 0) / (habits.length * 7) * 100) : 0

  return <div className="content-wrap">
    <PageHeading title="Habits" description="Small rituals, meaningful progress." action={<Button onClick={() => setShowForm(!showForm)}><Plus size={15} /> Add habit</Button>} />
    <div className="stats-grid">
      <StatCard value={`${completedToday}/${habits.length}`} label="Completed today" icon={Check} tone="green" />
      <StatCard value={`${weekPct}%`} label="This week" icon={TrendingUp} tone="blue" />
      <StatCard value={`${habits.length}`} label="Active habits" icon={Flame} tone="gold" />
    </div>
    {showForm && <form className="panel habit-form" onSubmit={add}><input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="What would you like to practice?" aria-label="Habit name" /><Button type="submit" disabled={saving}>{saving ? 'Adding…' : 'Create habit'}</Button></form>}
    {toggleError && <p className="auth-error" style={{ marginBottom: 16 }}>{toggleError}</p>}
    {loading ? <p className="muted-label">Loading…</p> : habits.length === 0 ? <div className="empty-state"><Leaf className="empty-leaf" /><p>No habits yet. Add a small ritual to begin.</p></div> : <div className="habit-layout">
      <div className="habit-list-main">{habits.map(h => { const doneCount = week.filter(d => h.completions?.[d]).length; return <article className="habit-row" key={h.id}>
        <div className="habit-avatar sage"><Sparkles size={16} /></div>
        <div className="habit-row-main">
          <div className="habit-row-heading"><div><h3>{h.name}</h3><p>{h.category || 'Personal'}{h.reminderTime ? ` · Reminder at ${h.reminderTime}` : ''}</p></div><button className={`row-check ${h.completions?.[today] ? 'done' : ''}`} onClick={() => toggleDay(h.id, today)}>{h.completions?.[today] ? <Check size={14} /> : null}</button></div>
          <div className="habit-bar"><span style={{ width: `${Math.round(doneCount / 7 * 100)}%` }} /></div>
          <div className="habit-days">{week.map((d, i) => <button key={d} onClick={() => toggleDay(h.id, d)} className={h.completions?.[d] ? 'done' : ''}>{h.completions?.[d] ? <Check size={11} /> : ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</button>)}</div>
        </div>
      </article> })}</div>
      <aside className="panel consistency"><Leaf className="panel-leaf" /><div className="panel-title"><h2>Habit consistency</h2></div>
        <div className="consistency-days">{habits.map(h => <div className="consistency-line" key={h.id}><span>{h.name.split(' ')[0]}</span><div>{week.map(d => <i key={d} className={h.completions?.[d] ? 'level-2' : ''} />)}</div></div>)}</div>
        <div className="consistency-divider" />
        <div className="consistency-stat"><span>This week</span><strong>{weekPct}%</strong></div>
      </aside>
    </div>}
  </div>
}

// ---------- Insights ----------
type Stats = { totalEntries: number; thisMonth: number; moodDistribution: Record<string, number>; topThemes: Record<string, number> }
function Insights({ entries, habits, stats, loading }: { entries: Entry[]; habits: Habit[]; stats: Stats | null; loading: boolean }) {
  const moodEntries = Object.entries(stats?.moodDistribution || {})
  const topThemes = Object.entries(stats?.topThemes || {}).sort((a, b) => b[1] - a[1])
  const totalMood = moodEntries.reduce((s, [, v]) => s + v, 0)
  const topMood = moodEntries.sort((a, b) => b[1] - a[1])[0]

  return <div className="content-wrap">
    <PageHeading eyebrow="YOUR PATTERNS" title="Insights" description="A gentle look at how you have been showing up." />
    {loading ? <p className="muted-label">Loading…</p> : <div className="insights-grid">
      <div className="panel insight-highlight"><Leaf className="panel-leaf" /><span className="insight-orb"><Heart size={20} /></span><span className="section-kicker">THIS MONTH</span><strong>{stats?.thisMonth ?? 0}</strong><h2>days of reflection</h2><p>{stats?.totalEntries ?? entries.length} entries written in total.</p></div>
      <div className="panel chart-panel"><div className="panel-title"><h2>Mood overview</h2><span className="muted-label">{totalMood} entries analyzed</span></div>
        {moodEntries.length === 0 ? <p className="muted-label">Write a few entries to see your mood patterns.</p> : <div className="mood-bars">{moodEntries.map(([mood, count]) => <div className="mood-bar-row" key={mood}><span>{SENTIMENT_LABEL[mood] || mood}</span><div className="mood-bar-track"><span style={{ width: `${totalMood ? Math.round(count / totalMood * 100) : 0}%` }} /></div><b>{count}</b></div>)}</div>}
      </div>
      <div className="panel insight-list"><div className="panel-title"><h2>Snapshot</h2><Lightbulb size={17} /></div>
        <div><b>Most common mood</b><p>{topMood ? (SENTIMENT_LABEL[topMood[0]] || topMood[0]) : 'Not enough data yet'}</p></div>
        <div><b>{habits.length} active habits</b><p>Try focusing on one small habit at a time this week.</p></div>
      </div>
      <div className="panel insight-list"><div className="panel-title"><h2>Top themes</h2><Tag size={17} /></div>
        {topThemes.length === 0 ? <p className="muted-label">Tag your entries to see themes appear here.</p> : topThemes.slice(0, 5).map(([tag, count]) => <div key={tag}><b>{tag}</b><p>{count} {count === 1 ? 'entry' : 'entries'}</p></div>)}
      </div>
    </div>}
  </div>
}

// ---------- Profile ----------
function Profile({ username, onLogout }: { username: string; onLogout: () => void }) {
  return <div className="content-wrap narrow-content">
    <PageHeading title="Profile" description="Your space, your settings, your privacy." />
    <div className="profile-hero panel"><div className="profile-avatar">{username.charAt(0).toUpperCase()}</div><div><span className="section-kicker">JOURNALER</span><h2>{username}</h2><p>Member of JournalApp</p></div></div>
    <div className="settings-list">
      <div><div><LockKeyhole size={18} /><b>Private by default</b><p>Your journal is visible only to you.</p></div><span className="toggle active" /></div>
      <div><div><Bell size={18} /><b>Gentle reminders</b><p>Receive a quiet nudge for your daily reflection.</p></div><span className="toggle active" /></div>
      <div onClick={onLogout} style={{ cursor: 'pointer' }}><div><Settings size={18} /><b>Log out</b><p>End your current session.</p></div><ChevronRight size={17} /></div>
    </div>
  </div>
}

function EntryModal({ entry, close }: { entry: Entry; close: () => void }) {
  return <div className="entry-modal-backdrop" onClick={close}><article className="entry-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={close}><X size={17} /></button><span className="section-kicker">{formatDate(entry.date)}</span><h2>{entry.title}</h2><p>{entry.content}</p>{entry.sentiment && <span className="entry-mood">{SENTIMENT_LABEL[entry.sentiment] || entry.sentiment}</span>}</article></div>
}

export default function Page() {
  const [authed, setAuthed] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authView, setAuthView] = useState<AuthView>('landing')
  const [username, setUsername] = useState('')
  const [view, setView] = useState<View>('today')
  const [entries, setEntries] = useState<Entry[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Entry | null>(null)

  useEffect(() => {
    const token = getToken()
    const storedUser = getStoredUsername()
    if (token && storedUser) { setAuthed(true); setUsername(storedUser) }
    setCheckingAuth(false)
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [entryData, habitData, statsData] = await Promise.all([api.getEntries(), api.getHabits(), api.getStats().catch(() => null)])
      setEntries((entryData || []).map((e: { id: unknown; title: string; content: string; date: string; sentiment?: string; tags?: string[] }) => ({ ...e, id: toId(e.id), tags: e.tags || [] })).sort((a: Entry, b: Entry) => (b.date || '').localeCompare(a.date || '')))
      setHabits((habitData || []).map((h: { id: unknown; name: string; category?: string; reminderTime?: string; color?: string; completions?: Record<string, boolean> }) => ({ ...h, id: toId(h.id), completions: h.completions || {} })))
      setStats(statsData)
    } catch {
      // token likely expired
      handleLogout()
    } finally { setLoading(false) }
  }

  useEffect(() => { if (authed) loadAll() }, [authed])

  const handleAuthed = (name: string) => { setUsername(name); setAuthed(true) }
  const handleLogout = () => { clearToken(); setAuthed(false); setEntries([]); setHabits([]); setStats(null); setAuthView('landing') }

  if (checkingAuth) return null

  if (!authed) {
    if (authView === 'landing') return <Landing setAuthView={setAuthView} />
    return <AuthForm mode={authView === 'signup' ? 'signup' : 'login'} onAuthed={handleAuthed} switchMode={setAuthView} />
  }

  const content =
    view === 'today' ? <Today entries={entries} habits={habits} setView={setView} openEntry={setSelected} loading={loading} /> :
    view === 'journal' ? <Journal entries={entries} refresh={loadAll} loading={loading} /> :
    view === 'habits' ? <Habits habits={habits} refresh={loadAll} loading={loading} /> :
    view === 'insights' ? <Insights entries={entries} habits={habits} stats={stats} loading={loading} /> :
    <Profile username={username} onLogout={handleLogout} />

  return <Shell view={view} setView={setView} username={username} onLogout={handleLogout}>
    {selected && <EntryModal entry={selected} close={() => setSelected(null)} />}
    {content}
  </Shell>
}
