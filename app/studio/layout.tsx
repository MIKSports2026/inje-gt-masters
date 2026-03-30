// app/studio/layout.tsx — Sanity Studio 전용 레이아웃
// root layout 의 부수효과(배너, sanityFetch 등)에서 격리
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
