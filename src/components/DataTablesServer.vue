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
    created() {
      this._server = true
      this.queryChange('init')
    },
    computed: {
      curTableData() {
        return this.data.length > this.innerPageSize
          ? this.data.slice(0, this.innerPageSize)
          : this.data
      },
      queryInfo() {
        return {
          page: this.currentPage,
          pageSize: this.innerPageSize,
          sortInfo: this.sortData,
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
      handleSizeChange(size) {
        this.innerPageSize = size
        this.queryChange('sizeChange')
        this.$emit('size-change', size)
      },
      handleSort(obj) {
        if (this.sortData.prop === obj.prop && this.sortData.order === obj.order) {
          this.sortData = obj
        } else {
          this.sortData = obj
          this.queryChange('sortChange')
        }
      },
    },
    watch: {
      filters: {
        handler() {
          this.queryChange('filterChange')
        },
        deep: true
      },
      'tableProps.defaultSort': {
        immediate: true,
        handler(val) {
          this.sortData = val || {}
        }
      },
      currentPage(val) {
        this.queryChange('pageChange')
        this.$emit('current-page-change', val)
      }
    }
  }
</script>
