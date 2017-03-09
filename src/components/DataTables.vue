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
    el-row.tool-bar
      el-col.actions(
        :span='innerActionsDef.width',
        :offset='innerActionsDef.offset',
        v-if='actionsShow')
        action-bar(:actions='innerActionsDef.def')
      el-col.filters(
        :span='innerCheckboxFilterDef.width',
        :offset='innerCheckboxFilterDef.offset',
        v-if='checkboxShow')
        checkbox-group(:checks='innerCheckboxFilterDef.def' @checkChange='handleFilterChange')
      el-col.search(
        :span='innerSearchDef.width',
        :offset='innerSearchDef.offset',
        v-if='searchShow')
        el-input(
          v-model='searchKey',
          :placeholder='innerSearchDef.placeholder',
          icon='search')

    el-table(
      :data='curTableData',
      @sort-change='handleSort',
      border,
      fit,
      stripe,
      @row-click='handleRowClick',
      @selection-change='handleSelectChange',
      @select='handleSelect',
      @select-all='handleSelectAll',
      @current-change='handleCurrentRowChange',
      style='width: 100%')
      slot
      el-table-column(:label='actionColLabel',
        prop='innerRowActions',
        inline-template,
        v-if='hasActionCol',
        :min-width='actionColWidth')
        div.action-list
          span(v-for='action in rowActionDef')
            el-button(
              type='text',
              @click='action.handler(row)') {{action.name}}

    .pagination-wrap
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
import ActionBar from 'components/ActionBar'
import CheckboxGroup from 'components/ScCheckboxGroup'

export default {
  name: 'DataTables',
  components: {
    ActionBar,
    CheckboxGroup
  },
  props: {
    data: {
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
    rowActionDef: {
      type: Array,
      default() {
        return []
      }
    },
    actionColLabel: {
      type: String,
      default: '操作'
    },
    hasActionCol: {
      type: Boolean,
      default: true
    },
    actionColWidth: String,
    colNotRowClick: {
      type: Array,
      default() {
        return []
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
      checkedFilters: []
    }
  },
  computed: {
    innerActionsDef() {
      return Object.assign({}, {
        def: [],
        width: 5,
        offset: 0
      }, this.actionsDef)
    },
    innerCheckboxFilterDef() {
      return Object.assign({}, {
        props: undefined,
        def: [],
        width: 14,
        offset: 0,
        filterFunction: undefined
      }, this.checkboxFilterDef)
    },
    innerSearchDef() {
      return Object.assign({}, {
        show: true,
        props: undefined,
        filterFunction: undefined,
        width: 5,
        placeholder: '',
        offset: 0
      }, this.searchDef)
    },
    innerPaginationDef() {
      return Object.assign({}, {
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 20,
        pageSizes: [20, 50, 100],
        currentPage: 1
      }, this.paginationDef)
    },
    innerColNotRowClick() {
      return this.colNotRowClick.concat(['innerRowActions'])
    },
    tableData() {
      let newData = this.data.slice()

      let doFilter = function(defaultFilterFunction, filter, value) {
        let filterFunction = filter.filterFunction || defaultFilterFunction

        newData = newData.filter(el => {
          return filterFunction(el, filter)
        })
      }

      this.filters.forEach((filter) => {
        let val = filter.val
        if (!val || val.length === 0) {
          return true
        }

        let defaultFilterFunction
        if (filter.props) {
          // the filter is for some special column
          if (!(val instanceof Array)) {
            // filter value is not list
            defaultFilterFunction = function(el, filter) {
              return filter.props.some(prop => {
                return el[prop].indexOf(filter.val) > -1
              })
            }
          } else if (val instanceof Array && val.length > 0) {
            // filter value is list, at the same time not empty
            defaultFilterFunction = function(el, filter) {
              return filter.props.some(prop => {
                return filter.val.indexOf(el[prop]) > -1
              })
            }
          }
        } else {
          // filter is for all column
          defaultFilterFunction = function(el, filter) {
            return Object.keys(el).some(key => {
              return String(el[key]).indexOf(filter.val) > -1
            })
          }
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
    filters() {
      let filters = []

      if (this.searchShow) {
        filters.push({
          props: this.formatProps(this.innerSearchDef.props),
          val: this.searchKey,
          filterFunction: this.innerSearchDef.filterFunction
        })
      }
      if (this.checkboxShow) {
        filters.push({
          props: this.formatProps(this.innerCheckboxFilterDef.props),
          val: this.checkedFilters,
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
    handleSort(obj) {
      this.sortData = obj
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
    }
  }
}
</script>
