import { isArray } from 'lodash'

export function propError(prop) {
  return `prop ${prop} not exist in the row, please confirm wether the prop is right, this may cause unpredictable filter result`
}

function checkContain(value, filterValue) {
  return value.toString().toLowerCase().includes(filterValue.toString().toLowerCase())
}

/**
 * prop: string
 * el: the row in table
 * filter: the filter Object.
 *    {
 *      prop: string | array
 *      value: any
 *    }
*/
export function stringPropFilterFn(prop, el, filter) {
  let elVal = el[prop]
  if (elVal === undefined) {
    console.error(propError(prop))
    return false
  } else if (elVal === null) {
    return false
  }

  return isArray(filter.value)
    ? filter.value.some(value => checkContain(elVal, value))
    : checkContain(elVal, filter.value)
}
