import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from './components/Login';
import SignUp from './components/SignUp';
import DashBoard from './components/DashBoard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
      </Switch>
      <Switch>
        <Route exact path="/signup" component={SignUp} />
      </Switch>
      <Switch>
        <Route exact path="/dashboard" component={DashBoard} />
      </Switch>
    </Router>
  );
}

export default App;
