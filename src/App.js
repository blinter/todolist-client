import 'bootstrap/dist/css/bootstrap.css'
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom"
import './App.css'
import PageHome from './pages/PageHome'
import PageList2 from './pages/PageList2'
import PageNewList from './pages/PageNewList'

function App() {

  return (
    <div >
      <Router>
        <Switch>
          <Route exact path="/list/key/:key" component={PageList2} />
          <Route exact path="/list/new" component={PageNewList} />
          <Route path="*" component={PageHome} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
