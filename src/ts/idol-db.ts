import { DataFrame, Row } from 'dataframe-js'
import idolData from './idol-data.json'

// idol-data.json
// [{"brand": "765AS", "name": "天海春香", "yomi": "あまみ はるか", "attr": "花海", "vo": 90, "da": 70, "vi": 80}]

export interface IdolInfo {
  name: string // 名前
  yomi: string // 読み仮名
  brand: string // ブランド
  attr: string // 属性(ex.花光)
  vo: number // Vocal
  da: number // Dance
  vi: number // Visual
}

export const COMPARE_KEY = {
  NAME1: 'name1',
  NAME2: 'name2',
  NAME3: 'name3',
  VO: 'vo',
  DA: 'da',
  VI: 'vi',
}
export type COMPARE_KEY = typeof COMPARE_KEY[keyof typeof COMPARE_KEY]

// ブランドでソートする際の順番
const BRAND_ORDER: { [key: string]: number } = {
  '765AS': 0,
  シンデレラガールズ: 1,
  ミリオンライブ: 2,
  SideM: 3,
  シャイニーカラーズ: 4,
}

/**
 * ユニット
 *
 * @export
 * @class UnitInfo
 */
export class UnitInfo {
  private _vo: number
  private _da: number
  private _vi: number
  private _idString: string // 同一ユニットを判定するためのID

  constructor(private _idol1: IdolInfo, private _idol2: IdolInfo, private _idol3: IdolInfo) {
    this._vo = _idol1.vo + _idol2.vo + _idol3.vo
    this._da = _idol1.da + _idol2.da + _idol3.da
    this._vi = _idol1.vi + _idol2.vi + _idol3.vi
    const names = [_idol1.name, _idol2.name, _idol3.name]
    this._idString = names.sort().join('')
  }

  get idol1(): IdolInfo {
    return this._idol1
  }

  get idol2(): IdolInfo {
    return this._idol2
  }

  get idol3(): IdolInfo {
    return this._idol3
  }

  get vo(): number {
    return this._vo
  }

  get da(): number {
    return this._da
  }

  get vi(): number {
    return this._vi
  }

  get idString(): string {
    return this._idString
  }

  private _compareBrand(idol1: IdolInfo, idol2: IdolInfo): number {
    const o1 = BRAND_ORDER[idol1.brand]
    const o2 = BRAND_ORDER[idol2.brand]
    if (o1 < o2) {
      return -1
    } else if (o1 > o2) {
      return 1
    } else {
      return 0
    }
  }

  private _compareIdolBrand(other: UnitInfo, key: COMPARE_KEY): number {
    // N番目のアイドルのブランドを比較
    if (key == COMPARE_KEY.NAME2) {
      return this._compareBrand(this.idol2, other.idol2)
    } else if (key == COMPARE_KEY.NAME3) {
      return this._compareBrand(this.idol3, other.idol3)
    } else {
      return this._compareBrand(this.idol1, other.idol1)
    }
  }

  private _compareName(idol1: IdolInfo, idol2: IdolInfo): number {
    // 読み仮名で比較
    if (idol1.yomi < idol2.yomi) {
      return -1
    } else if (idol1.yomi > idol2.yomi) {
      return 1
    } else {
      return 0
    }
  }

  private _compareIdolName(other: UnitInfo, key: COMPARE_KEY, isBrandCompare = false): number {
    // まずはブランドで比較
    if (isBrandCompare) {
      const c = this._compareIdolBrand(other, key)
      if (c != 0) {
        return c
      }
    }

    // N番目のアイドル名で比較
    if (key == COMPARE_KEY.NAME2) {
      return this._compareName(this.idol2, other.idol2)
    } else if (key == COMPARE_KEY.NAME3) {
      return this._compareName(this.idol3, other.idol3)
    } else {
      return this._compareName(this.idol1, other.idol1)
    }
  }

  /**
   * ユニットに所属するアイドル名で比較
   *
   * @private
   * @param {UnitInfo} other - 比較対象
   * @param {COMPARE_KEY} key - 比較するkey(NAME1, NAME2, NAME3以外を指定した場合はNAME1で比較)
   * @param {boolean} [isBrandCompare=false] - ブランド比較をするか
   * @returns {number}
   * @memberof UnitInfo
   */
  private _compareAllIdolName(other: UnitInfo, key: COMPARE_KEY, isBrandCompare = false): number {
    if (key == COMPARE_KEY.NAME2) {
      // まずは指定されたkeyで比較
      const c1 = this._compareIdolName(other, COMPARE_KEY.NAME2, isBrandCompare)
      if (c1 != 0) {
        return c1
      }
      // 指定keyで同等だった場合はNAME1, NAME2, NAME3の順番に比較
      const c2 = this._compareIdolName(other, COMPARE_KEY.NAME1, isBrandCompare)
      if (c2 != 0) {
        return c2
      }
      return this._compareIdolName(other, COMPARE_KEY.NAME3, isBrandCompare)
    } else if (key == COMPARE_KEY.NAME3) {
      const c1 = this._compareIdolName(other, COMPARE_KEY.NAME3, isBrandCompare)
      if (c1 != 0) {
        return c1
      }
      const c2 = this._compareIdolName(other, COMPARE_KEY.NAME1, isBrandCompare)
      if (c2 != 0) {
        return c2
      }
      return this._compareIdolName(other, COMPARE_KEY.NAME2, isBrandCompare)
    } else {
      const c1 = this._compareIdolName(other, COMPARE_KEY.NAME1, isBrandCompare)
      if (c1 != 0) {
        return c1
      }
      const c2 = this._compareIdolName(other, COMPARE_KEY.NAME2, isBrandCompare)
      if (c2 != 0) {
        return c2
      }
      return this._compareIdolName(other, COMPARE_KEY.NAME3, isBrandCompare)
    }
  }

