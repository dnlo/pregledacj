import { Component } from "inferno";
import Logo from "./logo";
import "./tachyons.min.css";
import "./trunc.css";
import Select from "./Select";
import Home from "./Home";
import { BrowserRouter, Route, Switch, Link } from "inferno-router";
import feeds from "./feeds";

class App extends Component {
  selectFeed = () => {
    this.forceUpdate()
  }
  render() {
    let selectedFeeds = Object.keys(window.localStorage);
    return (
      <BrowserRouter>
        <div className="App">
          <header className="items-center flex shadow-2">
            <Logo height="80px" />
              <Link className="mh3 f2 b underline-hover link near-black" to="/">
                pregledacj
              </Link>
            <Link
              className="mr3 ph3 pv2 mt2 pointer br-pill ba link blue grow outline-0"
              to="/birkaj"
            >
              birkaj
            </Link>
            <Link
              className="ph3 pv2 mt2 pointer br-pill ba link blue grow outline-0"
              to="/"
            >
              citkaj
            </Link>
          </header>
          <div>
            <Switch>
              <Route
                exact
                path="/"
                component={props => (
                  <Home
                    {...props}
                    selectedFeeds={selectedFeeds}
                    feeds={feeds}
                  />
                )}
              />
              <Route
                path="/birkaj"
                render={props => (
                  <Select
                    {...props}
                    selectedFeeds={selectedFeeds}
                    feeds={feeds}
                    selectFeedHandler={this.selectFeed}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
