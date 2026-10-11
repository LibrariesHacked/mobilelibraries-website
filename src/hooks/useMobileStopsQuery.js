import { useCallback, useState } from 'react'

import * as stopModel from '../models/stops'

/**
 * Custom hook for querying paginated and filtered mobile library stops.
 *
 * @returns {{
 *   loadingMobileStops: boolean,
 *   mobileStops: import('../models/stops').Stop[],
 *   pageInfo: { totalRowCount?: number, currentPage?: number },
 *   getMobileStopsFromQuery: Function
 * }} Query state and trigger function.
 */
const useMobileStopsQuery = () => {
  const [loadingMobileStops, setLoadingMobileStops] = useState(false)
  const [mobileStops, setMobileStops] = useState([])
  const [pageInfo, setPageInfo] = useState({})

  const getMobileStopsFromQuery = useCallback(async queryOptions => {
    setLoadingMobileStops(true)

    const response = await stopModel.getQueryStops(
      {
        page: queryOptions.page,
        pageSize: queryOptions.pageSize,
        orderBy: {
          field: queryOptions.sortModel[0].field,
          direction: queryOptions.sortModel[0].sort
        }
      },
      queryOptions.searchPosition,
      queryOptions.searchDistance,
      queryOptions.organisationFilter,
      queryOptions.mobileFilter,
      queryOptions.routeFilter
    )
    setLoadingMobileStops(false)
    setMobileStops(response.stops)
    setPageInfo({
      totalRowCount: response.totalRowCount,
      currentPage: response.currentPage
    })
    return response
  }, [])

  return { loadingMobileStops, mobileStops, pageInfo, getMobileStopsFromQuery }
}

export default useMobileStopsQuery
