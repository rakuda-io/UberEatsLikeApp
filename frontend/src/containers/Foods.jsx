import React, { Fragment, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//reducers
import {
  initialState as foodsInitialState,
  foodsActionTypes,
  foodsReducer,
} from '../reducers/foods';

//apis
import { fetchFoods } from '../apis/foods';

//constants
import { REQUEST_STATE } from '../constants';
import { COLORS } from '../style_constants';

//components
import { LocalMallIcon } from '../components/Icons';
import { FoodWrapper } from '../components/FoodWrapper';
import Skeleton from '@material-ui/lab/Skeleton';

//images
import MainLogo from '../images/logo.png';
import FoodImage from '../images/food-image.jpg';

//CSS
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 32px;
`
const BagIconWrapper = styled.div`
  padding-top: 24px;
`
const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`
const MainLogoImage = styled.div`
  height: 90px;
`
const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`
const ItemWrapper = styled.div`
  margin: 16px;
`

export const Foods = ({
  match
}) => {
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);

  useEffect(() => {
    dispatch({ type: foodsActionTypes.FETCHING });
    fetchFoods(match.params.restaurantsId)
    .then((data) =>
      dispatch({
        type: foodsActionTypes.FETCH_SUCCESS,
        payload: {
          foods: data.foods
        }
      })
    )
  }, [])

  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              {
                [...Array(12).keys()].map(i =>
                  <ItemWrapper key={i}>
                    <Skeleton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </Fragment>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key={food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={(food) => console.log(food)}
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodsList>
    </Fragment>
  )
}