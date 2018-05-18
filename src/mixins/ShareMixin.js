export default {
  props: {
    layout: {
      type: String,
      default: 'tool, table, pagination'
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    filters: {
      type: [Object, Array],
      default() {
        return []
      }
    },
    tableProps: {
      type: Object,
      default() {
        return {}
      }
    },
    colNotRowClick: {
      type: Array,
      default() {
        return []
      }
    },
    actionColDef: {
      type: Object,
      default() {
        return {}
      }
    },
    paginationDef: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  render() {
    let tableDirectives = []
    let tableAttrs = this.innerTableProps

    if (this._server) {
      tableDirectives = [
        { name: 'loading', value: this.innerLoading }
      ]

      tableAttrs = {
        'element-loading-text': this.loadingStr,
        ...this.innerTableProps
      }
    }

    let layoutMap = {
      tool: (
        <div class='tool-bar'>
          {
            this.$slots['tool-bar']
          }
        </div>
      ),
      table: (
        <el-table ref='elTable'
          on-sort-change={ this.handleSort }
          data={ this.curTableData }
          {
            ...{
              attrs: tableAttrs,
              directives: tableDirectives
            }
          }
          style='width: 100%'
          >
          {
            this.$slots.default
          }
          <div slot='append'>
            {
              this.$slots.append
            }
          </div>

          {
            this.actionColShow
              ? (
                <el-table-column
                  prop={ this.actionColProp }
                  { ...{
                    attrs: this.innerActionColDef.tableColProps,
                    scopedSlots: {
                      default: scope => {
                        return (
                          <div class='action-list'>
                            {
                              this.innerActionColDef.def.map(actionInCol => {
                                let buttonProps = Object.assign({
                                  type: actionInCol.type || 'text',
                                  icon: actionInCol.icon
                                }, actionInCol.buttonProps)

                                let clickHandler = function() {
                                  actionInCol.handler(scope.row, scope.$index, scope.column, scope.store)
                                }

                                return (
                                  <span>
                                    <el-button onClick={ clickHandler }
                                      { ...{attrs: buttonProps} }>
                                      { actionInCol.name }
                                    </el-button>
                                  </span>
                                )
                              })
                            }
                          </div>
                        )
                      }
                    }
                  } }>
                </el-table-column>
              )
              : null
          }
        </el-table>
      ),
      pagination: (
        <div class='pagination-bar'>
          {
            this.paginationShow
            ? (
              <div class='pagination-wrap'>
                <el-pagination
                  current-page$sync={ this.currentPage }
                  page-sizes={ this.innerPaginationDef.pageSizes }
                  page-size={ this.innerPaginationDef.pageSize }
                  layout={ this.innerPaginationDef.layout }
                  total={ this.total }
                  on-size-change={ this.handleSizeChange }
                  >
                </el-pagination>
              </div>
            )
            : null
          }
        </div>
      )
    }

    return (
      <div class='sc-table'>
        {
          this.layout.split(',').map(item => layoutMap[item.trim()])
        }
      </div>
    )
  },
  mounted() {
    let elTableVm = this.$refs['elTable']
    const oldEmit = elTableVm.$emit
    elTableVm.$emit = (...args) => {
      let command = args[0]
      if (command === 'row-click' || command === 'cell-click') {
        let column = command === 'row-click' ? args[3] : args[2]
        if (column && this.innerColNotRowClick.indexOf(column.property) === -1) {
          this.$emit.apply(this, args)
        }
      } else {
        this.$emit.apply(this, args)
      }
      oldEmit.apply(elTableVm, args)
    }
  },
  data() {
    return {
      currentPage: 1,
      innerPageSize: 20,
      sortData: {},
      actionColProp: 'e6e4c9de-7cf5-4f19-bb73-838e5182a372'
    }
  },
  computed: {
    innerPaginationDef() {
      let paginationDef = Object.assign({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 20,
        pageSizes: [20, 50, 100],
        currentPage: 1
      }, this.paginationDef)

      if (paginationDef.show === false) {
        paginationDef.pageSize = this.data.length
      } else {
        if (paginationDef.pageSizes.indexOf(paginationDef.pageSize) === -1) {
          console.warn(`pageSize ${paginationDef.pageSize} is not in pageSizes[${paginationDef.pageSizes}], use the first one(${paginationDef.pageSizes[0]}) in pageSizes`)
          paginationDef.pageSize = paginationDef.pageSizes[0]
        }
      }

      return paginationDef
    },
    innerColNotRowClick() {
      return this.colNotRowClick.concat([this.actionColProp])
    },
    innerTableProps() {
      return Object.assign({
        fit: true
      }, this.tableProps)
    },
    innerActionColDef() {
      let { label, fixed, type, width, minWidth, ...actionColDef } = this.actionColDef

      return Object.assign({
        show: true,
        def: [],
        tableColProps: {
          label: label || '操作',
          fixed: fixed || false,
          type,
          width,
          minWidth
        }
      }, actionColDef)
    },
    paginationShow() {
      return this.paginationDef.show !== false
    },
    actionColShow() {
      return this.innerActionColDef.def.length > 0
    },
  },
  watch: {
    innerPaginationDef: {
      immediate: true,
      handler(val) {
        this.innerPageSize = val.pageSize
        this.currentPage = val.currentPage
      }
    }
  }
}
