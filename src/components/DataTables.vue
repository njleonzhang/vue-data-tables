<style lang='scss'>
@import "../style/index.scss";
</style>

<script>
import { stringPropFilterFn } from '../tools'
import ShareMixin from '../mixins/ShareMixin'
import { isArray, isString } from 'lodash'

let defaultSortFn = (a, b, prop) => a > b ? 1 : a < b ? -1 : 0

export default {
  name: 'DataTables',
  mixins: [ShareMixin],
  props: {
    sortMethod: {
      type: Object,
      default() {
        return {}
      }
    },
    allFilterProps: Array,
  },
  data() {
    return {
      innerAllFilterProps: []
    }
  },
  created() {
    this.innerAllFilterProps = this.allFilterProps || Object.keys(((this.data && this.data[0]) || {}))
    this._filterFnCache = Object.create(null)
    this._sortFnCache = Object.create(null)
  },
  computed: {
    sortedData() {
      if (this.sortData.order) {
        let sortedData = this.data.slice()

        let { order, prop } = this.sortData
        let isDescending = order === 'descending'

        let _sortMethod = this.createSortFn(prop, isDescending)
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
          this.createFilterFn(filter.prop)

        filteredData = filteredData.filter(el => {
          return filterFn(el, filter)
        })
      })

      this.$emit('filtered-data', filteredData)
      return filteredData
    },
    curTableData() {
      let from = this.innerPageSize * (this.innerCurrentPage - 1)
      let to = from + this.innerPageSize
      return this.tableData.slice(from, to)
    },
    total() {
      return this.tableData.length
    },
  },
  methods: {
    handleSort(obj) {
      this.sortData = obj
    },
    handleSizeChange(size) {
      this.innerPageSize = size
    },
    // cache filter function
    createFilterFn(prop) {
      let key
      let props = prop || this.innerAllFilterProps
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
    },
    createSortFn(prop, isDescending) {
      let key = prop + isDescending

      const hit = this._sortFnCache[key]
      if (hit) {
        return hit
      }

      this._sortFnCache[key] = (a, b) => (this.sortMethod[prop] || defaultSortFn)(a[prop], b[prop]) * (isDescending ? -1 : 1)
      return this._sortFnCache[key]
    }
  },
  watch: {
    allFilterProps(val) {
      this.innerAllFilterProps = val
    },
    sortMethod() {
      this._sortFnCache = []
    }
  }
}
</script>
