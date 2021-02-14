import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import _ from 'underscore';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PaginaLista from './PaginaLista'
import Emitter from './Emitter';

function App() {

  return (
    <div className="mb-5">
      <header>
        <h1>TODOList APP</h1>
      </header>
      <div >
        <Router>
          <ul>
            <li><Link to='cadastro' >Cadastrar</Link></li>
          </ul>

          <Switch>
            <Route exact path="/lista/:key">
              <PaginaLista emitter={Emitter} />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
