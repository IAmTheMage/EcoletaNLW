import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePoint from "./pages/CreatePoint";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/create-point" exact component={CreatePoint}></Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
