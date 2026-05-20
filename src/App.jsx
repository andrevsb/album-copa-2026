import { useState, useEffect } from 'react'
import { SECTIONS, COCA_SECTION, GROUP_ORDER, GROUP_LABELS, getSectionsByGroup, getSectionIds, getCocaIds } from './data/albumData'
import { getOrCreateRoom, saveCollection, isSupabaseConfigured, hashPin, verifyPin, getCachedPinHash, cachePinHash } from './lib/supabase'
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
import PinPrompt from './components/PinPrompt'

const ONBOARDING_KEY = 'album-onboarding-done'

export default function App() {
  const [roomCode, setRoomCode] = useState(null)
  const [appReady, setAppReady] = useState(false)
  const [filter, setFilter] = useState('todas')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [pinChallenge, setPinChallenge] = useState(null) // { room, code }

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

  // Finalizes room entry after PIN is verified (or skipped if no PIN)
  async function finalizeEnterRoom(room, code) {
    if (room && room.data && Object.keys(room.data).length > 0) {
      loadFromSupabase(room.data)
    } else if (room) {
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
  }

  async function enterRoom(code, isNew = false, plainPin = null) {
    try {
      let pinHash = null
      if (isNew && plainPin) {
        pinHash = await hashPin(plainPin)
      }
      const room = await getOrCreateRoom(code, isNew ? 'Copa do Mundo FIFA 2026' : undefined, pinHash)

      // If a new room was created with a PIN, cache the hash locally
      if (isNew && pinHash) {
        cachePinHash(code, pinHash)
      }

      // Check if the existing room requires a PIN
      if (room && room.pin) {
        const cached = getCachedPinHash(code)
        if (cached === room.pin) {
          // Same device — skip prompt
          await finalizeEnterRoom(room, code)
          return
        }
        // Unknown device — show PIN prompt
        setPinChallenge({ room, code })
        return
      }

      await finalizeEnterRoom(room, code)
    } catch (err) {
      console.error('Erro ao entrar na sala:', err)
      alert('Não foi possível entrar na coleção. Verifique o código e tente novamente.')
    }
  }

  async function handlePinSubmit(enteredPin) {
    if (!pinChallenge) return false
    const { room, code } = pinChallenge
    const ok = await verifyPin(room.pin, enteredPin)
    if (ok) {
      // Cache so this device doesn't prompt again
      cachePinHash(code, room.pin)
      setPinChallenge(null)
      await finalizeEnterRoom(room, code)
    }
    return ok
  }

  function handlePinCancel() {
    setPinChallenge(null)
    // Go back to the setup screen
    const url = new URL(window.location.href)
    url.searchParams.delete('sala')
    window.history.pushState({}, '', url)
  }

  async function handleEnterRoom(code, createNew = false, pin = null) {
    await enterRoom(code, createNew, pin)
  }

  function handleOnboardingDone() {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setShowOnboarding(false)
  }

  function getSectionVisible(section) {
    return getSectionIds(section).some(id => (collection[id] || 0) >= 1)
  }

  function getOwnedIds(section) {
    return getSectionIds(section).filter(id => (collection[id] || 0) >= 1)
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
        {pinChallenge && (
          <PinPrompt
            roomName={pinChallenge.room?.name || pinChallenge.code}
            onSubmit={handlePinSubmit}
            onCancel={handlePinCancel}
          />
        )}
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

  const cocaIds = getCocaIds()
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
