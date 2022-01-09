import React from "react";
import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";

// import type { TransitionGroup, CSSTransition } from "react-transition-group";
import Starter from "./views/project-manager/index";
import CreateProject from "./views/CreateProject";
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
          <Route exact path="/starter" component={Starter}></Route>
          <Route exact path="/create-project" component={CreateProject}></Route>
          {/* uuid 为 project.uuid */}
          <Route exact path="/project-editor/:uuid" component={Editor}></Route>
          <Route exact path="/test" component={Test} />
          {/* </CSSTransition>
          </TransitionGroup> */}
        </HashRouter>
      </Switch>
    </BrowserRouter>
  );
};
export default Router;
