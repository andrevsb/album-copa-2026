// Seção FWC — Introdução do álbum (todas foil). Numeradas de 00 a 19.
export const FWC_SECTION = { id: 'FWC', name: 'Introdução FWC', emoji: '✨', group: 'FWC', count: 20, start: 0, pad: 2, foil: true }

// Seção Coca-Cola — bônus, NÃO contabilizada no total oficial. Numeradas de 1 a 14.
export const COCA_SECTION = { id: 'CC', name: 'Coca-Cola', emoji: '🥤', group: 'COCA', count: 14 }

/**
 * Gera os IDs canônicos de uma seção respeitando start e pad.
 * - Padrão (times): start=1, sem padding → "BRA-1" … "BRA-20"
 * - FWC: start=0, pad=2            → "FWC-00" … "FWC-19"
 */
export function getSectionIds(section) {
  const start = section.start ?? 1
  const pad   = section.pad   ?? 0
  return Array.from({ length: section.count }, (_, i) => {
    const num = start + i
    return `${section.id}-${pad ? String(num).padStart(pad, '0') : num}`
  })
}

// 48 seleções organizadas por grupo da Copa (conforme ordem oficial do álbum Panini)
export const SECTIONS = [
  FWC_SECTION,

  // Grupo A
  { id: 'MEX', name: 'México',         emoji: '🇲🇽', group: 'A', count: 20 },
  { id: 'RSA', name: 'África do Sul',  emoji: '🇿🇦', group: 'A', count: 20 },
  { id: 'KOR', name: 'Coreia do Sul',  emoji: '🇰🇷', group: 'A', count: 20 },
  { id: 'CZE', name: 'Rep. Tcheca',    emoji: '🇨🇿', group: 'A', count: 20 },

  // Grupo B
  { id: 'CAN', name: 'Canadá',                emoji: '🇨🇦', group: 'B', count: 20 },
  { id: 'BIH', name: 'Bósnia e Herzegovina',  emoji: '🇧🇦', group: 'B', count: 20 },
  { id: 'QAT', name: 'Catar',                 emoji: '🇶🇦', group: 'B', count: 20 },
  { id: 'SUI', name: 'Suíça',                 emoji: '🇨🇭', group: 'B', count: 20 },

  // Grupo C
  { id: 'BRA', name: 'Brasil',   emoji: '🇧🇷', group: 'C', count: 20 },
  { id: 'MAR', name: 'Marrocos', emoji: '🇲🇦', group: 'C', count: 20 },
  { id: 'HAI', name: 'Haiti',    emoji: '🇭🇹', group: 'C', count: 20 },
  { id: 'SCO', name: 'Escócia',  emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C', count: 20 },

  // Grupo D
  { id: 'USA', name: 'Estados Unidos', emoji: '🇺🇸', group: 'D', count: 20 },
  { id: 'PAR', name: 'Paraguai',       emoji: '🇵🇾', group: 'D', count: 20 },
  { id: 'AUS', name: 'Austrália',      emoji: '🇦🇺', group: 'D', count: 20 },
  { id: 'TUR', name: 'Turquia',        emoji: '🇹🇷', group: 'D', count: 20 },

  // Grupo E
  { id: 'GER', name: 'Alemanha',        emoji: '🇩🇪', group: 'E', count: 20 },
  { id: 'CUW', name: 'Curaçao',         emoji: '🇨🇼', group: 'E', count: 20 },
  { id: 'CIV', name: 'Costa do Marfim', emoji: '🇨🇮', group: 'E', count: 20 },
  { id: 'ECU', name: 'Equador',         emoji: '🇪🇨', group: 'E', count: 20 },

  // Grupo F
  { id: 'NED', name: 'Países Baixos', emoji: '🇳🇱', group: 'F', count: 20 },
  { id: 'JPN', name: 'Japão',         emoji: '🇯🇵', group: 'F', count: 20 },
  { id: 'SWE', name: 'Suécia',        emoji: '🇸🇪', group: 'F', count: 20 },
  { id: 'TUN', name: 'Tunísia',       emoji: '🇹🇳', group: 'F', count: 20 },

  // Grupo G
  { id: 'BEL', name: 'Bélgica',       emoji: '🇧🇪', group: 'G', count: 20 },
  { id: 'EGY', name: 'Egito',         emoji: '🇪🇬', group: 'G', count: 20 },
  { id: 'IRN', name: 'Irã',           emoji: '🇮🇷', group: 'G', count: 20 },
  { id: 'NZL', name: 'Nova Zelândia', emoji: '🇳🇿', group: 'G', count: 20 },

  // Grupo H
  { id: 'ESP', name: 'Espanha',        emoji: '🇪🇸', group: 'H', count: 20 },
  { id: 'CPV', name: 'Cabo Verde',     emoji: '🇨🇻', group: 'H', count: 20 },
  { id: 'KSA', name: 'Arábia Saudita', emoji: '🇸🇦', group: 'H', count: 20 },
  { id: 'URU', name: 'Uruguai',        emoji: '🇺🇾', group: 'H', count: 20 },

  // Grupo I
  { id: 'FRA', name: 'França',   emoji: '🇫🇷', group: 'I', count: 20 },
  { id: 'SEN', name: 'Senegal',  emoji: '🇸🇳', group: 'I', count: 20 },
  { id: 'IRQ', name: 'Iraque',   emoji: '🇮🇶', group: 'I', count: 20 },
  { id: 'NOR', name: 'Noruega',  emoji: '🇳🇴', group: 'I', count: 20 },

  // Grupo J
  { id: 'ARG', name: 'Argentina', emoji: '🇦🇷', group: 'J', count: 20 },
  { id: 'ALG', name: 'Argélia',   emoji: '🇩🇿', group: 'J', count: 20 },
  { id: 'AUT', name: 'Áustria',   emoji: '🇦🇹', group: 'J', count: 20 },
  { id: 'JOR', name: 'Jordânia',  emoji: '🇯🇴', group: 'J', count: 20 },

  // Grupo K
  { id: 'POR', name: 'Portugal',    emoji: '🇵🇹', group: 'K', count: 20 },
  { id: 'COD', name: 'Congo DR',    emoji: '🇨🇩', group: 'K', count: 20 },
  { id: 'UZB', name: 'Uzbequistão', emoji: '🇺🇿', group: 'K', count: 20 },
  { id: 'COL', name: 'Colômbia',    emoji: '🇨🇴', group: 'K', count: 20 },

  // Grupo L
  { id: 'ENG', name: 'Inglaterra', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L', count: 20 },
  { id: 'CRO', name: 'Croácia',    emoji: '🇭🇷', group: 'L', count: 20 },
  { id: 'GHA', name: 'Gana',       emoji: '🇬🇭', group: 'L', count: 20 },
  { id: 'PAN', name: 'Panamá',     emoji: '🇵🇦', group: 'L', count: 20 },
]

export const GROUP_ORDER = ['FWC', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export const GROUP_LABELS = {
  FWC: '✨ FWC — Introdução do Álbum',
  A:   'Grupo A',
  B:   'Grupo B',
  C:   'Grupo C',
  D:   'Grupo D',
  E:   'Grupo E',
  F:   'Grupo F',
  G:   'Grupo G',
  H:   'Grupo H',
  I:   'Grupo I',
  J:   'Grupo J',
  K:   'Grupo K',
  L:   'Grupo L',
}

// Total oficial: FWC (20) + 48 seleções × 20 = 980. Coca-Cola (14) excluída.
export const TOTAL_STICKERS = SECTIONS.reduce((sum, s) => sum + s.count, 0)

export function getAllStickerIds() {
  return SECTIONS.flatMap(getSectionIds)
}

export function getCocaIds() {
  return getSectionIds(COCA_SECTION)
}

export function getSectionsByGroup() {
  const map = {}
  for (const g of GROUP_ORDER) {
    map[g] = SECTIONS.filter(s => s.group === g)
  }
  return map
}
