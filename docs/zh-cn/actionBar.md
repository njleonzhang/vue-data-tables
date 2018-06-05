# 工具栏
在 `3.4` 以前的版本里, `vue-data-tables` 提供默认的工具栏，能够快速创建出一些按钮, checkbox、search 等几种用于过滤的组件，但是在实际项目中，我们发现这个默认的工具栏越来越显得鸡肋。因为实际业务对工具栏的要求千差万别, 默认的工具栏基本是用不上的, 而且增加了库本身的复杂性。从版本 `3.4` 开始，默认的工具栏被移除了, 需要使用工具栏, 则可以需要自己实现。


```html
/*vue*/
<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="5">
        <el-dropdown @command="handleClick">
          <el-button type="primary">Actions<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='new'>new</el-dropdown-item>
            <el-dropdown-item command='import'>import</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="10">
        <el-select v-model="filters[1].value"  placeholder='select type' multiple="multiple">
          <el-option label="Repair" value="repair"></el-option>
          <el-option label="Help" value="help"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" :offset="4">
        <el-input v-model="filters[0].value"/>
      </el-col>
    </el-row>

    <data-tables
      :data='data'
      :filters="filters">
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
      >
      </el-table-column/>
  </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      filters: [{
        value: '',
        prop: 'flow_type',
      }, {
        value: []
      }]
    }
  },
  methods: {
    handleClick(command) {
      this.$message(`click dropdown button ${command}`)
    }
  }
}
</script>
```

如果，项目中的工具条有很多工具条，其功能又十分类似，则我们可以把工具条封装成一个组件，比如叫 `tool-bar`, 则上面的代码就可以得到简化:

```html
<template>
  <div>
    <tool-bar v-model='filters'></tool-bar>
    <data-tables
      :data='data'
      :filters="filters">
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
      >
      </el-table-column/>
    </data-tables>
  </div>
</template>

<script>
....
</script>

```

# 工具栏插槽
`vue-data-table` 提供了一个 `tool-bar` 插槽, 允许将工具条作为插槽放在表格内部。配合 layout 属性，我们可以让`工具栏`显示在`表格`和`分页栏`之间，如下例:

```html
/*vue*/
<template>
  <data-tables
    :data='data'
    :filters="filters"
    layout='pagination, tool, table'>
    <el-row slot='tool' style="margin: 10px 0">
      <el-col :span="5">
        <el-dropdown @command="handleClick">
          <el-button type="primary">Actions<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command='new'>new</el-dropdown-item>
            <el-dropdown-item command='import'>import</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="10">
        <el-select v-model="filters[1].value" multiple="multiple">
          <el-option label="Repair" value="repair"></el-option>
          <el-option label="Help" value="help"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" :offset="4">
        <el-input v-model="filters[0].value"/>
      </el-col>
    </el-row>

    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
    >
    </el-table-column/>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      filters: [{
        value: '',
        prop: 'flow_type',
      }, {
        value: []
      }]
    }
  },
  methods: {
    handleClick(command) {
      this.$message(`click dropdown button ${command}`)
    }
  }
}
</script>
```
