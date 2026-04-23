// schemas/result.ts — 경기 결과 (라운드 × 클래스 × 세션)
import { defineField, defineType } from 'sanity'
import { StarIcon as TrophyIcon } from '@sanity/icons'
import { ResultsImportLinkButton } from '../components/ResultsImportLinkButton'

export default defineType({
  name: 'result',
  title: '경기 결과',
  type: 'document',
  icon: TrophyIcon,

  fields: [
    /* ── 일괄 입력 버튼 ────────────────────────────────────── */
    defineField({
      name: 'importAction',
      title: '📥 엑셀로 일괄 입력',
      type: 'string',
      readOnly: true,
      components: { input: ResultsImportLinkButton },
    }),

    /* ── 연결 정보 ─────────────────────────────────────────── */
    defineField({
      name: 'round',
      title: '라운드',
      type: 'reference',
      to: [{ type: 'round' }],
      validation: R => R.required(),
    }),
    defineField({
      name: 'classInfo',
      title: '클래스',
      type: 'reference',
      to: [{ type: 'classInfo' }],
      validation: R => R.required(),
    }),
    defineField({
      name: 'raceType',
      title: '세션 유형',
      type: 'string',
      options: {
        list: [
          { title: '예선 (Qualifying)', value: 'qualifying' },
          { title: '결승 1 (Race 1)',    value: 'race1' },
          { title: '결승 2 (Race 2)',    value: 'race2' },
          { title: '결승 (Race)',        value: 'race' },
        ],
        layout: 'radio',
      },
      initialValue: 'race',
      validation: R => R.required(),
    }),

    /* ── 순위표 ────────────────────────────────────────────── */
    defineField({
      name: 'standings',
      title: '순위표',
      type: 'array',
      of: [{
        type: 'object',
        name: 'standing',
        fields: [
          defineField({ name: 'position',    title: '순위',      type: 'number',
            validation: R => R.required().integer().min(1) }),
          defineField({ name: 'carNumber',   title: '차량 번호', type: 'string' }),
          defineField({ name: 'teamName',    title: '팀명',      type: 'string' }),
          defineField({ name: 'driver1',     title: '드라이버 1', type: 'string' }),
          defineField({ name: 'driver2',     title: '드라이버 2 (공동)', type: 'string' }),
          defineField({ name: 'carModel',    title: '차량 모델', type: 'string' }),
          defineField({ name: 'laps',        title: '완주 랩수', type: 'number' }),
          defineField({ name: 'totalTime',   title: '총 시간',   type: 'string',
            description: '예: 1:23:45.678' }),
          defineField({ name: 'gap',         title: '갭',        type: 'string',
            description: '예: +12.345' }),
          defineField({ name: 'fastestLap',  title: '패스티스트 랩', type: 'string' }),
          defineField({ name: 'points',      title: '포인트',    type: 'number' }),
          defineField({
            name: 'status',
            title: '상태',
            type: 'string',
            options: {
              list: [
                { title: '완주',  value: 'classified' },
                { title: 'DNF',   value: 'dnf' },
                { title: 'DNS',   value: 'dns' },
                { title: 'DSQ',   value: 'dsq' },
              ],
            },
            initialValue: 'classified',
          }),
        ],
        preview: {
          select: { pos: 'position', car: 'carNumber', team: 'teamName' },
          prepare({ pos, car, team }: any) {
            return { title: `P${pos} — #${car} ${team ?? ''}` }
          },
        },
      }],
    }),

    /* ── 챔피언십 포인트 (시즌 누적) ─────────────────────── */
    defineField({
      name: 'championshipStandings',
      title: '챔피언십 포인트 (이 라운드 이후 누적)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'position',    title: '순위',      type: 'number' }),
          defineField({ name: 'carNumber',   title: '차량 번호', type: 'string' }),
          defineField({ name: 'teamName',    title: '팀명',      type: 'string' }),
          defineField({ name: 'driver1',     title: '드라이버 1', type: 'string' }),
          defineField({ name: 'driver2',     title: '드라이버 2', type: 'string' }),
          defineField({ name: 'totalPoints', title: '누적 포인트', type: 'number' }),
        ],
        preview: {
          select: { pos: 'position', team: 'teamName', pts: 'totalPoints' },
          prepare({ pos, team, pts }: any) {
            return { title: `${pos}위 — ${team ?? ''}`, subtitle: `${pts ?? 0}pt` }
          },
        },
      }],
    }),

    /* ── 미디어 / 공개 ─────────────────────────────────────── */
    defineField({
      name: 'resultPdf',
      title: '결과 PDF',
      type: 'file',
      options: { accept: 'application/pdf' },
    }),
    defineField({
      name: 'highlightVideoUrl',
      title: '하이라이트 영상 URL (YouTube)',
      type: 'url',
    }),
    defineField({
      name: 'isPublished',
      title: '결과 공개',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '공개 일시',
      type: 'datetime',
    }),
  ],

  orderings: [
    {
      title: '라운드 최신순',
      name: 'roundDesc',
      by: [{ field: 'round.season', direction: 'desc' }, { field: 'round.roundNumber', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      season:    'round.season',
      roundNum:  'round.roundNumber',
      roundTitle:'round.title',
      className: 'classInfo.name',
      raceType:  'raceType',
      published: 'isPublished',
    },
    prepare({ season, roundNum, roundTitle, className, raceType, published }: any) {
      const typeLabel: Record<string, string> = {
        qualifying: '예선', race1: '결승1', race2: '결승2', race: '결승',
      }
      return {
        title:    `${season} R${roundNum} ${className ?? ''}`,
        subtitle: `${roundTitle ?? ''} — ${typeLabel[raceType] ?? raceType} ${published ? '✅' : '🔒'}`,
      }
    },
  },
})
