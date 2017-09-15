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
      this.innerLoadData()
    },
    data() {
      return {
        lastData: {},
        loading: false
      }
    },
    computed: {
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
          currentPage: this.currentPage,
          pageSize: this.innerPageSize,
          sortData: this.sortData,
          filters: this.filters
        }
      }
    },
    methods: {
      handleSizeChange(size) {
        this.innerPageSize = size
        this.$emit('query-change', {
          type: 'sizeChange',
          ...this.queryInfo
        })

        this.loadData && this.innerLoadData()
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.$emit('query-change', {
          type: 'pageChange',
          ...this.queryInfo
        })

        this.loadData && this.innerLoadData()
      },
      handleFilterChange(checkBoxValues) {
        this.checkBoxValues = checkBoxValues
        this.$emit('query-change', {
          type: 'checkBoxChange',
          ...this.queryInfo
        })

        this.loadData && this.innerLoadData()
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
    }
  }
</script>
