import React from "react";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";

// import { TransitionGroup, CSSTransition } from "react-transition-group";
import Starter from "./views/Starter";

const Router: React.FC = () => {
  // const location = useLocation();
  return (
    <BrowserRouter>
      <Switch>
        <HashRouter>
          {/* <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}> */}
          {/* <Route exact path="/editor" component={EditorPage}></Route> */}
          <Route exact path="/" component={Starter}></Route>
          {/* </CSSTransition>
          </TransitionGroup> */}
        </HashRouter>
      </Switch>
    </BrowserRouter>
  );
};
export default Router;
