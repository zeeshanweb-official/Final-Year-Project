import Patients from "views/Patients";
import Appointments from "views/Appoinments.jsx";
import Departments from "views/Departments.jsx";
import EditDetails from "views/editProfile";
import React from "react";

class Header extends React.Component {
  render() {
    return (
      <div>
        <h1>Header</h1>
      </div>
    );
  }
}
class Content extends React.Component {
  render() {
    return (
      <div>
        <h2>Content</h2>
        <p>The content text!!!</p>
      </div>
    );
  }
}
const doctorRoutes = [
  {
    path: "/patients",
    name: "Patients",
    icon: "pe-7s-note2",
    component: Content,
    layout: "/doctor",
    id: "Patients"
  },
  {
    path: "/Appointments",
    name: "Appointments",
    icon: "pe-7s-news-paper",
    component: Header,
    layout: "/doctor",
    id: "Appointments"
  },
  {
    path: "/Departments",
    name: "Departments",
    icon: "pe-7s-map-marker",
    component: Departments,
    layout: "/doctor",
    id: "Departments"
  },
  // {
  //   path: "/details/:id",
  //   name: "Profile Details",
  //   component: DoctorsDetails,
  //   layout: "/admin",
  //   invisible: true,
  //   id: "profiledetails"
  // },
  {
    path: "/editDetails/:id",
    name: "edit Details",
    component: EditDetails,
    layout: "/doctor",
    invisible: true,
    id: "editDets"
  }
];

export default doctorRoutes;
