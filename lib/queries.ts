// lib/queries.ts — 프론트엔드 GROQ 쿼리 모음

// ── 공통 이미지 프로젝션 ──────────────────────────────────────
export const IMAGE = /* groq */`{
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } },
  hotspot, crop, alt
}`

// ════════════════════════════════════════════════════════════
// siteSettings
// ════════════════════════════════════════════════════════════
export const SITE_SETTINGS_QUERY = /* groq */`
  *[_type == "siteSettings"][0]{
    siteName, siteNameEn, slogan, currentSeason,
    metaTitle, metaDescription,
    ogImage ${IMAGE},
    canonicalUrl,
    email, phone, kakaoChannelUrl, address,
    instagram, youtube, facebook, naverBlog,
    logoLight ${IMAGE}, logoDark ${IMAGE},
    heroImage ${IMAGE}, heroAbout ${IMAGE}, heroSeason ${IMAGE},
    heroEntry ${IMAGE}, heroResults ${IMAGE}, heroMedia ${IMAGE}, heroCircuit ${IMAGE},
    isEntryOpen, entryNotice, tossPaymentBaseUrl,
    bannerVisible, bannerMessage, bannerLinkText, bannerLinkUrl, bannerBgColor,
    circuitName, circuitLength, circuitLocation, speediumUrl, circuitMapEmbedUrl
  }
`

// ════════════════════════════════════════════════════════════
// round
// ════════════════════════════════════════════════════════════

/** 특정 시즌의 전체 라운드 (목록) */
export const ROUNDS_QUERY = /* groq */`
  *[_type == "round" && season == $season] | order(roundNumber asc){
    _id, season, roundNumber, slug, title, titleEn, subtitle,
    badge, dateStart, dateEnd, status,
    heroImage ${IMAGE},
    entryOpenDate, entryCloseDate, tossPaymentUrl, maxEntries,
    hasResults
  }
`

/** 단건 라운드 (상세 페이지) */
export const ROUND_DETAIL_QUERY = /* groq */`
  *[_type == "round" && slug.current == $slug][0]{
    _id, season, roundNumber, slug, title, titleEn, subtitle,
    badge, dateStart, dateEnd, schedule, status,
    entryOpenDate, entryCloseDate, tossPaymentUrl, entryFeeNote, maxEntries,
    notices, description, hasResults,
    heroImage ${IMAGE}, posterImage ${IMAGE},
    gallery[] ${IMAGE}
  }
`

/** 가장 가까운 예정 라운드 1개 (Hero용) */
export const NEXT_ROUND_QUERY = /* groq */`
  *[_type == "round" && dateStart > $today] | order(dateStart asc)[0]{
    _id, season, roundNumber, slug, title, badge,
    dateStart, dateEnd, status,
    heroImage ${IMAGE}
  }
`

// ════════════════════════════════════════════════════════════
// classInfo
// ════════════════════════════════════════════════════════════

/** 모든 활성 클래스 */
export const CLASSES_QUERY = /* groq */`
  *[_type == "classInfo" && isActive == true] | order(order asc){
    _id, classCode, slug, order,
    name, nameEn, tagline, accentColor,
    teamCount, driverCount, carCount,
    features, isEntryOpen,
    entryFeePerRound, entryFeeSeason, entryFeeNote, isFeePublic,
    cardImage ${IMAGE}, heroImage ${IMAGE}
  }
`

/** 단건 클래스 */
export const CLASS_DETAIL_QUERY = /* groq */`
  *[_type == "classInfo" && slug.current == $slug][0]{
    _id, classCode, slug,
    name, nameEn, tagline, accentColor,
    teamCount, driverCount, carCount,
    eligibility, features,
    entryFeePerRound, entryFeeSeason, entryFeeNote, isFeePublic,
    vehicleRegulations,
    regulationPdf { asset->{ url } },
    heroImage ${IMAGE}, cardImage ${IMAGE},
    gallery[] ${IMAGE},
    isActive, isEntryOpen
  }
`

// ════════════════════════════════════════════════════════════
// result
// ════════════════════════════════════════════════════════════

/** 특정 라운드의 공개된 모든 결과 */
export const RESULTS_BY_ROUND_QUERY = /* groq */`
  *[_type == "result" && round._ref == $roundId && isPublished == true]{
    _id, raceType,
    round->{ roundNumber, title, dateStart },
    classInfo->{ classCode, name, accentColor },
    standings[]{
      position, carNumber, teamName, driver1, driver2,
      carModel, laps, totalTime, gap, fastestLap, points, status
    },
    resultPdf { asset->{ url } },
    highlightVideoUrl, publishedAt
  }
`

