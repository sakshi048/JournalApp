'use client'

import { useState, useEffect } from 'react'
import { BookOpen, LogOut, Plus, Target, BarChart3, Home, Heart, Trash2, Check } from 'lucide-react'
import { api } from '@/lib/api'

interface DashboardProps {
  token: string
  onLogout: () => void
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [view, setView] = useState<'today' | 'journal' | 'habits' | 'insights' | 'profile'>('today')
  const [entries, setEntries] = useState<any[]>([])
  const [newEntryTitle, setNewEntryTitle] = useState('')
  const [newEntryContent, setNewEntryContent] = useState('')
  const [loadingEntries, setLoadingEntries] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [habits, setHabits] = useState<any[]>([])
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitCategory, setNewHabitCategory] = useState('')
  const [user, setUser] = useState<any>(null)
  const [editingPassword, setEditingPassword] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [entriesData, statsData, habitsData, userData] = await Promise.all([
          api.getEntries(token).catch(() => []),
          api.getStats(token).catch(() => null),
          api.getHabits(token).catch(() => []),
          api.getUser(token).catch(() => null),
        ])
        setEntries(Array.isArray(entriesData) ? entriesData : [])
        setStats(statsData)
        setHabits(Array.isArray(habitsData) ? habitsData : [])
        setUser(userData)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoadingEntries(false)
      }
    }
    loadData()
  }, [token])

  const createEntry = async () => {
    if (!newEntryTitle || !newEntryContent) return
    try {
      const newEntry = await api.createEntry(token, {
        title: newEntryTitle,
        content: newEntryContent,
        sentiment: 'HAPPY',
      })
      setEntries([newEntry, ...entries])
      setNewEntryTitle('')
      setNewEntryContent('')
    } catch (err) {
      console.error('Failed to create entry:', err)
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      await api.deleteEntry(token, id)
      setEntries(entries.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to delete entry:', err)
    }
  }

  const createHabit = async () => {
    if (!newHabitName) return
    try {
      const habit = await api.createHabit(token, {
        name: newHabitName,
        category: newHabitCategory || 'Personal',
        reminderTime: '09:00',
        color: 'amber',
      })
      setHabits([habit, ...habits])
      setNewHabitName('')
      setNewHabitCategory('')
    } catch (err) {
      console.error('Failed to create habit:', err)
    }
  }

  const toggleHabit = async (id: string) => {
    try {
      const updated = await api.toggleHabitCompletion(token, id)
      setHabits(habits.map(h => h.id === id ? updated : h))
    } catch (err) {
      console.error('Failed to toggle habit:', err)
    }
  }

  const deleteHabit = async (id: string) => {
    try {
      await api.deleteHabit(token, id)
      setHabits(habits.filter(h => h.id !== id))
    } catch (err) {
      console.error('Failed to delete habit:', err)
    }
  }

  const updatePassword = async () => {
    if (!editingPassword) return
    try {
      await api.updateUser(token, { password: editingPassword })
      setEditingPassword('')
      alert('Password updated successfully')
    } catch (err) {
      console.error('Failed to update password:', err)
    }
  }

  const deleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return
    try {
      await api.deleteUser(token)
      onLogout()
    } catch (err) {
      console.error('Failed to delete account:', err)
    }
  }

  const isTodayCompleted = (completions: any) => {
    const today = new Date().toISOString().split('T')[0]
    return completions[today] || false
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-serif font-semibold text-stone-900">JournalApp</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 bg-white border-r border-stone-200 p-6">
          <nav className="space-y-2">
            {[
              { id: 'today', label: 'Today', icon: Home },
              { id: 'journal', label: 'Journal', icon: BookOpen },
              { id: 'habits', label: 'Habits', icon: Target },
              { id: 'insights', label: 'Insights', icon: BarChart3 },
              { id: 'profile', label: 'Profile', icon: Heart },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  view === id
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {view === 'today' && (
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Today</p>
                  <h1 className="font-serif text-4xl text-stone-900">Good morning</h1>
                </div>

                {stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-stone-200">
                      <p className="text-2xl font-semibold text-stone-900">{stats.totalEntries || 0}</p>
                      <p className="text-xs text-stone-600 mt-1">Total Entries</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-stone-200">
                      <p className="text-2xl font-semibold text-stone-900">{stats.thisMonth || 0}</p>
                      <p className="text-xs text-stone-600 mt-1">This Month</p>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold text-stone-900 mb-4">Recent Entries</h2>
                  <div className="space-y-3">
                    {loadingEntries ? (
                      <p className="text-stone-500">Loading entries...</p>
                    ) : entries.length > 0 ? (
                      entries.slice(0, 5).map((entry, idx) => (
                        <div key={`entry-${idx}`} className="bg-white rounded-lg p-4 border border-stone-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-stone-900">{entry.title}</h3>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                          <p className="text-sm text-stone-600 line-clamp-2">{entry.content}</p>
                          <p className="text-xs text-stone-500 mt-2">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-stone-500 text-center py-8">No entries yet. Start writing!</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === 'journal' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-4xl text-stone-900">Journal</h1>
                  <p className="text-stone-600 mt-2">Write, reflect, and keep track of your thoughts.</p>
                </div>

                <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
                  <input
                    type="text"
                    value={newEntryTitle}
                    onChange={(e) => setNewEntryTitle(e.target.value)}
                    placeholder="Entry title..."
                    className="w-full text-lg font-semibold border-b border-stone-200 pb-4 focus:outline-none focus:border-amber-400"
                  />
                  <textarea
                    value={newEntryContent}
                    onChange={(e) => setNewEntryContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full h-40 resize-none focus:outline-none text-stone-700"
                  />
                  <button
                    onClick={createEntry}
                    disabled={!newEntryTitle || !newEntryContent}
                    className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                  >
                    Save Entry
                  </button>
                </div>

                <div className="space-y-3">
                  {entries.map((entry, idx) => (
                    <div key={`entry-all-${idx}`} className="bg-white rounded-lg p-4 border border-stone-200 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-stone-900">{entry.title}</h3>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                      <p className="text-sm text-stone-600 line-clamp-3">{entry.content}</p>
                      <p className="text-xs text-stone-500 mt-2">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'habits' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-4xl text-stone-900">Habits</h1>
                  <p className="text-stone-600 mt-2">Build better routines and track your consistency.</p>
                </div>

                <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
                  <input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="Habit name (e.g., Morning meditation)"
                    className="w-full text-lg font-semibold border-b border-stone-200 pb-4 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    placeholder="Category (e.g., Health, Mindfulness)"
                    className="w-full text-sm border border-stone-200 rounded-lg p-3 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={createHabit}
                    disabled={!newHabitName}
                    className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                  >
                    Create Habit
                  </button>
                </div>

                <div className="space-y-3">
                  {habits.length > 0 ? (
                    habits.map((habit, idx) => (
                      <div key={`habit-${idx}`} className="bg-white rounded-lg p-4 border border-stone-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h3 className="font-semibold text-stone-900">{habit.name}</h3>
                            <p className="text-xs text-stone-500">{habit.category}</p>
                          </div>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <button
                          onClick={() => toggleHabit(habit.id)}
                          className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                            isTodayCompleted(habit.completions)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700'
                          }`}
                        >
                          {isTodayCompleted(habit.completions) ? (
                            <>
                              <Check size={16} /> Completed Today
                            </>
                          ) : (
                            <>
                              <Plus size={16} /> Mark Complete
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-stone-500 py-8">No habits yet. Create one to get started!</p>
                  )}
                </div>
              </div>
            )}

            {view === 'insights' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-4xl text-stone-900">Insights</h1>
                  <p className="text-stone-600 mt-2">Understand your patterns and emotions.</p>
                </div>

                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-stone-200 p-6">
                      <h3 className="font-semibold text-stone-900 mb-4">Entry Statistics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-stone-600">Total Entries</span>
                            <span className="font-semibold text-stone-900">{stats.totalEntries || 0}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-stone-600">This Month</span>
                            <span className="font-semibold text-stone-900">{stats.thisMonth || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-stone-200 p-6">
                      <h3 className="font-semibold text-stone-900 mb-4">Mood Distribution</h3>
                      <div className="space-y-3">
                        {stats.moodDistribution && Object.entries(stats.moodDistribution).map(([mood, count]: [string, any]) => (
                          <div key={mood}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-stone-600">{mood}</span>
                              <span className="text-xs font-semibold text-stone-500">{count}</span>
                            </div>
                            <div className="w-full bg-stone-200 rounded-full h-2">
                              <div
                                className="bg-amber-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg border border-stone-200 p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">Habit Completions</h3>
                  <div className="space-y-3">
                    {habits.length > 0 ? (
                      habits.map((habit, idx) => {
                        const completedDays = Object.values(habit.completions).filter(v => v).length
                        return (
                          <div key={`habit-insights-${idx}`}>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-stone-600">{habit.name}</span>
                              <span className="text-xs font-semibold text-amber-600">{completedDays} days</span>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-stone-500 text-sm">No habits tracked yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-serif text-4xl text-stone-900">Profile</h1>
                  <p className="text-stone-600 mt-2">Your account and preferences.</p>
                </div>

                {user && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-stone-200 p-6">
                      <h3 className="font-semibold text-stone-900 mb-4">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Username</label>
                          <input
                            type="text"
                            value={user.username}
                            disabled
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg bg-stone-50 text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                          <input
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-stone-200 rounded-lg bg-stone-50 text-stone-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-stone-200 p-6">
                      <h3 className="font-semibold text-stone-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          value={editingPassword}
                          onChange={(e) => setEditingPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={updatePassword}
                          disabled={!editingPassword}
                          className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-red-200 p-6">
                      <h3 className="font-semibold text-red-900 mb-4">Danger Zone</h3>
                      <button
                        onClick={deleteAccount}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
                      <p className="text-xs text-stone-500 mt-2">This action cannot be undone.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
