import type { Program } from '@/models/Program'

export const programs: Program[] = [
  {
    id: 1,
    name: 'Пятница — 22.11.2025',
    leader: 'Никита',
    songs: [
      {
        id: 1,
        order: 1,
        song: { id: 1, name: 'Будем петь', key: 'A', bpm: 120 },
      },
      {
        id: 2,
        order: 2,
        song: { id: 2, name: 'Ты ждешь когда я приду', key: 'G', bpm: 140 },
      },
      {
        id: 3,
        order: 3,
        song: { id: 3, name: 'В доме Господа', key: 'H', bpm: 140 },
      },
      {
        id: 4,
        order: 4,
        song: { id: 4, name: 'Жить в твоей реальности', key: 'E', bpm: 140 },
      },
    ],
  },
  {
    id: 2,
    name: 'Воскресенье — 22.11.2025',
    leader: 'Олеся',
    songs: [
      {
        id: 3,
        order: 1,
        song: { id: 3, name: 'Когда со мною рядом Ты', key: 'F', bpm: 110 },
      },
      {
        id: 4,
        order: 2,
        song: { id: 4, name: 'Твоя благость', key: 'C', bpm: 100 },
      },
      {
        id: 5,
        order: 3,
        song: { id: 5, name: 'Благословение', key: 'A', bpm: 85.5 },
      },
    ],
  },
]
