import React from "react";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";

// import { TransitionGroup, CSSTransition } from "react-transition-group";
import Starter from "./views/Starter";
import Editor from "./views/Editor";
import Test from "./views/Test";

const Router: React.FC = () => {
  // const location = useLocation();
  return (
    <BrowserRouter>
      <Switch>
        <HashRouter>
          {/* <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}> */}
          <Route exact path="/" component={Starter}></Route>
          {/* uuid 为 project.uuid */}
          <Route exact path="/editor/:uuid" component={Editor}></Route>
          <Route exact path="/test" component={Test} />
          {/* </CSSTransition>
          </TransitionGroup> */}
        </HashRouter>
      </Switch>
    </BrowserRouter>
  );
};
export default Router;
