import { useState } from 'react'

import * as stopModel from '../models/stops'

const useMobileStopsQuery = () => {
  const [loadingMobileStops, setLoadingMobileStops] = useState(false)
  const [mobileStops, setMobileStops] = useState([])
  const [pageInfo, setPageInfo] = useState([])

  const getMobileStopsFromQuery = async queryOptions => {
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
  }

  return { loadingMobileStops, mobileStops, pageInfo, getMobileStopsFromQuery }
}

export default useMobileStopsQuery
