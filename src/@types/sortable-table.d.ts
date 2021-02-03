declare module '@riversun/sortable-table' {
  export interface ColmnConf {
    id: string
    isHeader: boolean
    sortable: boolean
    sortDir: string
  }

  export class SortableTable {
    constructor()

    setTable(el: HTMLElement): void

    setData(data: any): void

    setCellRenderer(fnCellRender: (col: ColmnConf, row: any) => string): void
  }

  export default SortableTable
}