/** 클래스별 챔피언십 스탠딩 (최신 라운드 기준) */
export const CHAMPIONSHIP_QUERY = /* groq */`
  *[_type == "result"
    && classInfo->classCode == $classCode
    && isPublished == true
  ] | order(round->roundNumber desc)[0]{
    round->{ season, roundNumber },
    classInfo->{ name, accentColor },
    championshipStandings[]{
      position, carNumber, teamName, driver1, driver2, totalPoints
    }
  }
`

// ════════════════════════════════════════════════════════════
// post
// ════════════════════════════════════════════════════════════

/** 메인용 최신 소식 N개 */
export const RECENT_POSTS_QUERY = /* groq */`
  *[_type == "post"] | order(isPinned desc, publishedAt desc)[0...$limit]{
    _id, title, slug, category, publishedAt, excerpt, isPinned,
    coverImage ${IMAGE}
  }
`

/** 목록 (페이지네이션) */
export const POSTS_QUERY = /* groq */`
  *[_type == "post" && ($category == "" || category == $category)]
  | order(isPinned desc, publishedAt desc)
  [$start...$end]{
    _id, title, slug, category, publishedAt, excerpt, isPinned,
    coverImage ${IMAGE}
  }
`
export const POSTS_COUNT_QUERY = /* groq */`
  count(*[_type == "post" && ($category == "" || category == $category)])
`

/** 단건 소식 */
export const POST_DETAIL_QUERY = /* groq */`
  *[_type == "post" && slug.current == $slug][0]{
    _id, title, slug, category, publishedAt, author, excerpt,
    coverImage ${IMAGE},
    relatedRound->{ roundNumber, title, slug },
    body[]{
      ...,
      _type == "image" => { ..., asset->{ url, metadata { lqip, dimensions } } }
    },
    metaTitle, metaDescription
  }
`

// ════════════════════════════════════════════════════════════
// media
// ════════════════════════════════════════════════════════════

/** 메인 Featured 미디어 */
export const FEATURED_MEDIA_QUERY = /* groq */`
  *[_type == "media" && isFeatured == true && isPublished == true]
  | order(sortOrder asc)[0...$limit]{
    _id, title, slug, mediaType, publishedAt,
    coverImage ${IMAGE},
    youtubeUrl, youtubeThumbnail, duration,
    relatedRound->{ roundNumber, title }
  }
`

/** 사진 앨범 목록 */
export const PHOTO_ALBUMS_QUERY = /* groq */`
  *[_type == "media" && mediaType == "photoAlbum" && isPublished == true]
  | order(publishedAt desc)[$start...$end]{
    _id, title, slug, publishedAt, description, tags,
    coverImage ${IMAGE},
    "photoCount": count(photos),
    relatedRound->{ roundNumber, title }
  }
`

/** 앨범 단건 */
export const PHOTO_ALBUM_DETAIL_QUERY = /* groq */`
  *[_type == "media" && slug.current == $slug && mediaType == "photoAlbum"][0]{
    _id, title, publishedAt, description,
    coverImage ${IMAGE},
    photos[]{ image ${IMAGE}, caption, credit },
    relatedRound->{ roundNumber, title, slug }
  }
`

/** 동영상 목록 */
export const VIDEOS_QUERY = /* groq */`
  *[_type == "media" && mediaType in ["video","uploadedVideo"] && isPublished == true]
  | order(publishedAt desc)[$start...$end]{
    _id, title, slug, mediaType, publishedAt, duration,
    youtubeUrl, youtubeThumbnail,
    coverImage ${IMAGE},
    relatedRound->{ roundNumber, title }
  }
`

// ════════════════════════════════════════════════════════════
// partner
// ════════════════════════════════════════════════════════════

/** 현재 시즌 활성 파트너 전체 */
export const PARTNERS_QUERY = /* groq */`
  *[_type == "partner"
    && isActive == true
    && $currentSeason in contractSeasons
  ] | order(tier asc, sortOrder asc){
    _id, name, nameEn, tier, category, websiteUrl,
    logo ${IMAGE}, logoWhite ${IMAGE},
    description
  }
`

// ════════════════════════════════════════════════════════════
// history
// ════════════════════════════════════════════════════════════

/** 연도별 역사 전체 */
export const HISTORY_QUERY = /* groq */`
  *[_type == "history" && isPublished == true] | order(year desc){
    _id, year, edition, headline, summary, stats,
    champions[]{ classCode, teamName, driver1, driver2, carModel, carNumber },
    heroImage ${IMAGE},
    highlightVideoUrl
  }
`

/** 역사 단건 */
export const HISTORY_DETAIL_QUERY = /* groq */`
  *[_type == "history" && year == $year][0]{
    _id, year, edition, headline, summary, stats,
    champions[]{ classCode, teamName, driver1, driver2, carModel, carNumber,
      photo ${IMAGE}
    },
    milestones,
    heroImage ${IMAGE},
    gallery[] ${IMAGE},
    highlightVideoUrl
  }
`
