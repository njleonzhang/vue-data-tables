<style lang='scss'>
.sc-table {
  .tool-bar {
    margin-bottom: 20px;
  }

  .action-list {
    text-align: center;
    & > span {
      margin-right: 10px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .el-tooltip__rel, .el-tooltip {
    display: inline-block !important;
  }

  .pagination-wrap {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

<template lang="pug">
  .sc-table
    el-row.tool-bar(v-if="showActionBar")
      el-col.actions(
        v-bind='innerActionsDef.colProps'
        v-if='actionsShow')
        el-button(
          v-for="action in innerActionsDef.def",
          @click="action.handler",
          :icon='action.icon',
          :key="action.name",
          :type='action.buttonProps && action.buttonProps.type || "primary"'
          v-bind='action.buttonProps') {{action.name}}
      el-col.filters(
        v-bind='innerCheckboxFilterDef.colProps'
        v-if='checkboxShow')
        checkbox-group(:checks='innerCheckboxFilterDef.def', @checkChange='handleFilterChange')
      el-col.search(
        :span='innerSearchDef.colProps && innerSearchDef.colProps.span || 5'
        v-bind='innerSearchDef.colProps'
        v-if='searchShow')
        el-input(
          v-model='searchKey',
          :icon='innerSearchDef.inputProps && innerSearchDef.inputProps.icon || "search"',
          v-bind='innerSearchDef.inputProps')
    .custom-tool-bar
      slot(name='custom-tool-bar')

    el-table(
      ref='elTable',
      :data='curTableData',
      v-loading="loading",
      :element-loading-text="loadingStr",
      v-bind='innerTableProps',
      @sort-change='handleSort',
      style='width: 100%')
      slot
      div(slot='append')
        slot(name='append')
      el-table-column(
        :prop='actionColProp',
        v-if='actionColShow',
        :fixed='innerActionColDef.fixed',
        :label='innerActionColDef.label',
        :type='innerActionColDef.type',
        :width='innerActionColDef.width',
        :minWidth='innerActionColDef.minWidth')
        template(scope='scope')
          .action-list
            span(v-for='action in innerActionColDef.def')
              el-button(
                :type='action.type || "text"',
                :icon='action.icon',
                @click='action.handler(scope.row, scope.$index, scope.column, scope.store)')
                | {{action.name}}

    .pagination-wrap(v-if='paginationShow')
      el-pagination(
        @size-change='handleSizeChange',
        @current-change='handleCurrentChange',
        :current-page='currentPage',
        :page-sizes='innerPaginationDef.pageSizes',
        :page-size='innerPageSize',
        :layout='innerPaginationDef.layout',
        :total='total')
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
