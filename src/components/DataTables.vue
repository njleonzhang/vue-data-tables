<style lang='scss'>
@import "../style/index.scss";
</style>

<template lang="pug">
  include ../template/index.pug
  +template()
</template>

<script>
  import ErrorTips from './ErrorTips.js'
  import ShareMixin from '../mixins/ShareMixin'
  import debounce from 'javascript-debounce'

  export default {
    name: 'DataTables',
    mixins: [ShareMixin],
    data() {
      return {
        sortData: {}
      }
    },
    computed: {
      innerCheckboxFilterDef() {
        let _allDataProps = this._allDataProps
        return Object.assign({
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
        return Object.assign({
          show: true,
          props: undefined,
          filterFunction: undefined,
          debounceTime: 200
        }, this.searchDef)
      },
      sortedData() {
        let sortedData = this.data.slice()

        if (this.sortData.order) {
          let order = this.sortData.order
          let prop = this.sortData.prop
          let isDescending = order === 'descending'

          // todo: customize sort function
          sortedData.sort(function(a, b) {
            if (a[prop] > b[prop]) {
              return 1
            } else if (a[prop] < b[prop]) {
              return -1
            } else {
              return 0
            }
          })
          if (isDescending) {
            sortedData.reverse()
          }
        }

        return sortedData
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
