// types/sanity.ts — Sanity 문서 타입 전체 정의

// ── 공통 ─────────────────────────────────────────────────────
export interface SanityImage {
  asset: {
    _id:  string
    url:  string
    metadata: {
      lqip:       string
      dimensions: { width: number; height: number }
    }
  }
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?:    { top: number; bottom: number; left: number; right: number }
  alt?:     string
  caption?: string
}

export interface SanitySlug { current: string }

// ── siteSettings ─────────────────────────────────────────────
export interface SiteSettings {
  siteName:         string
  siteNameEn:       string
  slogan:           string
  currentSeason:    number
  // SEO
  metaTitle:        string
  metaDescription:  string
  ogImage?:         SanityImage
  canonicalUrl:     string
  // 연락처 / SNS
  email?:           string
  phone?:           string
  kakaoChannelUrl?: string
  address?:         string
  instagram?:       string
  youtube?:         string
  facebook?:        string
  naverBlog?:       string
  // 로고
  logoLight?:       SanityImage
  logoDark?:        SanityImage
  // 히어로 이미지
  heroImage?:       SanityImage
  heroImages?:      SanityImage[]
  heroVideo?:       string
  heroAbout?:       SanityImage
  heroSeason?:      SanityImage
  heroEntry?:       SanityImage
  heroResults?:     SanityImage
  heroMedia?:       SanityImage
  heroCircuit?:     SanityImage
  // 참가신청
  isEntryOpen:      boolean
  entryNotice?:     string
  tossPaymentBaseUrl?: string
  // 배너
  bannerVisible:    boolean
  bannerMessage?:   string
  bannerLinkText?:  string
  bannerLinkUrl?:   string
  bannerBgColor?:   string
  // 공지 알림 띠
  announcementBar?: {
    isVisible?: boolean
    text?:      string
    link?:      string
  }
  // 서킷
  circuitName:      string
  circuitLength:    number
  circuitLocation:  string
  speediumUrl?:     string
  circuitMapEmbedUrl?: string
}

// ── round ─────────────────────────────────────────────────────
export type RoundStatus =
  | 'upcoming' | 'entry_open' | 'entry_closed' | 'ongoing' | 'finished'

export interface ScheduleSession {
  time:        string
  label:       string
  sessionType: 'practice' | 'qualifying' | 'race' | 'other'
}

export interface ScheduleDay {
  dayLabel: string
  items:    ScheduleSession[]
}

export interface Round {
  _id:           string
  season:        number
  roundNumber:   number
  slug:          SanitySlug
  title:         string
  titleEn?:      string
  subtitle?:     string
  campaignCopy?: string
  badge?:        string
  dateStart:     string
  dateEnd?:      string
  status:        RoundStatus
  schedule?:     ScheduleDay[]
  // 참가신청
  entryOpenDate?:  string
  entryCloseDate?: string
  tossPaymentUrl?: string
  entryFeeNote?:   string
  maxEntries?:     number
  // 콘텐츠
  description?: any[]
  notices?:     Array<{ title: string; content: string }>
  hasResults:   boolean
  // 미디어
  heroImage?:    SanityImage
  resultImage?:  SanityImage
  resultUrl?:    string
  posterImage?:  SanityImage
  gallery?:      SanityImage[]
}

// ── classInfo ─────────────────────────────────────────────────
export type ClassCode = 'GT1' | 'GT2' | 'GT3' | 'DRIFT' | 'BIKE' | 'SUPERCAR'

export interface ClassFeature {
  icon?:  string
  label:  string
  value:  string
}

export interface ClassInfo {
  _id:         string
  classCode:   ClassCode
  slug:        SanitySlug
  order:       number
  name:        string
  nameEn?:     string
  tagline?:    string
  accentColor?: string
  teamCount?:  number
  driverCount?: number
  carCount?:   number
  eligibility?: any[]
  features?:   ClassFeature[]
  entryFeePerRound?: number
  entryFeeSeason?:   number
  entryFeeNote?:     string
  isFeePublic?:      boolean
  vehicleRegulations?: any[]
  regulationPdf?:    { asset: { url: string } }
  heroImage?:  SanityImage
  cardImage?:  SanityImage
  gallery?:    SanityImage[]
  isActive:    boolean
  isEntryOpen: boolean
}

