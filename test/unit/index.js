import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { DataTables, DataTablesServer } from '@/index'
import chai from 'chai'
import sinonChai from 'sinon-chai'

Vue.use(ElementUI)
Vue.use(DataTables)
Vue.use(DataTablesServer)

chai.should() // Using Should style
chai.use(sinonChai)

Vue.config.productionTip = false
Vue.config.silent = true

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
