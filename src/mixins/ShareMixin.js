import CheckboxGroup from '../components/ScCheckboxGroup'

export default {
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
      checkBoxValues: [],
      sortData: {},
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
    innerPaginationDef() {
      let paginationDef = Object.assign({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 20,
        pageSizes: [20, 50, 100],
        currentPage: 1
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
        let filterCopy = Object.assign({}, filter, {
          props: this.formatProps(filter.props),
          vals: this.formatToArray(filter.vals)
        })
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
    }
  },
  methods: {
    formatProps(props) {
      return props ? [].concat(props) : undefined
    },
    formatToArray(filters) {
      return filters ? [].concat(filters) : []
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
