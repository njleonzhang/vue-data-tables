import DataTables from './components/DataTables'
import DataTablesServer from './components/DataTablesServer'

DataTables.install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

DataTablesServer.install = function(Vue) {
  Vue.component(DataTablesServer.name, DataTablesServer)
}

export {
  DataTables,
  DataTablesServer,
}
