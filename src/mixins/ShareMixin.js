import { merge, kebabCase } from 'lodash'

export default {
  props: {
    layout: {
      type: String,
      default: 'table, pagination'
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
    actionCol: {
      type: Object,
      default() {
        return {}
      }
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    paginationProps: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  render() {
    let tableDirectives = []

    if (this._server) {
      tableDirectives = [
        { name: 'loading', value: this.loading }
      ]
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
          {...{
            attrs: this.innerTableProps,
            directives: tableDirectives
          }}
          style='width: 100%'
        >
          {
            this.$slots.default
          }
          <div slot='empty'>
            {
              this.$slots.empty
            }
          </div>
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
                    attrs: this.innerActionCol.props,
                    scopedSlots: {
                      default: scope => {
                        return (
                          <div class='action-list'>
                            {
                              this.innerActionCol.buttons.map(button => {
                                let buttonProps = Object.assign({
                                  type: button.type || 'text',
                                  icon: button.icon,
                                }, button.props)

                                let clickHandler = function() {
                                  button.handler(scope.row, scope.$index, scope.column, scope.store)
                                }

                                return (
                                  <span>
                                    <el-button onClick={ clickHandler }
                                      { ...{attrs: buttonProps} }>
                                      { button.label }
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
                    current-page$sync={ this.innerCurrentPage }
                    page-size={ this.innerPageSize }
                    on-size-change={ this.handleSizeChange }
                    total={ this.total }
                    {...{
                      attrs: this.innerPaginationProps
                    }}
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
          this.layouts.map(layout => layoutMap[layout])
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
      innerCurrentPage: 1,
      innerPageSize: 20,
      sortData: {},
      actionColProp: 'e6e4c9de-7cf5-4f19-bb73-838e5182a372',
      innerPaginationProps: {}
    }
  },
  computed: {
    layouts() {
      return this.layout.split(',').map(item => item.trim())
    },
    innerColNotRowClick() {
      return this.colNotRowClick.concat([this.actionColProp])
    },
    innerTableProps() {
      let loadingProps = ['elementLoadingText', 'elementLoadingSpinner', 'elementLoadingBackground']
      let tableProps = Object.assign({
        fit: true
      }, this.tableProps)

      loadingProps.forEach(prop => {
        if (tableProps[prop]) {
          tableProps[kebabCase(prop)] = tableProps[prop]
          delete tableProps[prop]
        }
      })
      return tableProps
    },
    innerActionCol() {
      let { label, ...actionCol } = this.actionCol

      return merge({
        show: true,
        buttons: [],
        props: {
          label: label || '操作',
        }
      }, actionCol)
    },
    paginationShow() {
      return this.layouts.includes('pagination')
    },
    actionColShow() {
      return this.innerActionCol.buttons.length > 0
    },
  },
  watch: {
    // make innerCurrentPage and innerPageSize as data,
    // and watch currentPage to update innerCurrentPage, pageSize to update innerPageSize
    // at the same time watch innerCurrentPage and innerPageSize to emit sync emit.
    // the two watch cannot be replaced by computed getter and setter here,
    // because currentPage and pageSize can be not provided(undefinded).
    currentPage: {
      immediate: true,
      handler(val) {
        this.innerCurrentPage = val
      }
    },
    innerCurrentPage(val) {
      this.$emit('update:currentPage', val)
    },
    pageSize: {
      immediate: true,
      handler(val) {
        this.innerPageSize = val
      }
    },
    innerPageSize(val) {
      this.$emit('update:pageSize', val)
    },
    paginationProps: {
      immediate: true,
      handler(val) {
        if (this.paginationShow) {
          this.innerPaginationProps = Object.assign({
            pageSizes: [20, 50, 100],
            layout: 'prev, pager, next, jumper, sizes, total',
          }, val)

          if (this.innerPaginationProps.pageSizes.indexOf(this.innerPageSize) === -1) {
            console.warn(`pageSize ${this.innerPageSize} is not included in pageSizes[${this.innerPaginationProps.pageSizes}], set pageSize to pageSizes[0]: 20`)
            this.innerPageSize = this.innerPaginationProps.pageSizes[0]
          }
        } else {
          this.innerPageSize = this.data.length
        }
      }
    },
  },
}
