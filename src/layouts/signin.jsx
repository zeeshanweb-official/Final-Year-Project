import React from "react";
import "./style.css";
import axios from "axios";
import Dropdown from "react-dropdown";
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {
        email: "",
        password: "",
        useras: "Doctor"
      },
      forgetemail: "",
      formErrors: {
        emailerr: "",
        passerr: ""
      }
    };
  }
  componentDidMount = () => {
    if (localStorage.userloggedin) {
      this.props.history.push("/admin/dashboard");
    }
  };
  validate = () => {
    let formErrors = this.state.formErrors;
    if (!this.state.user.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      formErrors.emailerr = "Not A Valid Email";
    } else {
      formErrors.emailerr = "";
      this.setState({ formErrors });
    }
    if (!this.state.user.password.length > 0) {
      formErrors.passerr = "Cannot Be empty";
    } else {
      formErrors.passerr = "";
      this.setState({ formErrors });
    }
    if (formErrors.emailerr || formErrors.passerr) {
      this.setState({ formErrors });
      return false;
    } else {
      formErrors.emailerr = "";
      formErrors.passerr = "";
      this.setState({ formErrors });
      return true;
    }
  };
  btnclicked = event => {
    event.preventDefault();
    let test = this.validate();
    if (test) {
      axios({
        method: "post",
        url: "http://localhost:3004/login",
        data: this.state.user,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      })
        .then(response => {
          console.log(response);
          //handle success
          if (response.data.email === this.state.user.email) {
            localStorage.setItem("userloggedin", JSON.stringify(response.data));
            this.props.history.push("/admin/dashboard");
          }
        })
        .catch(response => {
          //handle error
          console.log(response);
        });
    } else {
      console.log("not good to go");
    }
  };
  vlauechanged = e => {
    let user = this.state.user;
    user.useras = e.value;
    this.setState({
      user
    });
  };
  change = e => {
    let state = this.state.user;
    state[e.target.name] = e.target.value;
    this.setState({ state });
  };
  render() {
    const options = ["Doctor", "Admin"];
    const defaultOption = options[0];
    return (
      <div className="loginpage">
        <div className="form">
          <h3>Login Details</h3>
          <form className="login-form">
            <input
              type="text"
              onChange={this.change}
              value={this.state.user.email}
              placeholder="email"
              name="email"
            />
            <div style={{ color: "red", fontSize: 12 }}>
              {this.state.formErrors.emailerr}
            </div>
            <input
              type="password"
              value={this.state.user.password}
              placeholder="password"
              onChange={this.change}
              name="password"
            />
            <div style={{ color: "red", fontSize: 12 }}>
              {this.state.formErrors.passerr}
            </div>
            <Dropdown
              options={options}
              id="useras"
              value={this.state.useras}
              onChange={event => {
                this.vlauechanged(event);
              }}
              value={defaultOption}
              placeholder="Select an option"
            />
            <button style={{ marginTop: 10 }} onClick={this.btnclicked}>
              login
            </button>
            <div className="forget">
              <a>forgot your credentials???</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default App;
