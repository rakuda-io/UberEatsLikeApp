import React, { Fragment, useEffect } from 'react';

//apis
import { fetchRestaurants } from '../apis/restaurants'

export const Restaurants = () => {
  useEffect(() => {
    fetchRestaurants()
    .then((data) => 
      console.log(data)
    )
  }, [])

  return (
    <Fragment>
      レストラン一覧
    </Fragment>
  )
}