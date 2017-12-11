import CheckboxGroup from '../components/ScCheckboxGroup'
import { merge } from 'lodash'
import ErrorTips from '../tools/ErrorTips.js'

export default {
  components: {
    CheckboxGroup
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showActionBar: {
      type: Boolean,
      default: true
    },
    customFilters: {
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
    actionsDef: {
      type: Object,
      default() {
        return {}
      }
    },
    checkboxFilterDef: {
      type: Object,
      default() {
        return {}
      }
    },
    searchDef: {
      type: Object,
      default() {
        return {}
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

    return (
      <div class='sc-table'>
        {
          this.showActionBar
          ? (
            <el-row class='tool-bar'>
              <el-col class='actions' { ...{props: this.innerActionsDef.colProps} }>
                {
                  this.innerActionsDef.def.map(action => {
                    let buttonAttrs = Object.assign({
                      type: action.type || 'primary',
                      icon: action.icon
                    }, action.buttonProps)

                    return (
                      <el-button
                        { ...{attrs: buttonAttrs} }
                        onClick={ action.handler } > { action.name }
                      </el-button>
                    )
                  })
                }
              </el-col>
              {
                this.checkboxShow
                  ? (
                    <el-col class='filters' {...{ props: this.innerCheckboxFilterDef.colProps }}>
                      <checkbox-group
                        checks={ this.innerCheckboxFilterDef.def }
                        onCheckChange={ this.handleCheckBoxValChange }>
                      </checkbox-group>
                    </el-col>
                  )
                  : null
              }
              {
                this.searchShow
                  ? (
                    <el-col class='search' { ...{props: this.innerSearchDef.colProps} }>
                      <el-input
                        v-model={ this.searchKey }
                        { ...{attrs: this.innerSearchDef.inputProps} }>
                      </el-input>
                    </el-col>
                  )
                  : null
              }
            </el-row>
          ) : null
        }

        <div class='custom-tool-bar'>
          {
            this.$slots['custom-tool-bar']
          }
        </div>

        <el-table ref='elTable'
          on-sort-change={ this.handleSort }
          data={ this.curTableData }
          { ...{attrs: tableAttrs} }
          { ...{directives: tableDirectives} }
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
                  { ...{attrs: this.innerActionColDef.tableColProps} }
                  { ...{
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

        {
          this.paginationShow
            ? (
              <div class='pagination-wrap'>
                <el-pagination
                  current-page={ this.currentPage }
                  page-sizes={ this.innerPaginationDef.pageSizes }
                  page-size={ this.innerPaginationDef.pageSize }
                  layout={ this.innerPaginationDef.layout }
                  total={ this.total }
                  on-size-change={ this.handleSizeChange }
                  on-current-change={ this.handlePageChange }
                  >
                </el-pagination>
              </div>
            )
            : null
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
      searchKey: '',
      innerSearchKey: '',
      checkBoxValues: [],
      sortData: {},
      actionColProp: 'e6e4c9de-7cf5-4f19-bb73-838e5182a372'
    }
  },
  computed: {
    filters() {
      let filters = this.formatToArray(this.innerCustomFilters)

      if (this.showActionBar) {
        if (this.searchShow) {
          filters.push({
            type: this._server ? 'search' : undefined,
            props: this.formatProps(this.innerSearchDef.props),
            vals: this.formatToArray(this.innerSearchKey),
            filterFunction: this._server ? undefined : this.innerSearchDef.filterFunction
          })
        }
        if (this.checkboxShow) {
          filters.push({
            type: this._server ? 'checkbox' : undefined,
            props: this.formatProps(this.innerCheckboxFilterDef.props),
            vals: this.checkBoxValues,
            filterFunction: this._server ? undefined : this.innerCheckboxFilterDef.filterFunction
          })
        }
      }

      return filters
    },
    innerActionsDef() {
      return merge({
        colProps: {
          span: 5
        },
        def: []
      }, this.actionsDef)
    },
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
    innerActionColDef() {
      let { label, fixed, type, width, minWidth, ...actionColDef } = this.actionColDef

      return merge({
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
    actionColShow() {
      return this.innerActionColDef.def.length > 0
    },
    innerCheckboxFilterDef() {
      let _allDataProps = this._allDataProps
      return merge({
        props: undefined,
        def: [],
        colProps: {
          span: 14
        },
        filterFunction: this._server
          ? undefined
          : (el, filter) => {
            let props = filter.props || _allDataProps
            return props.some(prop => {
              let elVal = el[prop]
              /* istanbul ignore if */
              if (elVal === undefined) {
                console.error(ErrorTips.propError(prop))
              } else if (elVal === null) {
                return false
              }

              return filter.vals.some(val => {
                return elVal.toString() === val
              })
            })
          }
      }, this.checkboxFilterDef)
    },
    innerSearchDef() {
      return merge({
        show: true,
        props: undefined,
        filterFunction: undefined,
        debounceTime: 200,
        colProps: {
          span: 5
        },
        inputProps: {
          prefixIcon: 'el-icon-search',
        }
      }, this.searchDef)
    },
    innerColNotRowClick() {
      return this.colNotRowClick.concat([this.actionColProp])
    },
    innerCustomFilters() {
      let customFilterArray = this.formatToArray(this.customFilters)
      let customFilters = []
      customFilterArray.forEach(filter => {
        let filterCopy = Object.assign({}, filter, {
          props: this.formatProps(filter.props),
          vals: this.formatToArray(filter.vals)
        })
        customFilters.push(filterCopy)
      })
      return customFilters
    },
    innerTableProps() {
      return Object.assign({
        border: true,
        stripe: true,
        fit: true
      }, this.tableProps)
    },
    checkboxShow() {
      return this.innerCheckboxFilterDef.def.length > 0
    },
    searchShow() {
      return this.innerSearchDef.show !== false
    },
    actionsShow() {
      return this.innerActionsDef.def.length > 0
    },
    paginationShow() {
      return this.paginationDef.show !== false
    }
  },
  methods: {
    formatProps(props) {
      return props ? [].concat(props) : undefined
    },
    formatToArray(filters) {
      return filters ? [].concat(filters) : []
    },
  },
  watch: {
    innerPaginationDef: {
      immediate: true,
      handler(val) {
        this.innerPageSize = val.pageSize
        this.currentPage = val.currentPage
      }
    },
    searchKey() {
      this.updateInnerSearchKey()
    }
  }
}
