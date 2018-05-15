<style lang='scss'>
@import "../style/index.scss";
</style>

<script>
  import { propError } from '../tools'
  import ShareMixin from '../mixins/ShareMixin'

  export default {
    name: 'DataTables',
    mixins: [ShareMixin],
    props: {
      sortMethod: {
        type: Function,
        default: (a, b) => a > b ? 1 : a < b ? -1 : 0
      },
      allFilterProps: Array
    },
    created() {
      this._allFilterProps = this.allFilterProps || Object.keys(this.data && this.data[0] || {})
      this._filterFnCache = Object.create(null)
    },
    computed: {
      innerFilters() {
        return this.filters.map(filter => {
          return Object.assign({}, filter, {
            props: this.formatProps(filter.prop),
            vals: this.formatToArray(filter.value)
          })
        })
      },
      sortedData() {
        if (this.sortData.order) {
          let sortedData = this.data.slice()

          let { order, prop } = this.sortData
          let isDescending = order === 'descending'
          let _sortMethod = (a, b) => this.sortMethod(a[prop], b[prop]) * (isDescending ? -1 : 1)
          sortedData.sort(_sortMethod)

          return sortedData
        }

        return this.data
      },
      tableData() {
        let filteredData = this.sortedData.slice()

        this.innerFilters.forEach(filter => {
          let vals = filter.vals
          if (!vals || vals.length === 0) {
            return true
          }

          let filterFunction = filter.filterFunction ||
            this.createFilterFn(filter.props, this._allFilterProps)

          filteredData = filteredData.filter(el => {
            return filterFunction(el, filter)
          })
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
    },
    methods: {
      handleSizeChange(size) {
        this.innerPageSize = size
        this.$emit('size-change', size)
      },
      handleSort(obj) {
        this.sortData = obj
      },
      // cache filter function
      createFilterFn(props, allFilterProps) {
        let key = props && props.join('')
        const hit = this._filterFnCache[key]

        if (hit) {
          return hit
        }

        this._filterFnCache[key] = function(el, filter) {
          let props = filter.props || allFilterProps
          return props.some(prop => {
            let elVal = el[prop]
            /* istanbul ignore if */
            if (elVal === undefined) {
              console.error(propError(prop))
              return false
            } else if (elVal === null) {
              return false
            }

            return filter.vals.some(val => {
              return elVal.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
            })
          })
        }

        return this._filterFnCache[key]
      }
    },
    watch: {
      currentPage(val) {
        this.$emit('current-page-change', val)
      }
    }
  }
</script>
