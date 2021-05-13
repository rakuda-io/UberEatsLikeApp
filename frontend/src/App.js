import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';

// components
import { Restaurants } from './containers/Restaurants.jsx'
import { Foods } from './containers/Foods.jsx'
import { Orders } from './containers/Orders.jsx'

function App() {
  return (
    <Router>
      <Switch>
        // 店舗一覧ページ
        <Route
         exact
         path="/restaurants">
           <Restaurants />
        </Route>
        // フード一覧ページ
        <Route
         exact
         path="/foods">
           <Foods />
        </Route>
        // 注文ページ
        <Route
         exact
         path="/orders">
           <Orders />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
