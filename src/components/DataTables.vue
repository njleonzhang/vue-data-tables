<style lang='scss'>
@import "../style/index.scss";
</style>

<!--
<template lang="pug">
  include ../template/index.pug
  +template()
</template>
-->

<script>
  import ErrorTips from './ErrorTips.js'
  import ShareMixin from '../mixins/ShareMixin'
  import debounce from 'javascript-debounce'
  import { merge } from 'lodash'

  export default {
    name: 'DataTables',
    mixins: [ShareMixin],
    props: {
      sortMethod: {
        type: Function,
        default: (a, b) => a > b ? 1 : a < b ? -1 : 0
      }
    },
    data() {
      return {
        sortData: {}
      }
    },
    render() {
      // let tableListener = Object.assign({}, this.$listeners, {
      //   'sort-change': this.handleSort,
      //   'row-click': this.handleRowClick,
      //   'cell-click': this.handleCellClick
      // })

      return (
        <div class='sc-table'>
          {
            this.showActionBar
            ? (
              <el-row class='tool-bar'>
                <el-col class='actions' { ...{props: this.innerActionsDef.colProps} }>
                  {
                    this.innerActionsDef.def.map(action => {
                      let buttonAttrs = Object.assign({}, {
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
            { ...{attrs: this.innerTableProps} }
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
                    { ...{attrs: this.innerActionColDef} }
                    { ...{
                      scopedSlots: {
                        default: scope => {
                          return (
                            <div class='action-list'>
                              {
                                this.innerActionColDef.def.map(actionInCol => {
                                  let buttonProps = Object.assign({}, {
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
    computed: {
      innerCheckboxFilterDef() {
        let _allDataProps = this._allDataProps
        return merge({
          props: undefined,
          def: [],
          colProps: {
            span: 14
          },
          filterFunction: (el, filter) => {
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
      sortedData() {
        if (this.sortData.order) {
          let sortedData = this.data.slice()

          let order = this.sortData.order
          let prop = this.sortData.prop
          let isDescending = order === 'descending'
          let _sortMethod = (a, b) => this.sortMethod(a[prop], b[prop]) * (isDescending ? -1 : 1)
          sortedData.sort(_sortMethod)

          return sortedData
        }

        return this.data
      },
      tableData() {
        let filteredData = this.sortedData.slice()
        let _allDataProps = this._allDataProps

        let doFilter = function(defaultFilterFunction, filter) {
          let filterFunction = filter.filterFunction || defaultFilterFunction

          filteredData = filteredData.filter(el => {
            return filterFunction(el, filter)
          })
        }

        this.filters.forEach(filter => {
          let vals = filter.vals
          if (!vals || vals.length === 0) {
            return true
          }

          let defaultFilterFunction = function(el, filter) {
            let props = filter.props || _allDataProps
            return props.some(prop => {
              let elVal = el[prop]
              /* istanbul ignore if */
              if (elVal === undefined) {
                console.error(ErrorTips.propError(prop))
                return false
              } else if (elVal === null) {
                return false
              }

              return filter.vals.some(val => {
                return elVal.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
              })
            })
          }

          doFilter(defaultFilterFunction, filter)
        })

        this.$emit('filtered-data', filteredData)
        return filteredData
      },
      curTableData() {
        let from = this.innerPageSize * (this.currentPage - 1)
        let to = from + this.innerPageSize
        return this.tableData.slice(from, to)
      },
      total() {
        return this.tableData.length
      },
      filters() {
        let filters = this.formatToArray(this.innerCustomFilters)
        if (this.showActionBar) {
          if (this.searchShow) {
            filters.push({
              props: this.formatProps(this.innerSearchDef.props),
              vals: this.formatToArray(this.innerSearchKey),
              filterFunction: this.innerSearchDef.filterFunction
            })
          }
          if (this.checkboxShow) {
            filters.push({
              props: this.formatProps(this.innerCheckboxFilterDef.props),
              vals: this.checkBoxValues,
              filterFunction: this.innerCheckboxFilterDef.filterFunction
            })
          }
        }
        return filters
      },
      updateInnerSearchKey() {
        const timeout = this.innerSearchDef.debounceTime
        return debounce(_ => {
          this.innerSearchKey = this.searchKey
        }, timeout)
      }
    },
    methods: {
      handleSizeChange(size) {
        this.innerPageSize = size
        this.$emit('size-change', size)
      },
      handlePageChange(currentPage) {
        this.currentPage = currentPage
        this.$emit('current-change', currentPage)
      },
      handleCheckBoxValChange(checkBoxValues) {
        this.checkBoxValues = checkBoxValues
      },
      handleSort(obj) {
        this.sortData = obj
      }
    },
    watch: {
      data: {
        immediate: true,
        handler(val) {
          this._allDataProps = Object.keys(val && val[0] || {})
        }
      }
    }
  }
</script>
