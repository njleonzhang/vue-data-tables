import { mount } from '@vue/test-utils'

export let createVue = function(Comp) {
  return mount(Comp, {
    attachToDocument: true
  })
}

export let sleep = function(time = 200) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve()
    }, time)
  })
}

export let nextTick = function(vm) {
  return new Promise(function(resolve) {
    vm.$nextTick(_ => {
      resolve()
    })
  })
}

export let getTable = function(el) {
  return el.find('.el-table')
}

export let getHead = function(el) {
  return el.find('thead')
}

export let getBody = function(el) {
  return el.find('tbody')
}

export let getRows = function(el) {
  return el.findAll('tr')
}

export let getTableItems = function(el) {
  let table = getTable(el)
  let head = getHead(table)
  let body = getBody(table)
  let rows = getRows(body)
  return { table, head, body, rows }
}
