// sanity/schemas/index.ts — 모든 스키마 export
import siteSettings from './siteSettings'
import round        from './round'
import classInfo    from './classInfo'
import result       from './result'
import post         from './post'
import media        from './media'
import partner      from './partner'
import history      from './history'
import regulation   from './regulation'
import application  from './application'
import mediaKit     from './mediaKit'
import tableBlock   from './blocks/tableBlock'

export const schemaTypes = [
  siteSettings,
  round,
  classInfo,
  result,
  post,
  media,
  partner,
  history,
  regulation,
  application,
  mediaKit,
  tableBlock,
]
