import 'bootstrap/dist/css/bootstrap.css'
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom"
import './App.css'
import PageHome from './pages/PageHome'
import PageList from './pages/PageList'

function App() {

  return (
    <div >
      <Router>
        <Switch>
          <Route exact path="/list/key/:key" component={PageList} />
          <Route exact path="/list/key/" component={PageList} />
          <Route path="*" component={PageHome} />
        </Switch>
      </Router>
    </div>
  );
}

export default App
