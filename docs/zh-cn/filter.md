# 过滤

`vue-data-tables` 接受参数 `filters` 来现实对表格内容的过滤。传入 `filters` 的值的格式如下：

```
// 以类似typescript的定义格式描述
[
  {
    prop: String | Array;
    value: any;
    filterFn: Function;
    [key: string]: any;
  },
  ...
]
```
