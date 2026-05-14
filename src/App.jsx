import { useState, useEffect } from 'react'
import { SECTIONS, COCA_SECTION, GROUP_ORDER, GROUP_LABELS, getSectionsByGroup } from './data/albumData'
import { getOrCreateRoom, saveCollection, isSupabaseConfigured } from './lib/supabase'
import { useAlbum } from './hooks/useAlbum'
import { SnackbarProvider } from './context/SnackbarContext'
import RoomSetup from './components/RoomSetup'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import SectionGroup from './components/SectionGroup'
import TradingList from './components/TradingList'
import MissingList from './components/MissingList'
import Footer from './components/Footer'
import Onboarding from './components/Onboarding'

const ONBOARDING_KEY = 'album-onboarding-done'

export default function App() {
  const [roomCode, setRoomCode] = useState(null)
  const [appReady, setAppReady] = useState(false)
  const [filter, setFilter] = useState('todas')
  const [showOnboarding, setShowOnboarding] = useState(false)

  const { collection, setSticker, decrementSticker, resetCollection, loadFromSupabase, loaded } = useAlbum(roomCode)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sala = params.get('sala')
    if (sala) {
      enterRoom(sala)
    } else if (!isSupabaseConfigured()) {
      setAppReady(true)
      if (!localStorage.getItem(ONBOARDING_KEY)) setShowOnboarding(true)
    }
  }, [])

  async function enterRoom(code, isNew = false) {
    try {
      const room = await getOrCreateRoom(code, isNew ? 'Copa do Mundo FIFA 2026' : undefined)
      if (room && room.data && Object.keys(room.data).length > 0) {
        // Supabase tem dados → remoto prevalece
        loadFromSupabase(room.data)
      } else if (room) {
        // Supabase está vazio → verifica se há dados locais para sincronizar
        try {
          const localRaw = localStorage.getItem('album-copa-2026')
          const localData = localRaw ? JSON.parse(localRaw) : {}
          if (Object.keys(localData).length > 0) {
            await saveCollection(code, localData)
          }
        } catch (e) {
          console.warn('Sync local→Supabase falhou:', e)
        }
      }
      setRoomCode(code)
      const url = new URL(window.location.href)
      url.searchParams.set('sala', code)
      window.history.pushState({}, '', url)
      setAppReady(true)
      if (!localStorage.getItem(ONBOARDING_KEY)) setShowOnboarding(true)
    } catch (err) {
      console.error('Erro ao entrar na sala:', err)
      alert('Não foi possível entrar na coleção. Verifique o código e tente novamente.')
    }
  }

  async function handleEnterRoom(code, createNew = false) {
    await enterRoom(code, createNew)
  }

  function handleOnboardingDone() {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setShowOnboarding(false)
  }

  function getSectionVisible(section) {
    const ids = Array.from({ length: section.count }, (_, i) => `${section.id}-${i + 1}`)
    return ids.some(id => (collection[id] || 0) >= 1)
  }

  function getOwnedIds(section) {
    const ids = Array.from({ length: section.count }, (_, i) => `${section.id}-${i + 1}`)
    return ids.filter(id => (collection[id] || 0) >= 1)
  }

  if (!appReady) {
    return (
      <SnackbarProvider>
        <RoomSetup
          onEnterRoom={handleEnterRoom}
          onLocalMode={() => {
            setAppReady(true)
            if (!localStorage.getItem(ONBOARDING_KEY)) setShowOnboarding(true)
          }}
        />
      </SnackbarProvider>
    )
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  const sectionsByGroup = getSectionsByGroup()

  // Faltam e Repetidas → view dedicada (lista plana)
  if (filter === 'faltam') {
    return (
      <SnackbarProvider>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Header collection={collection} roomCode={roomCode} />
          <StatsBar collection={collection} activeFilter={filter} onFilterChange={setFilter} />
          <div className="flex-1">
            <MissingList collection={collection} />
          </div>
          <Footer onReset={resetCollection} />
        </div>
      </SnackbarProvider>
    )
  }

  if (filter === 'repetidas') {
    return (
      <SnackbarProvider>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Header collection={collection} roomCode={roomCode} />
          <StatsBar collection={collection} activeFilter={filter} onFilterChange={setFilter} />
          <div className="flex-1">
            <TradingList collection={collection} onStickerTrade={decrementSticker} />
          </div>
          <Footer onReset={resetCollection} />
        </div>
      </SnackbarProvider>
    )
  }

  // Todas / Tenho → accordion por grupo
  const isFilterTenho = filter === 'tenho'

  const cocaIds = Array.from({ length: COCA_SECTION.count }, (_, i) => `CC-${i + 1}`)
  const cocaOwned = cocaIds.filter(id => (collection[id] || 0) >= 1)

  // Estado vazio para "Tenho"
  const allGroupsEmpty = isFilterTenho && GROUP_ORDER.every(group => {
    const sections = sectionsByGroup[group] || []
    return sections.every(s => !getSectionVisible(s))
  }) && cocaOwned.length === 0

  return (
    <SnackbarProvider>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header collection={collection} roomCode={roomCode} />

        <StatsBar
          collection={collection}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        <div className="flex-1">
          {allGroupsEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <span className="text-5xl mb-4">📖</span>
              <p className="text-gray-300 font-semibold mb-1">Nenhuma figurinha marcada</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Vá para <button onClick={() => setFilter('todas')} className="text-amber-400 underline underline-offset-2">Todas</button> e comece a marcar suas figurinhas!
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full px-4 pb-6 space-y-6">
              {GROUP_ORDER.map(group => {
                const sections = sectionsByGroup[group] || []
                const visibleSections = isFilterTenho
                  ? sections.filter(getSectionVisible)
                  : sections
                if (visibleSections.length === 0) return null

                return (
                  <div key={group}>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4 px-1">
                      {GROUP_LABELS[group]}
                    </h2>
                    <div className="space-y-2">
                      {visibleSections.map(section => (
                        <SectionGroup
                          key={section.id}
                          section={section}
                          collection={collection}
                          onStickerClick={setSticker}
                          forceOpen={isFilterTenho}
                          filteredIds={isFilterTenho ? getOwnedIds(section) : null}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Seção Coca-Cola — bônus, sempre visível em "todas" e "tenho" */}
              {(() => {
                if (isFilterTenho && cocaOwned.length === 0) return null
                return (
                  <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4 px-1">
                      🥤 Coca-Cola — Bônus (não contabilizadas)
                    </h2>
                    <div className="space-y-2">
                      <SectionGroup
                        section={COCA_SECTION}
                        collection={collection}
                        onStickerClick={setSticker}
                        forceOpen={isFilterTenho}
                        filteredIds={isFilterTenho ? cocaOwned : null}
                      />
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        <Footer onReset={resetCollection} />

        {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      </div>
    </SnackbarProvider>
  )
}
