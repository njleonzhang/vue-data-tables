<style lang='scss'>
@import "../style/index.scss";
</style>

<script>
  import { stringPropFilterFn } from '../tools'
  import ShareMixin from '../mixins/ShareMixin'
  import { isArray, isString } from 'lodash'

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

        this.filters.forEach(filter => {
          let value = filter.value
          if ((isArray(value) && value.length === 0) ||
            (value === undefined || value === '')) {
            return true
          }

          let filterFn = filter.filterFn ||
            this.createFilterFn(filter.prop, this._allFilterProps)

          filteredData = filteredData.filter(el => {
            return filterFn(el, filter)
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
      createFilterFn(prop, allFilterProps) {
        let key
        let props = prop || allFilterProps
        if (isArray(props)) {
          key = props.join('')
        } else if (isString(prop)) {
          key = props
        } else {
          console.error('prop must be string or array')
          return () => false
        }

        const hit = this._filterFnCache[key]
        if (hit) {
          return hit
        }

        /**
         * el: the row in table
         * filter: the filter Object.
         *    {
         *      prop: string | array
         *      value: any
         *    }
         */
        this._filterFnCache[key] = function(el, filter) {
          return isArray(props)
            ? props.some(prop => stringPropFilterFn(prop, el, filter))
            : stringPropFilterFn(props, el, filter)
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
