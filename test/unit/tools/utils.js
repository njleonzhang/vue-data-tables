import Vue from 'vue'

HTMLElement.prototype.find = HTMLElement.prototype.querySelector
HTMLElement.prototype.findAll = HTMLElement.prototype.querySelectorAll
NodeList.prototype.at = NodeList.prototype.item

let id = 0

export let createVue = function(Compo, mounted = false) {
  if (Object.prototype.toString.call(Compo) === '[object String]') {
    Compo = { template: Compo }
  }
  let vm = new Vue(Compo).$mount(createElm())
  return vm
}

const createElm = function() {
  const elm = document.createElement('div')

  elm.id = 'app' + ++id
  document.body.appendChild(elm)
  return elm
}

/**
 * 回收 vm
 * @param  {Object} vm
 */
export let destroyVM = function(vm) {
  vm.$destroy && vm.$destroy()
  vm.$el &&
    vm.$el.parentNode &&
    vm.$el.parentNode.removeChild(vm.$el)
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
  let table = getTable(el.$el)
  let head = getHead(table)
  let body = getBody(table)
  let rows = getRows(body)
  return { table, head, body, rows }
}

export let simulateEvent = (inputElm, text, event) => {
  inputElm.value = text
  inputElm.dispatchEvent(new Event(event))
}
export let triggerKeyDown = function(el, keyCode) {
  const evt = document.createEvent('Events')
  evt.initEvent('keydown', true, true)
  evt.keyCode = keyCode
  el.dispatchEvent(evt)
}
