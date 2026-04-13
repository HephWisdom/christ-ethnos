import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api.js'

const ADMIN_STORAGE_KEY = 'church-admin-api-key'
const tabs = ['sermons', 'events', 'daily-word']

function getStoredAdminKey() {
  const sessionKey = window.sessionStorage.getItem(ADMIN_STORAGE_KEY)

  if (sessionKey) return sessionKey

  const legacyKey = window.localStorage.getItem(ADMIN_STORAGE_KEY)

  if (legacyKey) {
    window.sessionStorage.setItem(ADMIN_STORAGE_KEY, legacyKey)
    window.localStorage.removeItem(ADMIN_STORAGE_KEY)
  }

  return legacyKey || ''
}

function storeAdminKey(value) {
  window.sessionStorage.setItem(ADMIN_STORAGE_KEY, value)
  window.localStorage.removeItem(ADMIN_STORAGE_KEY)
}

function clearStoredAdminKey() {
  window.sessionStorage.removeItem(ADMIN_STORAGE_KEY)
  window.localStorage.removeItem(ADMIN_STORAGE_KEY)
}

const collectionConfig = {
  sermons: {
    title: 'Sermons',
    description: 'Manage preachings that appear on the public sermons page.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'speaker', label: 'Speaker', type: 'text' },
      { key: 'publishedAt', label: 'Published At', type: 'datetime-local' },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'videoId', label: 'YouTube Video ID', type: 'text' },
    ],
    empty: {
      title: '',
      speaker: '',
      publishedAt: '',
      duration: '',
      videoId: '',
    },
    normalize(record) {
      return {
        id: record.id,
        title: record.title || '',
        speaker: record.speaker || '',
        publishedAt: record.publishedAt ? new Date(record.publishedAt).toISOString().slice(0, 16) : '',
        duration: record.duration || '',
        videoId: record.videoId || '',
      }
    },
    listLabel(record) {
      return `${record.title} · ${record.speaker}`
    },
  },
  events: {
    title: 'Events',
    description: 'Manage the event cards and registrations source data.',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'startsAt', label: 'Starts At', type: 'datetime-local' },
    ],
    empty: {
      title: '',
      location: '',
      startsAt: '',
    },
    normalize(record) {
      return {
        id: record.id,
        title: record.title || '',
        location: record.location || '',
        startsAt: record.startsAt ? new Date(record.startsAt).toISOString().slice(0, 16) : '',
      }
    },
    listLabel(record) {
      return `${record.title} · ${record.location}`
    },
  },
  'daily-word': {
    title: 'Daily Word',
    description: 'Manage scripture reflections used in the daily word section.',
    fields: [
      { key: 'reference', label: 'Reference', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea' },
      { key: 'meditation', label: 'Meditation', type: 'textarea' },
      { key: 'sortOrder', label: 'Sort Order', type: 'number' },
    ],
    empty: {
      reference: '',
      quote: '',
      meditation: '',
      sortOrder: '1',
    },
    normalize(record) {
      return {
        id: record.id,
        reference: record.reference || '',
        quote: record.quote || '',
        meditation: record.meditation || '',
        sortOrder: String(record.sortOrder ?? '1'),
      }
    },
    listLabel(record) {
      return `${record.reference}`
    },
  },
}

