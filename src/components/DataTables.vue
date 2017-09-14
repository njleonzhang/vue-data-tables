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
      @sort-change='handleSort',
      v-bind='innerTableProps',
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
import ErrorTips from './ErrorTips.js'
import ShareMixin from '../mixins/ShareMixin'

export default {
  name: 'DataTables',
  mixins: [ShareMixin],
  data() {
    return {
      sortData: {}
    }
  },
  computed: {
    innerCheckboxFilterDef() {
      let _allDataProps = this._allDataProps
      return Object.assign({
        props: undefined,
        def: [],
        colProps: {
          span: 14
        },
        filterFunction: (el, filter) => {
          let props = filter.props || _allDataProps
          return props.some(prop => {
            let elVal = el[prop]
            /* istanbul ignore if */
            if (elVal === undefined) {
              console.error(ErrorTips.propError(prop))
            } else if (elVal === null) {
              return false
            }

            return filter.vals.some(val => {
              return elVal.toString() === val
            })
          })
        }
      }, this.checkboxFilterDef)
    },
    innerSearchDef() {
      return Object.assign({
        show: true,
        props: undefined,
        filterFunction: undefined,
        debounceTime: 200
      }, this.searchDef)
    },
    sortedData() {
      let sortedData = this.data.slice()

      if (this.sortData.order) {
        let order = this.sortData.order
        let prop = this.sortData.prop
        let isDescending = order === 'descending'

        // todo: customize sort function
        sortedData.sort(function(a, b) {
          if (a[prop] > b[prop]) {
            return 1
          } else if (a[prop] < b[prop]) {
            return -1
          } else {
            return 0
          }
        })
        if (isDescending) {
          sortedData.reverse()
        }
      }

      return sortedData
    },
    tableData() {
      let filteredData = this.sortedData.slice()
      let _allDataProps = this._allDataProps

      let doFilter = function(defaultFilterFunction, filter) {
        let filterFunction = filter.filterFunction || defaultFilterFunction

        filteredData = filteredData.filter(el => {
          return filterFunction(el, filter)
        })
      }

      this.filters.forEach(filter => {
        let vals = filter.vals
        if (!vals || vals.length === 0) {
          return true
        }

        let defaultFilterFunction = function(el, filter) {
          let props = filter.props || _allDataProps
          return props.some(prop => {
            let elVal = el[prop]
            /* istanbul ignore if */
            if (elVal === undefined) {
              console.error(ErrorTips.propError(prop))
            } else if (elVal === null) {
              return false
            }

            return filter.vals.some(val => {
              return elVal.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
            })
          })
        }

        doFilter(defaultFilterFunction, filter)
      })

      this.$emit('filtered-data', filteredData)
      return filteredData
    },
    curTableData() {
      let from = this.innerPageSize * (this.currentPage - 1)
      let to = from + this.innerPageSize
      return this.tableData.slice(from, to)
    },
    total() {
      return this.tableData.length
    },
    filters() {
      let filters = this.formatToArray(this.innerCustomFilters)
      if (this.showActionBar) {
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
            vals: this.checkBoxValues,
            filterFunction: this.innerCheckboxFilterDef.filterFunction
          })
        }
      }
      return filters
    }
  },
  methods: {
    handleSizeChange(size) {
      this.innerPageSize = size
      this.$emit('size-change', size)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.$emit('current-change', currentPage)
    },
    handleFilterChange(checkBoxValues) {
      this.checkBoxValues = checkBoxValues
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this._allDataProps = Object.keys(val && val[0] || {})
      }
    }
  }
}
</script>