// ── result ────────────────────────────────────────────────────
export type RaceType      = 'qualifying' | 'race1' | 'race2' | 'race'
export type StandingStatus = 'classified' | 'dnf' | 'dns' | 'dsq'

export interface Standing {
  position:   number
  carNumber?: string
  teamName?:  string
  driver1?:   string
  driver2?:   string
  carModel?:  string
  laps?:      number
  totalTime?: string
  gap?:       string
  fastestLap?: string
  points?:    number
  status:     StandingStatus
}

export interface ChampionshipStanding {
  position:     number
  carNumber?:   string
  teamName?:    string
  driver1?:     string
  driver2?:     string
  totalPoints?: number
}

export interface Result {
  _id:        string
  round:      Pick<Round, 'roundNumber' | 'title' | 'dateStart'>
  classInfo:  Pick<ClassInfo, 'classCode' | 'name' | 'accentColor'>
  raceType:   RaceType
  standings:  Standing[]
  championshipStandings?: ChampionshipStanding[]
  resultPdf?: { asset: { url: string } }
  highlightVideoUrl?: string
  isPublished: boolean
  publishedAt?: string
}

// ── post ──────────────────────────────────────────────────────
export type PostCategory =
  | 'notice' | 'news' | 'press' | 'entry' | 'regulation' | 'event'

export interface Post {
  _id:           string
  category:      PostCategory
  isPinned:      boolean
  title:         string
  slug:          SanitySlug
  publishedAt:   string
  author?:       string
  excerpt?:      string
  coverImage?:   SanityImage
  relatedRound?: Pick<Round, 'roundNumber' | 'title' | 'slug'>
  body?:         any[]
  metaTitle?:         string
  metaDescription?:   string
}

// ── media ─────────────────────────────────────────────────────
export type MediaType = 'photoAlbum' | 'video' | 'uploadedVideo'

export interface MediaPhoto {
  image:    SanityImage
  alt?:     string
  caption?: string
  credit?:  string
}

export interface Media {
  _id:           string
  mediaType:     MediaType
  title:         string
  slug:          SanitySlug
  publishedAt?:  string
  description?:  string
  relatedRound?: Pick<Round, 'roundNumber' | 'title' | 'slug'>
  relatedClass?: Pick<ClassInfo, 'classCode' | 'name'>
  coverImage?:   SanityImage
  photos?:       MediaPhoto[]
  youtubeUrl?:   string
  youtubeThumbnail?: string
  duration?:     string
  isFeatured:    boolean
  isPublished:   boolean
  sortOrder?:    number
  tags?:         string[]
  photoCount?:   number   // 계산 필드 (count(photos))
}

// ── partner ───────────────────────────────────────────────────
export type PartnerTier =
  | 'title' | 'presenting' | 'gold' | 'silver' | 'official' | 'media' | 'supporting'

export interface Partner {
  _id:            string
  name:           string
  nameEn?:        string
  tier:           PartnerTier
  category?:      string
  logo:           SanityImage
  logoWhite?:     SanityImage
  websiteUrl?:    string
  contractSeasons?: number[]
  description?:   string
  isActive:       boolean
  sortOrder?:     number
}

// ── history ───────────────────────────────────────────────────
export interface HistoryChampion {
  classCode:  ClassCode
  teamName?:  string
  driver1?:   string
  driver2?:   string
  carModel?:  string
  carNumber?: string
  photo?:     SanityImage
}

export interface History {
  _id:        string
  year:       number
  edition?:   string
  headline:   string
  summary?:   string
  stats?:     Array<{ label: string; value: string }>
  champions?: HistoryChampion[]
  milestones?: any[]
  heroImage?: SanityImage
  gallery?:   SanityImage[]
  highlightVideoUrl?: string
  isPublished: boolean
}
