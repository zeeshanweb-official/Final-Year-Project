import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Modal
} from "react-bootstrap";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import avatar from "assets/img/faces/face-3.jpg";
import "./cust_style.css";
import "./custscript";
const axios = require("axios");
class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {},
      patient: {},
      Doctors: [],
      showDelet: false,
      showUpdate: false,
      picModal: false,
      currentfile: null
    };
  }
  handleClose = e => {
    if (e) {
      e.preventDefault();
      this.setState({ showDelet: false });
    } else {
      this.setState({ showDelet: false });
    }
  };
  handleCloseUpdate = e => {
    if (e) {
      e.preventDefault();
      this.setState({ showUpdate: false });
    } else {
      this.setState({ showUpdate: false });
    }
  };
  componentDidMount = () => {
    var id = this.props.location.pathname.split("/")[3];
    let url = "http://localhost:3004/Patients/details";
    axios
      .get(url, {
        params: {
          ID: id
        }
      })
      .then(response => {
        //handle success
        let user = this.state.user;
        user = response.data[0];
        if (response.data[0].refferedTo) {
          user.refferedto =
            "Doctor " +
            response.data[0].refferedTo.firstname +
            " " +
            response.data[0].refferedTo.lastname;
        }
        this.setState({ user });
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
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
        user.refferedTo = successNew;
        Doctors = successNew;
        this.setState({
          Doctors,
          user
        });
      });
  };
  deleteProfile = () => {
    let id = this.state.user._id;
    axios({
      method: "post",
      url: "http://localhost:3004/Patients/delete",
      data: { id: id },
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        //handle success
        this.handleClose();
        this.props.history.push("/admin/patients");
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  updateProfile = () => {
    axios({
      method: "post",
      url: "http://localhost:3004/Patients/update",
      data: this.state.user,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        console.log(response);
        //handle success
        this.handleCloseUpdate();
        this.componentDidMount();
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  valueChanged = e => {
    let user = this.state.user;
    user.refferedTo = e.value;
    this.setState({ user });
  };
  textValueChanged = e => {
    let user = this.state.user;
    user[e.target.name] = e.target.value;
    this.setState({ user });
  };
  picmodalOpener = e => {
    var str = e.target.src;
    var arr = str.split("/");
    let currentfile = arr[arr.length - 1];
    this.setState({ picModal: true, currentfile });
  };
  picmodalCloser = () => {
    console.log(this.state);
    this.setState({ picModal: false });
  };
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title={
                  this.state.user
                    ? this.state.user.firstname + " " + this.state.user.lastname
                    : "Patient Details"
                }
                content={
                  <form>
                    <Row>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="firstname">
                          First Name:
                        </label>
                        <strong id="firstname">
                          {this.state.user
                            ? this.state.user.firstname
                            : "First Name"}
                        </strong>
                      </Col>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="lastname">
                          Last Name:
                        </label>
                        <strong id="lastname">
                          {this.state.user
                            ? this.state.user.lastname
                            : "Last Name"}
                        </strong>
                      </Col>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="age">
                          Age:
                        </label>
                        <strong id="age">
                          {this.state.user ? this.state.user.age : "Age"}
                        </strong>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="mobile">
                          Mobile
                        </label>
                        <strong id="mobile">
                          {this.state.user
                            ? this.state.user.mobile
                            : "mobile Number"}
                        </strong>
                      </Col>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="disease">
                          Disease:
                        </label>
                        <strong id="disease">
                          {this.state.user
                            ? this.state.user.disease
                            : "disease"}
                        </strong>
                      </Col>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="gender">
                          Gender:
                        </label>
                        <strong id="gender">
                          {this.state.user ? this.state.user.gender : "Gender"}
                        </strong>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <label style={{ display: "block" }} htmlFor="address">
                          Address:
                        </label>
                        <strong id="address">
                          {this.state.user
                            ? this.state.user.address
                            : "Address"}
                        </strong>
                      </Col>
                      <Col md={6}>
                        <label
                          style={{ display: "block" }}
                          htmlFor="refferedto"
                        >
                          Reffered To:
                        </label>
                        <strong id="refferedto">
                          {this.state.user
                            ? this.state.user.refferedto
                            : "Refferal Doctor Profile Unavailable"}
                        </strong>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <label style={{ display: "block" }} htmlFor="firstname">
                          Prescription:
                        </label>
                        <strong id="firstname">
                          {this.state.user
                            ? this.state.user.medicines
                            : "Medicinces"}
                        </strong>
                      </Col>
                    </Row>

                    <Button
                      bsStyle="danger"
                      pullleft="true"
                      fill
                      type="submit"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ showDelet: true });
                      }}
                    >
                      <i className="fa fa-user-times"></i>
                      Delete Patient
                    </Button>

                    <Button
                      bsStyle="info"
                      pullRight
                      fill
                      type="submit"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ showUpdate: true });
                      }}
                    >
                      <i className="fa fa-pencil"></i>
                      Update Patient
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Modal show={this.state.showDelet} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="fa fa-trash"></i>
                  Confirm Delete Patient Record
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-capitalize">
                <p></p>
                <p className="font-weight-bold">
                  {" "}
                  are you sure about delete this patient's record???
                </p>
                <p className="font-weight-normal">
                  Keep in mind no one can see this profile again
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="success" fill onClick={this.handleClose}>
                  <i className="fa fa-times-circle"></i>
                  Cancel
                </Button>
                <Button bsStyle="warning" fill onClick={this.deleteProfile}>
                  <i className="fa fa-check-circle"></i>
                  Continue
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.showUpdate} onHide={this.handleCloseUpdate}>
              <Modal.Header closeButton>
                <Modal.Title>
                  <i className="fa fa-edit"></i>
                  Update Patient Data
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Form>
                    <Col md={6}>
                      <FormGroup controlId="firstName">
                        <ControlLabel>First Name:</ControlLabel>
                        <FormControl
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                          onChange={this.textValueChanged}
                          value={this.state.user.firstname}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup controlId="lastName">
                        <ControlLabel>Last Name:</ControlLabel>
                        <FormControl
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                          onChange={this.textValueChanged}
                          value={this.state.user.lastname}
                        />
                      </FormGroup>
                    </Col>
                  </Form>
                </Row>
                <Row>
                  <Form>
                    <Col md={6}>
                      <FormGroup controlId="disease">
                        <ControlLabel>Disease:</ControlLabel>
                        <FormControl
                          type="text"
                          name="disease"
                          onChange={this.textValueChanged}
                          placeholder="diesease"
                          value={this.state.user.disease}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup controlId="Mobile">
                        <ControlLabel>Mobile:</ControlLabel>
                        <FormControl
                          type="text"
                          name="mobile"
                          onChange={this.textValueChanged}
                          placeholder="Mobile #"
                          value={this.state.user.mobile}
                        />
                      </FormGroup>
                    </Col>
                  </Form>
                </Row>
                <Row>
                  <Form>
                    <Col md={6}>
                      <FormGroup controlId="age">
                        <ControlLabel>Age:</ControlLabel>
                        <FormControl
                          type="number"
                          placeholder="age"
                          name="age"
                          onChange={this.textValueChanged}
                          value={this.state.user.age}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup controlId="address">
                        <ControlLabel>Address:</ControlLabel>
                        <FormControl
                          type="text"
                          name="address"
                          onChange={this.textValueChanged}
                          placeholder="Home Address"
                          value={this.state.user.address}
                        />
                      </FormGroup>
                    </Col>
                  </Form>
                </Row>
                <Row>
                  <Form>
                    <Col md={12}>
                      <FormGroup controlId="Mobile">
                        <ControlLabel>Reffered To:</ControlLabel>
                        <Dropdown
                          options={this.state.Doctors}
                          id="refferedTo"
                          key={this.state.Doctors.id}
                          onChange={this.valueChanged}
                          value={this.state.user.refferedto}
                          placeholder="Select an option"
                        />
                      </FormGroup>
                    </Col>
                  </Form>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup controlId="medicines">
                      <ControlLabel>Prescription:</ControlLabel>
                      <FormControl
                        type="text"
                        name="medicines"
                        onChange={this.textValueChanged}
                        placeholder="Prescription for Cure"
                        value={this.state.user.medicines}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="danger" fill onClick={this.handleCloseUpdate}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                  Close
                </Button>

                <Button fill onClick={this.updateProfile} bsStyle="success">
                  <i className="fa fa-check" aria-hidden="true"></i>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.picModal} onHide={this.picmodalCloser}>
              <Modal.Header closeButton>
                <Modal.Title>View Documents</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.currentfile ? (
                  <Col>
                    <img
                      style={{
                        width: 70 + "%",
                        marginLeft: 85 + "px",
                        height: 400 + "px",
                        marginBottom: 30 + "px"
                      }}
                      src={
                        `http://localhost:3004/extrafiles/` +
                        this.state.currentfile
                      }
                      alt="file"
                    />
                  </Col>
                ) : (
                  ""
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  fill
                  varient="secondary"
                  fill
                  onClick={this.picmodalCloser}
                >
                  <i className="fa fa-times"></i>
                  Close
                </Button>
                {this.state.file ? (
                  <Button bsStyle="primary" fill onClick={this.fileUploader}>
                    <i className="fa fa-upload"></i>
                    Upload File
                  </Button>
                ) : (
                  ""
                )}
              </Modal.Footer>
            </Modal>
            <Col md={4}>
              <Card
                title="Documents Attached"
                content={
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "space-around"
                    }}
                  >
                    {this.state.user.extraFiles
                      ? this.state.user.extraFiles.map((item, index) => {
                          return (
                            <Col key={item} className="pointer">
                              <img
                                onClick={this.picmodalOpener}
                                style={{
                                  width: 100 + "px",
                                  height: 100 + "px",
                                  marginBottom: 30 + "px"
                                }}
                                src={`http://localhost:3004/extrafiles/` + item}
                                alt="files"
                              />
                            </Col>
                          );
                        })
                      : ""}
                  </Row>
                }
              ></Card>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
