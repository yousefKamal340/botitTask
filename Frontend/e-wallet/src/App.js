import Landing from "./Components/Landing";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from "./Components/Login";
import Main from "./Components/main";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/register" component={Landing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/usersWallet" component={Main} />
      </Switch>
    </Router>
  );
}

export default App;
