# Checkbox filter
> customize the checkbox filter

# render the checkbox filter
property `checkbox-filter-def` is used to defined the checkbox filters

* `colProps` is used to customize the `el-col` of checkbox filter area

* `props` indicate the property[s] of `data` to filter.

* `def` define the checkbox items.

> The default filter logic is that showing the items whose `property` value is same to(included in) the selected item(s).

```html
/*vue*/
<desc>
`colProps.span = 19` make table checkbox filter area occupy 19 grids.
</desc>
<template>
  <data-tables
    :data='data'
    :checkbox-filter-def="checkboxFilterDef">
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      checkboxFilterDef: {
        colProps: {
          span: 19
        },
        props: 'flow_type_code',
        def: [{
          'code': 'repair',
          'name': 'Repair'
        }, {
          'code': 'help',
          'name': 'Help'
        }]
      }
    }
  }
}
</script>
```

# custom filter function
`checkboxFilterDef.filterFunction(el, filter)` is designed to customize the filter logic. parameter `el` indicate a element in data table. `filter` represent a filter object. we can leverage `props` and `vals` properties of `filter`.

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| props | indicate property scopes of this filter | Array | - |
| vals | the filter target values of this filter | Array | - |

> element in the table will be pass as `el` parameter to filterFunction, and if filterFunction return true, then the element will be keep in the table, if not, the element is filtered.

```html
/*vue*/
<desc>
customize filter logic as you want.
</desc>
<template>
  <data-tables
    :data='data'
    :checkbox-filter-def="checkboxFilterDef">
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      checkboxFilterDef: {
        def: [{
          'code': 'repair',
          'name': 'Repair'
        }, {
          'code': 'help',
          'name': 'Help'
        }],
        filterFunction(el, filter) {
          return el['flow_type_code'] === filter.vals[0]
        }
      }
    }
  }
}
</script>
```

# Related properties

`data-tables` property

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| checkbox-filter-def | define the checkbox filter | Object | - |

`checkbox-filter-def` object property

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| colProps | [el-col property](http://element.eleme.io/#/en-US/component/layout#col-attributes) of the checkbox filter area | Object | `{span: 14}` |
| def | define the checkboxItems | Array of Object | - |
| filterFunction | customize the filter logic | Function | - |

property of object in `checkbox-filter-def.def`

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| code | value of the checkbox represented | Object | - |
| name | label of the checkbox | Object | - |
