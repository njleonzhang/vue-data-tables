# Tool Bar
In the version before `3.4`, `vue-data-tables` provides a default tool bar with some filter tools, like checkbox and search. In practice, the tool bar is entirely different from project to project, most of the time, the default tool bar is useless. To decrease the complexity of this library, the default tool bar is removed from version `3.4`. If you need tool bar, just implement yourself according to your project requirement.

In the following example, we implement a tool bar, and leverage the [filters](en-us/filter.md) property of `vue-data-tables` to make table filter work.

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

If there are lots of similar tool bar in the project, we can consider to encapsulate it as a component. For example, we make `tool-bar` component, then the above code can be simplify to:

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

# Slot for tool bar
`vue-data-table` provide a `tool` slot for embedding the tool bar inside. Combined with property `layout`, we can make the tool bar show between table and pagination, as in the following example.

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
