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
import CheckboxGroup from './ScCheckboxGroup'
import debounce from 'javascript-debounce'

export default {
  name: 'DataTables',
  components: {
    CheckboxGroup
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    showActionBar: {
      type: Boolean,
      default: true
    },
    customFilters: {
      type: [Object, Array],
      default() {
        return []
      }
    },
    tableProps: {
      type: Object,
      default() {
        return {}
      }
    },
    colNotRowClick: {
      type: Array,
      default() {
        return []
      }
    },
    actionsDef: {
      type: Object,
      default() {
        return {}
      }
    },
    checkboxFilterDef: {
      type: Object,
      default() {
        return {}
      }
    },
    searchDef: {
      type: Object,
      default() {
        return {}
      }
    },
    actionColDef: {
      type: Object,
      default() {
        return {}
      }
    },
    paginationDef: {
      type: Object,
      default() {
        return {}
      }
    },
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
  mounted() {
    let elTableVm = this.$refs['elTable']
    const oldEmit = elTableVm.$emit
    elTableVm.$emit = (...args) => {
      let command = args[0]
      if (command === 'row-click' || command === 'cell-click') {
        let column = command === 'row-click' ? args[3] : args[2]
        if (column && this.innerColNotRowClick.indexOf(column.property) === -1) {
          this.$emit.apply(this, args)
        }
      } else {
        this.$emit.apply(this, args)
      }
      oldEmit.apply(elTableVm, args)
    }
  },
  data() {
    return {
      currentPage: 1,
      innerPageSize: 20,
      searchKey: '',
      innerSearchKey: '',
      actionColProp: 'e6e4c9de-7cf5-4f19-bb73-838e5182a372',
      checkBoxFilter: {},
      lastData: {},
      loading: false
    }
  },
  computed: {
    innerActionsDef() {
      return Object.assign({
        colProps: {
          span: 5
        },
        def: []
      }, this.actionsDef)
    },
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
    innerPaginationDef() {
      let paginationDef = Object.assign({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 20,
        pageSizes: [20, 50, 100],
        currentPage: 1,
      }, this.paginationDef)

      if (paginationDef.show === false) {
        paginationDef.pageSize = this.data.length
      } else {
        if (paginationDef.pageSizes.indexOf(paginationDef.pageSize) === -1) {
          console.warn(`pageSize ${paginationDef.pageSize} is not in pageSizes[${paginationDef.pageSizes}], use the first one(${paginationDef.pageSizes[0]}) in pageSizes`)
          paginationDef.pageSize = paginationDef.pageSizes[0]
        }
      }
      return paginationDef
    },
    innerActionColDef() {
      return Object.assign({
        show: true,
        label: '操作',
        fixed: false,
        def: []
      }, this.actionColDef)
    },
    actionColShow() {
      return this.innerActionColDef.def.length > 0
    },
    innerColNotRowClick() {
      return this.colNotRowClick.concat([this.actionColProp])
    },
    innerCustomFilters() {
      let customFilterArray = this.formatToArray(this.customFilters)
      let customFilters = []
      customFilterArray.forEach(filter => {
        let filterCopy = Object.assign({}, filter)

        filterCopy = {
          props: this.formatProps(filterCopy.props),
          vals: this.formatToArray(filter.vals)
        }

        customFilters.push(filterCopy)
      })
      return customFilters
    },
    innerTableProps() {
      return Object.assign({
        border: true,
        stripe: true,
        fit: true
      }, this.tableProps)
    },
    checkboxShow() {
      return this.innerCheckboxFilterDef.def.length > 0
    },
    searchShow() {
      return this.innerSearchDef.show !== false
    },
    actionsShow() {
      return this.innerActionsDef.def.length > 0
    },
    paginationShow() {
      return this.paginationDef.show !== false
    },
    updateInnerSearchKey() {
      const timeout = this.innerSearchDef.debounceTime
      return debounce(_ => {
        this.innerSearchKey = this.searchKey
      }, timeout)
    },
    curTableData() {
      return this.data.length > this.innerPageSize
        ? this.data.slice(0, this.innerPageSize)
        : this.data
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
            vals: this.checkBoxFilter
          })
        }
      }

      return filters
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
    formatProps(props) {
      return props ? [].concat(props) : undefined
    },
    formatToArray(filters) {
      return filters ? [].concat(filters) : []
    },
    handleSort(obj) {
      this.sortData = obj
    },
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
    handleFilterChange(checkBoxFilter) {
      this.checkBoxFilter = checkBoxFilter
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
  },
  watch: {
    innerPaginationDef: {
      immediate: true,
      handler(val) {
        this.innerPageSize = val.pageSize
        this.currentPage = val.currentPage
      }
    },
    searchKey() {
      this.updateInnerSearchKey()
    }
  }
}
</script>
