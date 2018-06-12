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
