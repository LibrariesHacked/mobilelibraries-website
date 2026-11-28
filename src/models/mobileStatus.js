export const isMobileOnRoad = status => Boolean(
  status && (status.type === 'preRoute' || status.type === 'betweenStops')
)

export const getOtherMobiles = (mobiles, onRoadMobileIds) => {
  return mobiles.filter(mobile => !onRoadMobileIds.has(mobile.id))
}
