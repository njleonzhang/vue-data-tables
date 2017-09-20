<style lang='scss'>
  @import "../style/index.scss";
</style>

<template lang="pug">
  include ../template/index.pug
  +template()(
    v-loading="innerLoading",
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
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.loadData && this.innerLoadData({
        type: 'init',
        ...this.queryInfo
      })
    },
    data() {
      return {
        innerLoading: false
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
        let info = {
          type,
          ...this.queryInfo
        }

        this.$emit('query-change', info)

        this.loadData && this.innerLoadData(info)
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
      innerLoadData(info) {
        this.innerLoading = true
        this.loadData && this.loadData(info)
          .then(data => {
            this.innerLoading = false
            this.$emit('load-data-success', data, info)
          })
          .catch(error => {
            this.innerLoading = false
            this.$emit('load-data-fail', error, info)
          })
      }
    },
    watch: {
      innerCustomFilters() {
        this.queryChange('customFilterChange')
      },
      loading(val) {
        this.innerLoading = val
      }
    }
  }
</script>