  /**
   * ユニット間の順番比較
   *
   * @param {UnitInfo} other - 比較対象
   * @param {COMPARE_KEY} key - 比較するkey
   * @param {boolean} [isBrandCompare=false] - ブランド順にするか
   * @returns {number} - -1:this < other  0: this == other  1: this > other
   * @memberof UnitInfo
   */
  public compare(other: UnitInfo, key: COMPARE_KEY, isBrandCompare = false): number {
    switch (key) {
      case COMPARE_KEY.NAME1:
      case COMPARE_KEY.NAME2:
      case COMPARE_KEY.NAME3:
        // 名前で比較
        return this._compareAllIdolName(other, key, isBrandCompare)
      case COMPARE_KEY.VO:
        // ステータスで比較して同等だったら名前で比較
        if (this.vo < other.vo) {
          return -1
        } else if (this.vo > other.vo) {
          return 1
        } else {
          return this._compareAllIdolName(other, COMPARE_KEY.NAME1, isBrandCompare)
        }
      case COMPARE_KEY.DA:
        if (this.da < other.da) {
          return -1
        } else if (this.da > other.da) {
          return 1
        } else {
          return this._compareAllIdolName(other, COMPARE_KEY.NAME1, isBrandCompare)
        }
      default:
        if (this.vi < other.vi) {
          return -1
        } else if (this.vi > other.vi) {
          return 1
        } else {
          return this._compareAllIdolName(other, COMPARE_KEY.NAME1, isBrandCompare)
        }
    }
  }
}

/**
 * アイドルデータの管理クラス
 *
 * @export
 * @class IdolDB
 */
export class IdolDB {
  private static readonly _dfIdol = new DataFrame(idolData, null) // 大元のアイドルデータ
  private _collectedUnits: UnitInfo[] = [] // ユニット一覧

  /**
   * アイドル選択
   * ヒットしなかった場合は空行を1行作成する
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr - 選択する属性
   * @returns {DataFrame}
   * @memberof IdolDB
   */
  public selectIdol(brands: string[], attr: string): DataFrame {
    // 属性が指定されなかった場合は空行
    if (attr.length == 0) {
      return new DataFrame([['', '', '', '', 0, 0, 0]], IdolDB._dfIdol.listColumns())
    }

    // 検索
    let df = IdolDB._dfIdol.filter((row: Row) => {
      if (brands.length != 0 && !brands.includes(row.get('brand') as string)) {
        return false
      }
      return (row.get('attr') as string).includes(attr)
    })
    if (df.dim()[0] == 0) {
      df = df.push(['', '', '', '', 0, 0, 0])
    }
    return df
  }

  /**
   * ユニットの全組み合わせを取得
   *
   * @param {string[]} brands - 選択するブランド名のリスト（空の場合は全ブランド）
   * @param {string} attr1 - 一人目の属性
   * @param {string} attr2 - 二人目の属性
   * @param {string} attr3 - 三人目の属性
   * @returns {UnitInfo[]}
   * @memberof IdolDB
   */
  public collectUnits(brands: string[], attr1: string, attr2: string, attr3: string): UnitInfo[] {
    const df1 = this.selectIdol(brands, attr1)
    const df2 = this.selectIdol(brands, attr2)
    const df3 = this.selectIdol(brands, attr3)
    const height1 = df1.dim()[0]
    const height2 = df2.dim()[0]
    const height3 = df3.dim()[0]

    // 全組み合わせを取得
    const unitData = new Map<string, UnitInfo>()
    for (let i = 0; i < height1; i++) {
      const idol1 = df1.getRow(i).toDict() as IdolInfo
      for (let j = 0; j < height2; j++) {
        const idol2 = df2.getRow(j).toDict() as IdolInfo
        if (idol2.name != '' && idol1.name == idol2.name) {
          continue
        }
        for (let k = 0; k < height3; k++) {
          const idol3 = df3.getRow(k).toDict() as IdolInfo
          if (idol3.name != '' && (idol1.name == idol3.name || idol2.name == idol3.name)) {
            continue
          }
          if (idol1.name == '' && idol2.name == '' && idol3.name == '') {
            continue
          }

          // 重複は除去してユニット追加
          const unit = new UnitInfo(idol1, idol2, idol3)
          const existUnit = unitData.get(unit.idString)
          if (existUnit === undefined) {
            unitData.set(unit.idString, unit)
          } else if (existUnit.compare(unit, COMPARE_KEY.NAME1, false) > 0) {
            // 名前昇順ユニットを優先
            unitData.set(unit.idString, unit)
          }
        }
      }
    }
    this._collectedUnits = Array.from(unitData.values())
    return this._collectedUnits
  }

  /**
   * 取得済みのユニットをソート
   *
   * @param {COMPARE_KEY} sortKey
   * @param {boolean} isBrandSort - ブランドソートをするか
   * @param {boolean} isReverse - true:昇順 false:降順
   * @returns {UnitInfo[]}
   * @memberof IdolDB
   */
  public sortUnits(sortKey: COMPARE_KEY, isBrandSort: boolean, isReverse: boolean): UnitInfo[] {
    // 比較関数決定
    const compareFn = (a: UnitInfo, b: UnitInfo): number => {
      return a.compare(b, sortKey, isBrandSort)
    }

    // ソート
    const sortedUnits = this._collectedUnits.slice().sort(compareFn)
    if (isReverse) {
      return sortedUnits.reverse()
    }
    return sortedUnits
  }

  /**
   * ユニット数取得
   *
   * @returns {number}
   * @memberof IdolDB
   */
  public getUnitNum(): number {
    return this._collectedUnits.length
  }
}
