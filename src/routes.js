import Dashboard from "views/Dashboard.jsx";
import Doctors from "views/Doctors.jsx";
import Patients from "views/Patients";
import Appointments from "views/Appoinments.jsx";
import Applications from "views/Applications.jsx";
import Departments from "views/Departments.jsx";
import Notifications from "views/Notifications.jsx";
import DoctorsDetails from "views/AboutProfile.jsx";
import EditDetails from "views/editProfile";
import LabResults from "views/labresults";
import Pharmacy from "views/pharmacy";
import Reports from "views/reports";
import Documents from "views/documents";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
    id: "dashboard"
  },
  {
    path: "/Doctors",
    name: "Doctors",
    icon: "pe-7s-user",
    component: Doctors,
    layout: "/admin",
    id: "Doctors"
  },
  {
    path: "/patients",
    name: "Patients",
    icon: "pe-7s-note2",
    component: Patients,
    layout: "/admin",
    id: "Patients"
  },
  {
    path: "/Appointments",
    name: "Appointments",
    icon: "pe-7s-news-paper",
    component: Appointments,
    layout: "/admin",
    id: "Appointments"
  },
  {
    path: "/Departments",
    name: "Departments",
    icon: "pe-7s-map-marker",
    component: Departments,
    layout: "/admin",
    id: "Departments"
  },
  {
    path: "/Applications",
    name: "Applications",
    icon: "pe-7s-science",
    component: Applications,
    layout: "/admin",
    id: "Applications"
  },

  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    layout: "/admin",
    invisible: true,
    id: "notifications"
  },
  {
    path: "/details/:id",
    name: "Profile Details",
    component: DoctorsDetails,
    layout: "/admin",
    invisible: true,
    id: "profiledetails"
  },
  {
    path: "/patient_details/:id",
    name: "edit Details",
    component: EditDetails,
    layout: "/admin",
    invisible: true,
    id: "editDets"
  },
  {
    path: "/labresults",
    name: "lab results",
    component: LabResults,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/pharmacy",
    name: "Pharmacy Management",
    component: Pharmacy,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/documents",
    name: "Documents",
    component: Documents,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/reports",
    name: "reports",
    component: Reports,
    layout: "/admin",
    invisible: true
  }
];

export default dashboardRoutes;
