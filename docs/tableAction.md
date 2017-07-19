# Table Actions
> customize the whole table

# render the table Actions
property `action-def` is used to defined the table actions, you can define `button`s here

```html
/*vue*/
<desc>
Define the button's `name` and `icon`, and `callback` in `actionsDef.def`
</desc>
<template>
  <data-tables
    :data='data'
    :actions-def="actionsDef">
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
      actionsDef: {
        def: [{
          name: 'new',
          handler: () => {
            this.$message("new clicked")
          }
        }, {
          name: 'import',
          handler: () => {
            this.$message("import clicked")
          }
        }]
      }
    }
  }
}
</script>
```

# customize the table Action area
All Buttons is wrapped in a [el-col](http://element.eleme.io/#/en-US/component/layout#col-attributes), you also use all `el-col`'s properties by `colProps`

```html
/*vue*/
<desc>
Define `actionsDef.colProps.span = 19` to make table action area occupy 19 grids.
</desc>
<template>
  <data-tables
    :data='data'
    :actions-def="actionsDef">
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
      actionsDef: {
        colProps: {
          span: 19
        },
        def: [{
          name: 'new',
          handler: () => {
            this.$message("new clicked")
          }
        }, {
          name: 'import',
          handler: () => {
            this.$message("import clicked")
          }
        }]
      }
    }
  }
}
</script>
```

# customize the table Action buttons
All action Buttons are `el-button`s. To customize it, `el-button`'s [properties](http://element.eleme.io/#/en-US/component/button#attributes) can be used by `buttonProps`

```html
/*vue*/
<desc>
leverage `buttonProps` to make second button show as `text` style. `icon` is shortcut for `buttonProps.icon`
</desc>
<template>
  <data-tables
    :data='data'
    :actions-def="actionsDef">
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
      actionsDef: {
        def: [{
          name: 'new',
          handler: () => {
            this.$message("new clicked")
          }
        }, {
          name: 'import',
          handler: () => {
            this.$message("import clicked")
          },
          icon: 'upload',
          buttonProps: {
            type: 'text'
          }
        }]
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
| actions-def	  | Define the actions of the whole actions| Object | - |

`actionsDef` Property

| Property | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| colProps | [el-col property](http://element.eleme.io/#/en-US/component/layout#col-attributes) of the action area | Object | - |
| def  | define action buttons | Array | [] |

Property of object in `actionsDef`

| Property | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| name	| label of the button | String | - |
| icon  | icon of the button | String | - |
| buttonProps  | [`el-button` property](http://element.eleme.io/#/en-US/component/button#attributes) of the button | String | - |
| handler  | callback of the button click | Function | - |
