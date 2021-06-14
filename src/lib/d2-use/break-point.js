import { ref, watch } from 'vue'
import { keys, values, fromPairs, mapKeys } from 'lodash-es'
import { useWindowSize } from './window-size.js'

export function useBreakPoint ({ config = {}, wait } = {}) {
  const names = keys(config)
  const numbers = values(config).sort((a, b) => a - b)

  const { width } = useWindowSize({ wait })
  
  const breakPoint = ref('')

  const status = fromPairs(names.map(e => [e, ref(false)]))

  function statusUpdate (activeName) {
    mapKeys(status, (e, k) => {
      status[k].value = false
    })
    if (names.includes(activeName)) {
      status[activeName].value = true
    }
  }

  const dict = fromPairs(numbers.map((e, i) => [e, names[i]]))

  watch(width, () => {
    const value = numbers.reduce((result, e) => width.value > e ? e : result, 0)
    breakPoint.value = dict[value] || ''
    statusUpdate(breakPoint.value)
  })

  return {
    breakPoint,
    ...status
  }
}
