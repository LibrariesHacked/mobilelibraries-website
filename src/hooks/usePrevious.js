import { useEffect, useRef } from 'react'

/**
 * Custom hook that returns the previous render's value for a given variable.
 *
 * @template T
 * @param {T} value - Current value to track.
 * @returns {T|undefined} Previous value from the prior render.
 */
const usePrevious = value => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export default usePrevious
