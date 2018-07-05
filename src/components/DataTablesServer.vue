<style lang='scss'>
  @import "../style/index.scss";
</style>

<script>
import ShareMixin from '../mixins/ShareMixin'

export default {
  name: 'DataTablesServer',
  mixins: [ShareMixin],
  props: {
    loadingStr: {
      type: String,
      default: ''
    },
    total: {
      type: Number
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerTotal: 0
    }
  },
  created() {
    this._server = true
    this.queryChange('init')

    // fix https://github.com/njleonzhang/vue-data-tables/issues/172
    let totalPage = this.total / this.pageSize
    let ceilTotalPage = Math.ceil(totalPage)

    this.innerTotal = ceilTotalPage >= this.currentPage
      ? this.total
      : this.pageSize * this.currentPage
  },
  computed: {
    curTableData() {
      return this.data
    },
    queryInfo() {
      return {
        page: this.innerCurrentPage,
        pageSize: this.innerPageSize,
        sort: this.sortData,
        filters: this.filters
      }
    },
  },
  methods: {
    queryChange(type) {
      let info = {
        type,
        ...this.queryInfo
      }
      this.$emit('query-change', info)
    },
    handleSort(obj) {
      let { prop, order } = obj
      // avoid event emit, if both prop and order are not change, special scenario 'multi-columns share the same prop'
      if (this.sortData.prop !== prop || this.sortData.order !== order) {
        this.sortData = {
          prop,
          order
        }
        this.queryChange('sort')
      }
    },
    handleSizeChange(size) {
      this.innerPageSize = size
      this.queryChange('size')
      this.$emit('size-change', size)
    },
  },
  watch: {
    total(val) {
      this.innerTotal = val
    },
    filters: {
      handler() {
        this.queryChange('filter')
      },
      deep: true
    },
    'tableProps.defaultSort': {
      immediate: true,
      handler(val) {
        this.sortData = val || {}
      }
    },
    innerCurrentPage(val) {
      this.queryChange('page')
    }
  }
}
</script>
