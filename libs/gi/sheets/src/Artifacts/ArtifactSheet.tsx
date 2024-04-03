import { ImgIcon, SqBadge } from '@genshin-optimizer/common/ui'
import { artifactDefIcon } from '@genshin-optimizer/gi/assets'
import type {
  ArtifactRarity,
  ArtifactSetKey,
  ArtifactSlotKey,
  SetNum,
} from '@genshin-optimizer/gi/consts'
import { allArtifactSlotKeys } from '@genshin-optimizer/gi/consts'
import type { UIData } from '@genshin-optimizer/gi/ui'
import { Translate } from '@genshin-optimizer/gi/ui'
import type { Data } from '@genshin-optimizer/gi/wr'
import { input } from '@genshin-optimizer/gi/wr'
import type { ReactNode } from 'react'
import { artifactSheets } from '.'
import { st } from '../SheetUtil'
import type { IDocumentHeader } from '../sheet'
import type { IArtifactSheet, SetEffectEntry } from './IArtifactSheet'

export class ArtifactSheet {
  readonly sheet: IArtifactSheet
  readonly key: ArtifactSetKey
  readonly data: Data
  constructor(setKey: ArtifactSetKey, sheet: IArtifactSheet, data: Data) {
    this.sheet = sheet
    this.key = setKey
    this.data = data
  }
  get tr() {
    return ArtifactSheet.tr(this.key)
  }

  get name() {
    return this.tr('setName')
  }
  get setName() {
    return this.tr('setName')
  }

  //This is only for OCR, because we only scan in english right now.
  get nameRaw(): string {
    return this.sheet.name
  }
  get rarity(): readonly ArtifactRarity[] {
    return this.sheet.rarity
  }
  get slots(): ArtifactSlotKey[] {
    switch (this.key) {
      case 'PrayersForDestiny':
      case 'PrayersForIllumination':
      case 'PrayersForWisdom':
      case 'PrayersToSpringtime':
        return ['circlet']
      default:
        return [...allArtifactSlotKeys]
    }
  }
  get setEffects(): Partial<Record<SetNum, SetEffectEntry>> {
    return this.sheet.setEffects
  }
  getSlotName = (slotKey: ArtifactSlotKey) => this.tr(`pieces.${slotKey}.name`)
  getSlotDesc = (slotKey: ArtifactSlotKey) => this.tr(`pieces.${slotKey}.desc`)
  setEffectDesc = (setNum: SetNum): ReactNode => this.tr(`setEffects.${setNum}`)
  setEffectDocument = (setNum: SetNum) =>
    this.sheet.setEffects[setNum]?.document
  static trm(setKey: ArtifactSetKey) {
    return (strKey: string) => (
      <Translate ns={`artifact_${setKey}`} key18={strKey} />
    )
  }
  static tr(setKey: string) {
    return (strKey: string) => (
      <Translate ns={`artifact_${setKey}_gen`} key18={strKey} />
    )
  }
  static get(set: ArtifactSetKey) {
    return artifactSheets[set]
  }

  hasEnough = (setNum: SetNum, data: UIData) =>
    (data.get(input.artSet[this.key]).value ?? 0) >= setNum
}

export const setHeaderTemplate = (
  setKey: ArtifactSetKey
): ((setNum: SetNum) => IDocumentHeader) => {
  const tr = (strKey: string) => (
    <Translate ns={`artifact_${setKey}_gen`} key18={strKey} />
  )
  return (setNum: SetNum) => ({
    title: tr('setName'),
    icon: <ImgIcon size={2} src={artifactDefIcon(setKey)} />,
    action: <SqBadge color="success">{st(`${setNum}set`)}</SqBadge>,
    description: tr(`setEffects.${setNum}`),
  })
}