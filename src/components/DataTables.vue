<style lang='scss'>
@import "../style/index.scss";
</style>

<script>
  import ErrorTips from '../tools/ErrorTips.js'
  import ShareMixin from '../mixins/ShareMixin'
  import debounce from 'javascript-debounce'

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
    computed: {
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
