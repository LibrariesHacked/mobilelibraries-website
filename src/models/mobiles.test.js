import assert from 'node:assert/strict'
import test from 'node:test'

import { getOtherMobiles, isMobileOnRoad } from './mobileStatus.js'

test('isOnRoad only includes vehicles travelling between scheduled stops', () => {
  for (const type of ['preRoute', 'betweenStops']) {
    assert.equal(isMobileOnRoad({ type }), true)
  }

  for (const type of ['atStop', 'offRoad', 'postRoute']) {
    assert.equal(isMobileOnRoad({ type }), false)
  }

  assert.equal(isMobileOnRoad(null), false)
})

test('getOtherMobiles includes the full catalogue except mobiles currently on the road', () => {
  const mobiles = [{ id: 1 }, { id: 2 }, { id: 3 }]
  const onRoadMobileIds = new Set([1])

  const otherMobiles = getOtherMobiles(mobiles, onRoadMobileIds)

  assert.deepEqual(otherMobiles, [{ id: 2 }, { id: 3 }])
})
