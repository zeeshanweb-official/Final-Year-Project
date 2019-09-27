import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import DoctorsDetails from "views/Doctors-Details.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

import AdminLayout from "layouts/Admin.jsx";
import AdminLayout2 from "layouts/signin";
function DoAthing() {}
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route
        path="/admin"
        render={props => <AdminLayout v={DoAthing} {...props} />}
      />

      <Route
        path="/signin"
        render={props => <AdminLayout2 v={DoAthing} {...props} />}
      />
      <Redirect from="/" to="/signin" />
      <Redirect from="/admin" to="/admin/dashboard" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
