import React from "react";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";

// import { TransitionGroup, CSSTransition } from "react-transition-group";
import Starter from "./views/Starter";
import Editor from "./views/Editor";

const Router: React.FC = () => {
  // const location = useLocation();
  return (
    <BrowserRouter>
      <Switch>
        <HashRouter>
          {/* <TransitionGroup>
            <CSSTransition key={location.key} classNames="fade" timeout={300}> */}
          <Route exact path="/" component={Starter}></Route>
          {/* pid 为 projectId，为 nedb 中的 _id */}
          <Route exact path="/editor/:pid" component={Editor}></Route>
          {/* </CSSTransition>
          </TransitionGroup> */}
        </HashRouter>
      </Switch>
    </BrowserRouter>
  );
};
export default Router;
