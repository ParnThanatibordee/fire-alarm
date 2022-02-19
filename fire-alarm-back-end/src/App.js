import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DashBoard from './components/DashBoard';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="*" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
