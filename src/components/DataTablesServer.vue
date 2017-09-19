<style lang='scss'>
  @import "../style/index.scss";
</style>

<template lang="pug">
  include ../template/index.pug
  +template()(
    v-loading="loading",
    :element-loading-text="loadingStr")
</template>

<script>
  import ShareMixin from '../mixins/ShareMixin'
  import debounce from 'javascript-debounce'

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
      loadData: {
        type: Function
      }
    },
    created() {
      this.loadData && this.innerLoadData()
    },
    data() {
      return {
        lastData: {},
        loading: false
      }
    },
    computed: {
      innerCheckboxFilterDef() {
        return Object.assign({
          props: undefined,
          def: [],
          colProps: {
            span: 14
          }
        }, this.checkboxFilterDef)
      },
      innerSearchDef() {
        return Object.assign({
          show: true,
          props: undefined,
          debounceTime: 200
        }, this.searchDef)
      },
      filters() {
        let filters = this.formatToArray(this.innerCustomFilters)

        if (this.showActionBar) {
          if (this.searchShow) {
            filters.push({
              props: this.formatProps(this.innerSearchDef.props),
              vals: this.formatToArray(this.innerSearchKey)
            })
          }
          if (this.checkboxShow) {
            filters.push({
              props: this.formatProps(this.innerCheckboxFilterDef.props),
              vals: this.checkBoxValues
            })
          }
        }

        return filters
      },
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
      updateInnerSearchKey() {
        const timeout = this.innerSearchDef.debounceTime
        return debounce(_ => {
          this.innerSearchKey = this.searchKey
          this.queryChange('searchBoxChange')
        }, timeout)
      }
    },
    methods: {
      queryChange(type) {
        this.$emit('query-change', {
          type,
          ...this.queryInfo
        })

        this.loadData && this.innerLoadData()
      },
      handleSizeChange(size) {
        this.innerPageSize = size
        this.queryChange('sizeChange')
      },
      handlePageChange(currentPage) {
        this.currentPage = currentPage
        this.queryChange('pageChange')
      },
      handleCheckBoxValChange(checkBoxValues) {
        this.checkBoxValues = checkBoxValues
        this.queryChange('checkBoxChange')
      },
      handleSort(obj) {
        this.sortData = obj
        this.queryChange('sortChange')
      },
      innerLoadData() {
        this.loading = true
        this.loadData(this.queryInfo, this.lastData)
          .then(data => {
            this.lastData = data
            this.loading = false
            this.$emit('load-data-success', data, this.queryInfo)
          })
          .catch(error => {
            this.loading = false
            this.$emit('load-data-fail', error, this.queryInfo)
          })
      }
    },
    watch: {
      innerCustomFilters() {
        this.queryChange('customFilterChange')
      }
    }
  }
</script>
