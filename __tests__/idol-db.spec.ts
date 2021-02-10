import { IdolInfo, UnitInfo, IdolDB, COMPARE_KEY } from '../src/ts/idol-db'

test('compareName', () => {
  const idol1 = {
    name: '天海 春香',
    yomi: 'あまみ はるか',
    brand: '765AS',
    attr: '花海',
    vo: 90,
    da: 70,
    vi: 80,
  }
  const idol2 = {
    brand: 'シンデレラガールズ',
    name: '島村卯月',
    yomi: 'しまむら うづき',
    attr: '月夢',
    vo: 100,
    da: 70,
    vi: 70,
  }
  const idol3 = {
    brand: 'ミリオンライブ',
    name: '春日未来',
    yomi: 'かすが みらい',
    attr: '花夢',
    vo: 80,
    da: 80,
    vi: 80,
  }
  const idol4 = {
    brand: 'SideM',
    name: '天道輝',
    yomi: 'てんどう てる',
    attr: '天星',
    vo: 75,
    da: 95,
    vi: 70,
  }
  const idol5 = {
    brand: 'SideM',
    name: '天ヶ瀬冬馬',
    yomi: 'あまがせ とうま',
    attr: '雪天',
    vo: 100,
    da: 70,
    vi: 70,
  }
  const idol6 = {
    brand: '765AS',
    name: '水瀬伊織',
    yomi: 'みなせ いおり',
    attr: '雷海',
    vo: 85,
    da: 70,
    vi: 85,
  }
  const unit1 = new UnitInfo(idol1, idol2, idol3)
  const unit2 = new UnitInfo(idol4, idol5, idol6)
  expect(unit1.compare(unit2, COMPARE_KEY.NAME1, false)).toBe(-1)
})
