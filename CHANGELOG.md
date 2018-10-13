## 3.4.4 (2018-9-20)
fix bug: table show as empty if pagination is disabled, at the same time, data is retrieved asynchronously.

## 3.4.2 (2018-7-6)
fix https://github.com/njleonzhang/vue-data-tables/pull/184

## 3.4.1 (2018-7-5)
fix https://github.com/njleonzhang/vue-data-tables/pull/183

## 3.4.0 (2018-6-12)
* remove the default action bar and encourage use customize action bar.
* improve render performance with function cache.
* sync modifier for currentPage and pageSize

## 3.3.3 (2018-5-22)
* upgrade to webpack 4 and vue-loader 15

  **breaking changes:** `DataTables` no more exported by default
  ```js
  // Since 3.3.3
  import { DataTables } from 'vue-data-tables'

  // Before 3.3.3
  import DataTables from 'vue-data-tables'
  ```

## 3.2.0 (2018-4-10)
* fix #161 current page doesn't not change after data is filtered.
* support element-ui 2.3.3

## 3.1.4 (2018-3-6)
fix #154 `current-change` event is duplicated on `el-table` and `el-pagination`

> *breaking changes:* `current-change` of `el-pagination` is renamed to `current-page-change`

## 3.1.3 (2018-1-12)
fix bug: dataTableServer not emit query-change event when init

## 3.1.2 (2017-12-16)
fix #127 default sort cause duplicate data load

## 3.1.1 (2017-12-14)
lodash treeshaking

## 3.1.0 (2017-12-11)
* rewrite the template with jsx
* support action column customization refer to the doc


## 3.0.1 (2017-11-19)
* support customize sort function
* support filter type for vue-data-tables-server


## 3.0.0 (2017-11-2)
support element-ui 2.x


## 2.1.1 (2017-10-19)
support vue 2.5


## 2.1.0 (2017-9-21)
* support server-side data source (Load massive data) #89 #63
* append slot #86
* support change seach box icon


## 2.0.4 (2017-8-29)
### bugfix
* #82 null in data cause filter error
* #78 0 in data cause filter error
* Show all data without paging

### enhancement
* #72 export more parameter to handler function
* #79 Update debounce timeout


## 2.0.2 (2017-7-24)
* proxy el-pagination event
* fix bug: sort feature not work

## 2.0.2 (2017-7-23)
proxy all el-table event


## 2.0.1 (2017-7-19)
* Api redesign
* breaking changes to 1.x
* read 2.x document for details


## 1.1.1 (2017-4-15)
* add prop action-col-fixed @bboywulong @ecerroni
* add support for customizing action button style. @bboywulong @sxhjlzl
* support all el-table prop by tableProps @Grawl @ac88


## 1.1.0 (2017-3-22)
fix #18 vue render cause table refresh wrong.


## 1.0.9 (2017-3-20)
make border and stripe configurable.


## 1.0.8 (2017-3-12)
* add vue-router as dependency #11
* fix column click on the error #14
* add License #12
* add csv export example #13


## 1.0.7 (2017-3-8)
Enhancement #9 add property for setting placeholder of search box @ecerroni.


## 1.0.6 (2017-3-2)
fix #8


## 1.0.4 (2017-2-25)
fix #6


## 1.0.2 (2017-2-24)
* add new property action-col-label for indicating action column name
* add en doc


## 1.0.1 (2017-2-13)
* Fix filter bar issue. #5
* Update readme