function formatTimestamp(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function SubmissionColumn({ title, items, renderBody }) {
  return (
    <div className="border border-bone/10 bg-void/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl text-bone">{title}</h3>
        <span className="meta-label">{items.length} recent</span>
      </div>
      <div className="mt-5 space-y-4">
        {items.length === 0 && (
          <p className="font-body text-sm text-bone/35">No submissions yet.</p>
        )}
        {items.map((item) => (
          <article key={item.id} className="border-t border-bone/10 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-label text-xs tracking-[0.22em] uppercase text-ember-300">
                {item.name || item.eventTitle}
              </p>
              <span className="font-body text-xs italic text-bone/30">{formatTimestamp(item.createdAt)}</span>
            </div>
            <div className="mt-2 font-body text-sm leading-relaxed text-bone/50">
              {renderBody(item)}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function CollectionEditor({
  type,
  records,
  draft,
  setDraft,
  selectedId,
  onSelect,
  onCreateNew,
  onSave,
  onDelete,
  isSaving,
}) {
  const config = collectionConfig[type]

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <div className="border border-bone/10 bg-void/55 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-bone">{config.title}</h3>
            <p className="mt-1 font-body text-sm text-bone/35">{config.description}</p>
          </div>
          <button type="button" className="btn-bracket" onClick={onCreateNew}>
            (new)
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {records.map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => onSelect(record)}
              className={`w-full border p-4 text-left transition-all ${
                selectedId === record.id
                  ? 'border-ember-400 bg-ember-950/30'
                  : 'border-bone/10 hover:border-bone/25'
              }`}
            >
              <p className="font-label text-xs tracking-[0.22em] uppercase text-ember-300">
                {config.listLabel(record)}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={onSave}
        className="border border-bone/10 bg-[#090b0b] p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="meta-label">{selectedId ? 'Editing' : 'Creating'}</p>
            <h3 className="mt-3 font-display text-3xl text-bone">
              {selectedId ? 'Update record' : 'Create record'}
            </h3>
          </div>
          {selectedId && (
            <button type="button" className="btn-bracket" onClick={onDelete}>
              (delete)
            </button>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {config.fields.map((field) => (
            <label
              key={field.key}
              className={`field-shell ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
            >
              <span className="meta-label">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  className="field-textarea min-h-[140px]"
                  value={draft[field.key]}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                  required
                />
              ) : (
                <input
                  className="field-input"
                  type={field.type}
                  value={draft[field.key]}
                  onChange={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))}
                  required
                />
              )}
            </label>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button className="btn-bracket-glow" disabled={isSaving}>
            {isSaving ? '(saving...)' : selectedId ? '(save changes)' : '(create record)'}
          </button>
          <span className="font-body text-sm text-bone/30 italic">
            Saved through the protected admin API.
          </span>
        </div>
      </form>
    </div>
  )
}

export default function AdminPortal() {
  const [keyInput, setKeyInput] = useState(() => getStoredAdminKey())
  const [adminKey, setAdminKey] = useState(() => getStoredAdminKey())
  const [dashboard, setDashboard] = useState(null)
  const [collections, setCollections] = useState({
    sermons: [],
    events: [],
    'daily-word': [],
  })
  const [activeTab, setActiveTab] = useState('sermons')
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState(collectionConfig.sermons.empty)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState({ tone: 'idle', message: '' })

  const currentConfig = useMemo(() => collectionConfig[activeTab], [activeTab])

  async function adminRequest(pathname, options = {}, keyOverride = adminKey) {
    return apiRequest(pathname, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'x-admin-api-key': keyOverride,
      },
    })
  }

  async function loadAdminData(keyOverride = adminKey) {
    if (!keyOverride) return

    setIsLoading(true)
    setStatus({ tone: 'idle', message: '' })

    const [dashboardResult, sermonsResult, eventsResult, dailyWordResult] = await Promise.allSettled([
      adminRequest('/api/admin/dashboard', {}, keyOverride),
      adminRequest('/api/admin/sermons', {}, keyOverride),
      adminRequest('/api/admin/events', {}, keyOverride),
      adminRequest('/api/admin/daily-word', {}, keyOverride),
    ])

    const failures = [
      dashboardResult.status === 'rejected'
        ? { label: 'Dashboard', message: dashboardResult.reason.message }
        : null,
      sermonsResult.status === 'rejected'
        ? { label: 'Sermons', message: sermonsResult.reason.message }
        : null,
      eventsResult.status === 'rejected'
        ? { label: 'Events', message: eventsResult.reason.message }
        : null,
      dailyWordResult.status === 'rejected'
        ? { label: 'Daily Word', message: dailyWordResult.reason.message }
        : null,
    ].filter(Boolean)

    const invalidKeyFailure = failures.find((failure) =>
      failure.message.toLowerCase().includes('invalid admin api key')
    )

    if (invalidKeyFailure) {
      clearStoredAdminKey()
      setAdminKey('')
      setIsLoading(false)
      return
    }

    setDashboard(dashboardResult.status === 'fulfilled' ? dashboardResult.value : null)
    setCollections({
      sermons: sermonsResult.status === 'fulfilled' ? sermonsResult.value : [],
      events: eventsResult.status === 'fulfilled' ? eventsResult.value : [],
      'daily-word': dailyWordResult.status === 'fulfilled' ? dailyWordResult.value : [],
    })

    if (failures.length > 0) {
      const primaryFailure = failures[0]
      const isPartialLoad = failures.length < 4

      setStatus({
        tone: 'error',
        message: isPartialLoad
          ? `${primaryFailure.label} is temporarily unavailable. ${primaryFailure.message}`
          : primaryFailure.message,
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (adminKey) {
      loadAdminData(adminKey)
    }
  }, [adminKey])

  useEffect(() => {
    setSelectedId(null)
    setDraft(currentConfig.empty)
  }, [activeTab, currentConfig.empty])

  function handleAdminUnlock(event) {
    event.preventDefault()
    storeAdminKey(keyInput)
    setAdminKey(keyInput)
  }

  function handleSelectRecord(record) {
    setSelectedId(record.id)
    setDraft(currentConfig.normalize(record))
  }

  function handleCreateNew() {
    setSelectedId(null)
    setDraft(currentConfig.empty)
  }

  async function handleSave(event) {
    event.preventDefault()
    setIsSaving(true)
    setStatus({ tone: 'idle', message: '' })

    try {
      const pathname = selectedId
        ? `/api/admin/${activeTab}/${selectedId}`
        : `/api/admin/${activeTab}`

      await adminRequest(pathname, {
        method: selectedId ? 'PUT' : 'POST',
        body: JSON.stringify(draft),
      })

      setStatus({
        tone: 'success',
        message: `${currentConfig.title} updated successfully.`,
      })
      await loadAdminData()
      handleCreateNew()
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedId || !window.confirm('Delete this record?')) {
      return
    }

    setIsSaving(true)
    setStatus({ tone: 'idle', message: '' })

    try {
      await adminRequest(`/api/admin/${activeTab}/${selectedId}`, {
        method: 'DELETE',
      })

      setStatus({
        tone: 'success',
        message: `${currentConfig.title} record deleted.`,
      })
      await loadAdminData()
      handleCreateNew()
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error.message,
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!adminKey) {
    return (
      <main className="min-h-screen bg-ash px-6 pb-24 pt-32 md:px-16">
        <div className="mx-auto max-w-xl border border-bone/12 bg-void/80 p-8 md:p-10">
          <p className="meta-label">Admin</p>
          <h1 className="mt-5 font-display text-5xl text-bone leading-tight">
            Unlock the
            <br />
            <em className="text-ember-300">editor portal</em>
          </h1>
          <p className="mt-6 font-body text-bone/48 leading-relaxed">
            This route is protected by `ADMIN_API_KEY`. Enter the key from your local `.env` file
            to manage content and review incoming submissions.
          </p>

          <form className="mt-10 space-y-4" onSubmit={handleAdminUnlock}>
            <label className="field-shell">
              <span className="meta-label">Admin API Key</span>
              <input
                className="field-input"
                type="password"
                value={keyInput}
                onChange={(event) => setKeyInput(event.target.value)}
                placeholder="Paste your admin key"
                required
              />
            </label>
            <button className="btn-bracket-glow">(unlock admin)</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ash px-6 pb-24 pt-28 md:px-16 md:pt-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="meta-label">Admin</p>
            <h1 className="mt-5 font-display text-5xl md:text-6xl text-bone leading-tight">
              Content and
              <br />
              <em className="text-ember-300">submission control</em>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="btn-bracket" onClick={() => loadAdminData()}>
              (refresh)
            </button>
            <button
              type="button"
              className="btn-bracket"
              onClick={() => {
                clearStoredAdminKey()
                setAdminKey('')
                setKeyInput('')
              }}
            >
              (lock)
            </button>
          </div>
        </div>

        {status.message && (
          <p className={`mt-8 form-status ${status.tone === 'error' ? 'form-status-error' : 'form-status-success'}`}>
            {status.message}
          </p>
        )}

        <section className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboard && Object.entries(dashboard.counts).map(([label, value]) => (
            <div key={label} className="border border-bone/10 bg-void/60 p-5">
              <p className="meta-label">{label.replace(/([A-Z])/g, ' $1')}</p>
              <p className="mt-3 font-display text-4xl text-bone">{value}</p>
            </div>
          ))}
          {!dashboard && isLoading && [...Array(4)].map((_, index) => (
            <div key={index} className="h-28 border border-bone/10 bg-void/40 animate-pulse" />
          ))}
        </section>

        {dashboard && (
          <section className="mt-12 grid gap-5 xl:grid-cols-2 2xl:grid-cols-4">
            <SubmissionColumn
              title="Prayer Requests"
              items={dashboard.recent.prayerRequests}
              renderBody={(item) => (
                <>
                  <p>{item.request}</p>
                  <p className="mt-2 text-bone/28">{item.email || 'No email provided'}</p>
                </>
              )}
            />
            <SubmissionColumn
              title="Contact Messages"
              items={dashboard.recent.contactMessages}
              renderBody={(item) => (
                <>
                  <p>{item.message}</p>
                  <p className="mt-2 text-bone/28">{item.email}</p>
                </>
              )}
            />
            <SubmissionColumn
              title="Event Registrations"
              items={dashboard.recent.eventRegistrations}
              renderBody={(item) => (
                <>
                  <p>{item.eventTitle}</p>
                  <p className="mt-2 text-bone/28">{item.email} · {item.attendees} attendees</p>
                </>
              )}
            />
            <SubmissionColumn
              title="Giving Intents"
              items={dashboard.recent.givingIntents}
              renderBody={(item) => (
                <>
                  <p>${item.amount} · {item.frequency}</p>
                  <p className="mt-2 text-bone/28">{item.email}</p>
                </>
              )}
            />
          </section>
        )}

        <section className="mt-16">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`btn-bracket ${activeTab === tab ? 'bg-bone text-void border-bone' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                ({collectionConfig[tab].title.toLowerCase()})
              </button>
            ))}
          </div>

          <div className="mt-6">
            <CollectionEditor
              type={activeTab}
              records={collections[activeTab]}
              draft={draft}
              setDraft={setDraft}
              selectedId={selectedId}
              onSelect={handleSelectRecord}
              onCreateNew={handleCreateNew}
              onSave={handleSave}
              onDelete={handleDelete}
              isSaving={isSaving}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
