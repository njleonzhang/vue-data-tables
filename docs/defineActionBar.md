# Define you own action bar
If default action bar can not match requirement, it can be entirely customized.

1. set property `show-action-bar` to false to hide default action bar
2. write action bar template in `slot` `custom-tool-bar`
3. leverage property `custom-filters` to filter data

```html
/*vue*/
<desc>
object in `customFilters` can has 3 properties: `vals`, `props` and `filterFunction`
</desc>
<template>
  <data-tables
    :data='data'
    :show-action-bar="false"
    :custom-filters="customFilters">

    <el-row slot="custom-tool-bar" style="margin-bottom: 10px">
      <el-col :span="5">
        <el-dropdown @command="handleClick">
          <el-button type="primary">Actions<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='new'>new</el-dropdown-item>
            <el-dropdown-item command='import'>import</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="5">
        <el-select v-model="customFilters[1].vals" multiple="multiple">
          <el-option label="Repair" value="repair"></el-option>
          <el-option label="Help" value="help"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" :offset="9">
        <el-input v-model="customFilters[0].vals"/>
      </el-col>
    </el-row>

    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
      sortable="custom">
    </el-table-column/>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      customFilters: [{
        vals: '',
        props: 'flow_type',
      }, {
        vals: []
      }]
    }
  },
  methods: {
    handleClick(command) {
      this.$message(`click drapdown button ${command}`)
    }
  }
}
</script>
```

# Related properties

`data-tables` property

| Property | Desc | Type | Default value |
| -- | -- | -- | -- |
| show-action-bar | show or hide the default action bar | Boolean | false |
| custom-filters | define customize filters | Array of Object | - |

`custom-filters` object property

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| vals | target value of this filters | Array/String | - |
| props | indicate property scopes of this filter | Array | - |
| vals | the filter target values of this filter | Array | - |
