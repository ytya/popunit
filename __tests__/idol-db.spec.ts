import { IdolInfo, UnitInfo, IdolDB, COMPARE_KEY } from '../src/ts/idol-db'

test('UnitInfo.compare', () => {
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
    name: '天ヶ瀬冬馬',
    yomi: 'あまがせ とうま',
    attr: '雪天',
    vo: 100,
    da: 70,
    vi: 70,
  }
  const idol5 = {
    brand: 'SideM',
    name: '天道輝',
    yomi: 'てんどう てる',
    attr: '天星',
    vo: 75,
    da: 95,
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
  expect(unit1.compare(unit1, COMPARE_KEY.NAME1, false)).toBe(0) // ==
  expect(unit1.compare(unit2, COMPARE_KEY.NAME1, false)).toBe(1) // あまみ > あまがせ
  expect(unit1.compare(unit2, COMPARE_KEY.NAME1, true)).toBe(-1) // 765AS < SideM
  expect(unit1.compare(unit2, COMPARE_KEY.NAME2, false)).toBe(-1) // しまむら < てんどう
  expect(unit1.compare(unit2, COMPARE_KEY.NAME3, false)).toBe(-1) // かすが < みなせ
  expect(unit1.compare(unit2, COMPARE_KEY.NAME3, true)).toBe(1) // ミリオンライブ > 765AS
  expect(unit1.compare(unit2, COMPARE_KEY.VO, false)).toBe(1) // 270 > 260
  expect(unit1.compare(unit2, COMPARE_KEY.DA, false)).toBe(-1) // 220 < 235
  expect(unit1.compare(unit2, COMPARE_KEY.VI, false)).toBe(1) // 230 > 225
})

test('IdolDB.selectIdol', () => {
  const db = new IdolDB()

  // 「月」属性アイドルは13人
  {
    const df = db.selectIdol([], '月')
    const num = df.dim()[0]
    expect(num).toBe(13)
  }

  // 「765AS」「SideM」の「花」属性アイドルは6人
  {
    const df = db.selectIdol(['765AS', 'SideM'], '花')
    const num = df.dim()[0]
    expect(num).toBe(6)
  }
})

test('IdolDB.collectUnits', () => {
  const db = new IdolDB()

  // 「月」属性アイドルの人数取得
  const df = db.selectIdol([], '月')
  const n = df.dim()[0]

  {
    // 「月」属性アイドルのみの3人ユニット(nC3)
    const units = db.collectUnits([], '月', '月', '月')
    expect(units.length).toBe((n * (n - 1) * (n - 2)) / (3 * 2))
  }

  {
    // 「月」属性アイドルのみの2人ユニット(nC2)
    const units = db.collectUnits([], '月', '', '月')
    expect(units.length).toBe((n * (n - 1)) / 2)
  }

  {
    // 「月」属性アイドルのみの1人ユニット(nC1)
    const units = db.collectUnits([], '', '月', '')
    expect(units.length).toBe(n)
  }
})

test('IdolDB.collectUnits refineWords', () => {
  const db = new IdolDB()

  // 「月」属性アイドルの人数取得
  const df = db.selectIdol([], '月')
  const n = df.dim()[0]

  {
    // 「星井美希」は確定で「月」属性アイドルのみの3人ユニット(n-1C2)
    const units = db.collectUnits([], '月', '月', '月', ['星井美希'])
    expect(units.length).toBe(((n - 1) * (n - 2)) / 2)
  }

  {
    // 「星井美希」は確定で「月」属性アイドルのみの2人ユニット(n-1C1)
    const units = db.collectUnits([], '月', '', '月', ['星井美希'])
    expect(units.length).toBe(n - 1)
  }

  {
    // 「星井美希」は確定で「月」属性アイドルのみの1人ユニット(1)
    const units = db.collectUnits([], '', '月', '', ['星井美希'])
    expect(units.length).toBe(1)
  }
})
