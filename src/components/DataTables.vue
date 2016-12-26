<style lang="scss">
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
      el-col.actions(:span="toolBarDef.actions.width" v-if="toolBarDef.actions")
        action-bar(:actions="toolBarDef.actions.def")
      el-col.filters(:span="toolBarDef.filters.width" v-if="toolBarDef.filters")
        checkbox-group(:checks="toolBarDef.filters.def" @checkChange="handleFilterChange")
      el-col.search(:span=5, :offset="toolBarDef.search && toolBarDef.search.offset")
        el-input(v-model="searchKey", icon="search")

    el-table(
      :data='curTableData',
      @sort-change='handleSort',
      border,
      fit,
      stripe,
      @row-click='handleRowClick',
      style="width: 100%")
      slot
      el-table-column(label='操作', prop='innerRowActions', inline-template, :min-width="actionColWidth")
        div.action-list
          span(v-for="action in rowActionDef")
            el-button(
              type="text",
              @click="action.handler(row)") {{action.tip}}

    .pagination-wrap
      el-pagination(
        @size-change='handleSizeChange',
        @current-change='handleCurrentChange',
        :current-page='currentPage',
        :page-sizes='pageSizes',
        :page-size='internalPageSize',
        layout='prev, pager, next, jumper, sizes, total',
        :total='total')
</template>

<script>
import ActionBar from 'components/ActionBar'
import CheckboxGroup from 'components/ScCheckboxGroup'

export default {
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
    pageSize: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [20, 50, 100]
      }
    },
    toolBarDef: {
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
    actionColWidth: String,
    colNotRowClick: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      sortData: {},
      internalPageSize: 10,
      searchKey: '',
      checkedFilters: []
    }
  },
  computed: {
    innerColNotRowClick() {
      return this.colNotRowClick.concat(['innerRowActions'])
    },
    tableData() {
      let newData = this.data

      let doFilter = function(defaultFilterFunction, filter, value) {
        let filterFunction = defaultFilterFunction
        newData = newData.filter(el => {
          if (filter.filterFunction) {
            filterFunction = filter.filterFunction
          }
          return filterFunction(el[filter.property], value, el, filter.property)
        })
      }

      this.filters.forEach((filter) => {
        if (!filter.value) {
          // 如果filter.value没有值， 则说明filter失效，不处理
          return true
        }

        if (filter.property) {
          let value = filter.value
          if (!(value instanceof Array)) { // 1. 过滤条件value是列表，且不为空
            let defaultFilterFunction = function(data, value) {
              console.log(data, value)
              return data.indexOf(value) > -1
            }

            doFilter(defaultFilterFunction, filter, value)
          } else if (value instanceof Array && value.length > 0) {
            // 2. 过滤条件value不是列表， 且其值对应boolen类型是true (这个判断比较粗)
            let defaultFilterFunction = function(data, values) {
              console.log(data, values)
              return values.indexOf(data) > -1
            }

            doFilter(defaultFilterFunction, filter, value)
          }
        } else { // 过滤条件没有property属性，则与所有的项比较(全表模糊搜索),
          // 此处需要自定义匹配函数
          // todo
          newData = newData.filter(el => {
            return Object.keys(el).some((key) => {
              return String(el[key]).indexOf(filter.value) > -1
            })
          })
        }
      })

      if (this.sortData.order) {
        let order = this.sortData.order
        let prop = this.sortData.prop
        let isDescending = order === 'descending'
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
    filters() {
      let filters = [{
        value: this.searchKey
      }]

      let prop = this.toolBarDef.filters && this.toolBarDef.filters.prop
      if (prop) {
        if (prop instanceof Array) {
          prop.forEach(el => {
            filters.push({
              property: el,
              value: this.checkedFilters
            })
          })
        } else if (typeof prop === 'string') {
          filters.push({
            property: prop,
            value: this.checkedFilters
          })
        }
      }
      return filters
    }
  },
  methods: {
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
      if (this.innerColNotRowClick.indexOf(column.property) === -1) {
        this.$emit('row-click', row)
      }
    }
  },
  watch: {
    pageSize: {
      immediate: true,
      handler(val) {
        this.internalPageSize = val
      }
    }
  }
}
</script>
