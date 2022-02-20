import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import DashBoard from "./components/DashBoard"
import { useEffect } from "react"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" component={DashBoard} />
        <Route exact path="*" component={Redirect} />
      </Switch>
    </Router>
  )
}

const Redirect = () => {
  useEffect(() => {
    window.location.replace("/login")
  }, [])

  return <div></div>
}

export default App
