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
          :type='action.buttonProps && action.buttonProps.type || `primary`'
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
          v-bind='innerSearchDef.inputProps'
          icon='search')
    .custom-tool-bar
      slot(name='custom-tool-bar')

    el-table(
      :data='curTableData',
      @sort-change='handleSort',
      @row-click='handleRowClick',
      @selection-change='handleSelectChange',
      @select='handleSelect',
      @select-all='handleSelectAll',
      @current-change='handleCurrentRowChange',
      v-bind='innerTableProps'
      style='width: 100%')
      slot
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
                @click='action.handler(scope.row)') {{action.name}}

    .pagination-wrap(v-if='paginationShow')
      el-pagination(
        @size-change='handleSizeChange',
        @current-change='handleCurrentChange',
        :current-page='currentPage',
        :page-sizes='innerPaginationDef.pageSizes',
        :page-size='internalPageSize',
        :layout='innerPaginationDef.layout',
        :total='total')
</template>

<script>
import CheckboxGroup from 'components/ScCheckboxGroup'
import ErrorTips from 'components/ErrorTips.js'
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
    }
  },
  data() {
    return {
      sortData: {},
      currentPage: 1,
      internalPageSize: 20,
      searchKey: '',
      innerSearchKey: '',
      checkedFilters: [],
      actionColProp: 'e6e4c9de-7cf5-4f19-bb73-838e5182a372'
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
        },
        filterFunction: undefined
      }, this.checkboxFilterDef)
    },
    innerSearchDef() {
      return Object.assign({
        show: true,
        props: undefined,
        filterFunction: undefined
      }, this.searchDef)
    },
    innerPaginationDef() {
      return Object.assign({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 20,
        pageSizes: [20, 50, 100],
        currentPage: 1
      }, this.paginationDef)
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
    tableData() {
      let newData = this.data.slice()
      let allProps = Object.keys(newData[0] || {})

      let doFilter = function(defaultFilterFunction, filter, value) {
        let filterFunction = filter.filterFunction || defaultFilterFunction

        newData = newData.filter(el => {
          return filterFunction(el, filter)
        })
      }

      this.filters.forEach(filter => {
        let vals = filter.vals
        if (!vals || vals.length === 0) {
          return true
        }

        let defaultFilterFunction = function(el, filter) {
          let props = filter.props || allProps
          return props.some(prop => {
            let elVal = el[prop]
            if (!elVal) {
              console.error(ErrorTips.propError(prop))
            }
            return filter.vals.some(val => {
              return elVal.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
            })
          })
        }

        doFilter(defaultFilterFunction, filter)
      })

      if (this.sortData.order) {
        let order = this.sortData.order
        let prop = this.sortData.prop
        let isDescending = order === 'descending'

        // todo: customize sort function
        newData.sort(function(a, b) {
          if (a[prop] > b[prop]) {
            return 1
          } else if (a[prop] < b[prop]) {
            return -1
          } else {
            return 0
          }
        })
        if (isDescending) {
          newData.reverse()
        }
      }

      this.$emit('filtered-data', newData)
      return newData
    },
    curTableData() {
      let from = this.internalPageSize * (this.currentPage - 1)
      let to = from + this.internalPageSize
      return this.tableData.slice(from, to)
    },
    total() {
      return this.tableData.length
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
    filters() {
      let filters = this.formatToArray(this.innerCustomFilters)
      if (this.searchShow) {
        filters.push({
          props: this.formatProps(this.innerSearchDef.props),
          vals: this.formatToArray(this.innerSearchKey),
          filterFunction: this.innerSearchDef.filterFunction
        })
      }
      if (this.checkboxShow) {
        filters.push({
          props: this.formatProps(this.innerCheckboxFilterDef.props),
          vals: this.checkedFilters,
          filterFunction: this.innerCheckboxFilterDef.filterFunction
        })
      }
      return filters
    }
  },
  methods: {
    formatProps(props) {
      return props ? [].concat(props) : undefined
    },
    formatToArray(filters) {
      return filters ? [].concat(filters) : []
    },
    updateInnerSearchKey: debounce(function() {
      this.innerSearchKey = this.searchKey
    }, 200),
    handleSort(obj) {
      this.sortData = obj
      this.innerTableProps.defaultSort = {
        prop: obj.prop,
        order: obj.order
      }
    },
    handleSizeChange(size) {
      this.internalPageSize = size
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    handleFilterChange(checkedFilters) {
      this.checkedFilters = checkedFilters
    },
    handleRowClick(row, event, column) {
      if (column && this.innerColNotRowClick.indexOf(column.property) === -1) {
        this.$emit('row-click', row)
      }
    },
    handleSelectChange(selection) {
      this.$emit('selection-change', selection)
    },
    handleSelect(selection, row) {
      this.$emit('select', selection, row)
    },
    handleSelectAll(selection) {
      this.$emit('select-all', selection)
    },
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    }
  },
  watch: {
    innerPaginationDef: {
      immediate: true,
      handler(val) {
        this.internalPageSize = val.pageSize
        this.currentPage = val.currentPage
      }
    },
    searchKey() {
      this.updateInnerSearchKey()
    }
  }
}
</script>
