import axios from 'axios';
import { lineFoods, lineFoodsReplace } from '../urls/index';

export const postLineFoods =(params) => {
  return axios.post(lineFoods,
    {
      food_id: params.foodId,
      count: params.count,
    }
  )
  .then(res => {
    return res.data
  })
  .catch((e) => { throw e; })
};

export const replaceLineFoods = (params) => {
  return axios.put(lineFoodsReplace,
    {
      food_id: params.foodId,
      count: params.count,
    })
  .then(res => {
    return res.data
  })
  .catch((e) => { throw e; })
}