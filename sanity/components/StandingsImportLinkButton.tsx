// sanity/components/StandingsImportLinkButton.tsx
// teamStanding / driverStanding 문서 편집 화면에서 /admin/standings-import 로 이동하는 버튼
import { useFormValue } from 'sanity'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { ArrowRightIcon } from '@sanity/icons'

export function StandingsImportLinkButton() {
  const classRef = useFormValue(['classInfo', '_ref']) as string | undefined
  const season   = useFormValue(['season'])            as number | undefined

  const params = new URLSearchParams()
  if (classRef) params.set('classRef', classRef)
  if (season)   params.set('season',   String(season))
  const qs  = params.toString()
  const url = `/admin/standings-import${qs ? '?' + qs : ''}`

  const hasRefs = !!(classRef && season)

  return (
    <Card padding={3} radius={2} border tone={hasRefs ? 'primary' : 'default'}>
      <Stack space={3}>
        <Text size={1} muted>
          {hasRefs
            ? '클래스·시즌이 선택되어 있습니다. 아래 버튼으로 스탠딩 일괄 입력 페이지로 이동합니다.'
            : '클래스와 시즌을 먼저 저장한 후 이동하면 드롭다운이 자동 선택됩니다.'}
        </Text>
        <Button
          as="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          text="엑셀로 일괄 입력 →"
          tone="primary"
          mode={hasRefs ? 'default' : 'ghost'}
          icon={ArrowRightIcon}
          iconRight
        />
      </Stack>
    </Card>
  )
}
