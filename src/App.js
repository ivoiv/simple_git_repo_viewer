import React, { Component } from 'react';
import './App.css';
import {FrontpageContainer} from './containers'
import { Redirect } from 'react-router-dom'
import {Route, Switch} from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import {history} from './store'

/*********************************
 * Main App
*********************************/

class App extends Component {

    //Redirects to first page
  redirectToFirstPage(){
    return <Redirect to='/frontpage/page/1' />
  }

  render() {
    return (
      <ConnectedRouter history={history}> 
        <Switch>
          {/* If address field is correct, route to relevant page*/}
          <Route exact path='/frontpage/page/:number' component={FrontpageContainer}/>

          {/* If address field is incorrect, redirect automtailly to first of repositories*/}
          <Route path='/' component={this.redirectToFirstPage}/>
        </Switch>
      </ConnectedRouter>  
    );
  }
}

export default App;
