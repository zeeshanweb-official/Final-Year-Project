import React, { Component } from "react";
import "./custom-style.css";
import { Grid, Row, Col, Table, Modal } from "react-bootstrap";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { NavLink } from "react-router-dom";
const axios = require("axios");

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstname: "",
        lastname: "",
        address: "",
        Phone: "",
        mobile: "",
        age: "",
        gender: "",
        disease: "",
        refferedTo: "",
        cnic: ""
      },
      Doctors: [],
      tdArray: [],
      thArray: ["CNIC", "age", "gender", "reffered To", "action"],
      file: null
    };
  }

  componentDidMount() {
    axios
      .request({
        method: "Get",
        url: `http://localhost:3004/Doctors/List`
      })
      .then(success => {
        var user = this.state.user;
        var Doctors = this.state.Doctors;
        var successNew = [];
        success.data.map(item => {
          var obj =
            item.firstname + " " + item.lastname + " (" + item._id + ")";
          successNew.push(obj);
        });
        this.state.user.refferedTo = successNew[0];
        Doctors = successNew;
        this.setState({
          Doctors,
          user
        });
      });
    axios
      .request({
        method: "Get",
        url: `http://localhost:3004/Patients/List`
      })
      .then(success => {
        success.data.map(item => {
          if (item.refferedTo) {
            item.refferedTo =
              "DR. " + item.refferedTo.firstname +" "+ item.refferedTo.lastname;
          }
        });
        var tdArray = this.state.tdArray;
        var successNew = [];
        success.data.map(item => {
          var obj = [
            item._id,
            item.firstname + " " + item.lastname,
            item.age,
            item.gender,
            item.refferedTo
          ];
          successNew.push(obj);
        });
        tdArray = successNew;
        this.setState({
          tdArray
        });
        console.log(this.state);
      });
  }
  getInitialState = () => {
    return { showModal: false };
  };
  radioChanged = e => {
    var user = this.state.user;
    if (e.target.name === "gender") {
      user.gender = e.target.value;
    } else {
      user.status = e.target.value;
    }
  };
  close = () => {
    this.setState({ showModal: false });
  };
  open = () => {
    this.setState({ showModal: true });
  };
  changeHandler = e => {
    let userinfo = this.state.user;
    userinfo[e.target.id] = e.target.value;
    this.setState({ userinfo: userinfo });
  };
  vlauechanged = e => {
    const user = this.state.user;
    user.refferedTo = e.value;
    this.setState({
      user
    });
  };
  onFormSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    formData.append("firstname", this.state.user.firstname);
    formData.append("lastname", this.state.user.lastname);
    formData.append("address", this.state.user.address);
    formData.append("Phone", this.state.user.Phone);
    formData.append("mobile", this.state.user.mobile);
    formData.append("age", this.state.user.age);
    formData.append("gender", this.state.user.gender);
    formData.append("refferedTo", this.state.user.refferedTo);
    formData.append("disease", this.state.user.disease);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post("http://localhost:3004/patients/add", formData, config)
      .then(response => {
        this.close();
        this.componentDidMount();
      })
      .catch(error => {
        console.log(error);
      });
  };
  onChange = e => {
    this.setState({ file: e.target.files[0] });
  };
  render() {
    const options = this.state.Doctors;
    const defaultOption = options[0];
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{ height: 135 + "px" }}>
              <Row>
                <Col lg={3} sm={6}>
                  <StatsCard
                    bigIcon={
                      <i className="pe-7s-graph3 on pe-7s-monitor text-warning" />
                    }
                    statsText="Total Patients"
                    statsValue={this.state.tdArray.length}
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText="Updated now"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card
                title={
                  <Row>
                    <Col
                      md={2}
                      sm={12}
                      style={{ marginTop: 15 + "px", marginBottom: 15 + "px" }}
                    >
                      <Button
                        onClick={this.open}
                        className="btn-block btn-primary"
                      >
                        Add Patient
                      </Button>
                    </Col>
                  </Row>
                }
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {this.state.thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.tdArray.length
                        ? this.state.tdArray.map((prop, key) => {
                            return (
                              <tr key={key}>
                                {prop.map((prop, key) => {
                                  return <td key={key}>{prop}</td>;
                                })}
                                <td>
                                  <NavLink
                                    to={`patient_details/${prop[0]}`}
                                    className="nav-link btn btn-success"
                                    activeClassName="active"
                                  >
                                    <i className="fa fa-user" />
                                  </NavLink>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>

        <div>
          <Modal bsSize="large" show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>
                <center>Add Doctor</center>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.onFormSubmit} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="firstname"> First Name </label>
                    <input
                      type="text"
                      onChange={this.changeHandler}
                      value={this.state.firstname}
                      required={true}
                      id="firstname"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="lastname"> Last Name </label>
                    <input
                      type="text"
                      id="lastname"
                      onChange={this.changeHandler}
                      value={this.state.lastname}
                      required={true}
                      className="form-control"
                    />
                  </div>
                </div>

                <br />
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <label htmlFor="address"> Address </label>
                    <textarea
                      rows="6"
                      type="text"
                      value={this.state.address}
                      onChange={this.changeHandler}
                      required={true}
                      id="address"
                      className="form-control"
                      placeholder="Complete Postal Address i.e house no 5 street no 6 Sarwari Road Faisalabad"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="firstname"> CNIC </label>
                    <input
                      type="text"
                      onChange={this.changeHandler}
                      value={this.state.cnic ? this.state.cnic : null}
                      required={true}
                      id="cnic"
                      className="form-control"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="Phone"> Phone </label>
                    <input
                      type="number"
                      value={this.state.Phone}
                      onChange={this.changeHandler}
                      required={true}
                      id="Phone"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="mobile"> Mobile </label>
                    <input
                      type="text"
                      id="mobile"
                      value={this.state.mobile}
                      onChange={this.changeHandler}
                      required={true}
                      className="form-control"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="specialist"> Age </label>
                    <input
                      type="text"
                      id="age"
                      value={this.state.specialist}
                      onChange={this.changeHandler}
                      required={true}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="gender"> Gender </label>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          onClick={this.radioChanged}
                          value="male"
                          name="gender"
                        />{" "}
                        Male
                      </label>
                    </div>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          onClick={this.radioChanged}
                          value="female"
                          name="gender"
                        />{" "}
                        Female
                      </label>
                    </div>
                  </div>
                </div>
                <br />

                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="disease"> disease </label>
                    <input
                      type="text"
                      value={this.state.Phone}
                      onChange={this.changeHandler}
                      required={true}
                      id="disease"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="refferedTo"> Reffered to: </label>
                    {/* <input type="text" value={this.state.Phone} onChange={this.changeHandler} required={true} id="refferedTo" className="form-control"/> */}
                    <Dropdown
                      options={options}
                      id="refferedTo"
                      value={this.state.Doctors}
                      key={options.id}
                      onChange={event => {
                        this.vlauechanged(event);
                      }}
                      value={defaultOption}
                      placeholder="Select an option"
                    />
                  </div>
                </div>
                <br />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn-success"
                type="submit"
                id="savebtn"
                onClick={this.onFormSubmit}
              >
                Save
              </Button>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default UserProfile;
