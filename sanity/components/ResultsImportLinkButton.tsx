// sanity/components/ResultsImportLinkButton.tsx
// result 문서 편집 화면에서 /admin/results-import 로 이동하는 버튼 컴포넌트
import { useFormValue } from 'sanity'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { ArrowRightIcon } from '@sanity/icons'

export function ResultsImportLinkButton() {
  const roundRef  = useFormValue(['round', '_ref'])  as string | undefined
  const classRef  = useFormValue(['classInfo', '_ref']) as string | undefined
  const raceType  = useFormValue(['raceType'])        as string | undefined

  const params = new URLSearchParams()
  if (roundRef)  params.set('roundRef',  roundRef)
  if (classRef)  params.set('classRef',  classRef)
  if (raceType)  params.set('raceType',  raceType)
  const qs  = params.toString()
  const url = `/admin/results-import${qs ? '?' + qs : ''}`

  const hasRefs = !!(roundRef && classRef && raceType)

  return (
    <Card padding={3} radius={2} border tone={hasRefs ? 'primary' : 'default'}>
      <Stack space={3}>
        <Text size={1} muted>
          {hasRefs
            ? '라운드·클래스·세션이 선택되어 있습니다. 아래 버튼으로 결과 일괄 입력 페이지로 이동합니다.'
            : '라운드, 클래스, 세션 유형을 먼저 저장한 후 이동하면 드롭다운이 자동 선택됩니다.'}
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
