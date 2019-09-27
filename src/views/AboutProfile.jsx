import React, { Component } from "react";
import { Grid, Row, Col, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Card } from "components/Card/Card.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Dropdown from "react-dropdown";
const axios = require("axios");

class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {
        image: {},
        firstname: "",
        lastname: "",
        email: "",
        status: "",
        department: "",
        designation: "",
        DOB: "",
        specialist: "",
        mobile: "",
        Phone: "",
        address: ""
      },

      department: [],
      showModal: false,
      statoptions: ["Active", "Not Active"],
      file: {},
      showmodal2: false
    };
  }
  vlauechanged2 = event => {
    let user = this.state.user;
    user.department = event.value;
    this.setState({ newdata: user });
  };
  changeHandler = e => {
    let user = this.state.user;
    user[e.target.name] = e.target.value;
    this.setState({ user });
  };
  radioHandler = e => {
    let user = this.state.user;
    user.status = e.target.id;
    this.setState({ user });
  };
  componentDidMount() {
    var id = this.props.location.pathname.split("/")[3];
    const url = "http://localhost:3004/Doctors/findOne";
    axios
      .get(url, {
        params: {
          ID: id
        }
      })
      .then(response => {
        let user = this.state.user;
        user = response.data[0];
        let date0 = new Date(response.data[0].joiningDate);
        user.joiningDate = date0.toISOString().substr(0, 10);
        if (response.data[0].image) {
          user.image = response.data[0].image.filename;
        }
        let date1 = new Date(response.data[0].DOB);
        user.DOB = date1.toISOString().substr(0, 10);
        this.setState({
          user
        });
        console.log(this.state.user);
      })
      .catch(function(error) {
        console.log(error);
      });
    axios
      .request({
        method: "Get",
        url: `http://localhost:3004/Departments/List`
      })
      .then(success => {
        var department = this.state.department;
        var successNew = [];
        success.data.map(item => {
          var obj = item.Name;
          successNew.push(obj);
        });
        department = successNew;
        this.setState({
          department
        });
      });
  }
  deleteProfile = async () => {
    var bodyFormData = new FormData();
    bodyFormData.append("id", this.state.user._id);
    const axios = require("axios");
    const qs = require("querystring");

    const requestBody = {
      id: this.state.user._id
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    axios
      .post(
        "http://localhost:3004/Doctors/delete",
        qs.stringify(requestBody),
        config
      )
      .then(result => {
        // Do somthing
        console.log(result);
        this.props.history.push("/admin/Doctors");
      })
      .catch(err => {
        // Do somthing
        console.log(err);
      });
  };
  updateData = () => {
    let FormBodyData = new FormData();
    FormBodyData.append("image", this.state.user.image);
    FormBodyData.append("firstname", this.state.user.firstname);
    FormBodyData.append("lastname", this.state.user.lastname);
    FormBodyData.append("email", this.state.user.email);
    FormBodyData.append("status", this.state.user.status);
    FormBodyData.append("department", this.state.user.department);
    FormBodyData.append("designation", this.state.user.designation);
    FormBodyData.append("DOB", this.state.user.DOB);
    FormBodyData.append("specialist", this.state.user.specialist);
    FormBodyData.append("mobile", this.state.user.mobile);
    FormBodyData.append("Phone", this.state.user.Phone);
    FormBodyData.append("address", this.state.user.address);
    FormBodyData.append("id", this.state.user._id);
    axios
      .request({
        method: "Post",
        url: `http://localhost:3004/Doctors/update`,
        data: FormBodyData
      })
      .then(success => {
        console.log(success.data);
        success.data.image = success.data.image.filename;
        this.setState({ user: success.data, showModal: false });
      });
  };
  render() {
    return (
      <div className="content">
        <Modal
          bsSize="large"
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              <i className="fa fa-edit"></i> Edit Info
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <lable htmlFor="fname">First Name:</lable>
                <input
                  type="text"
                  name="firstname"
                  id="fname"
                  className="form-control"
                  value={this.state.user.firstname}
                  onChange={this.changeHandler}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="lname">Last Name:</lable>
                <input
                  type="text"
                  name="lastname"
                  id="lname"
                  className="form-control"
                  value={this.state.user.lastname}
                  onChange={this.changeHandler}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="email">Email:</lable>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={this.state.user.email}
                  onChange={this.changeHandler}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={4}>
                <lable htmlFor="desg">Designation:</lable>
                <input
                  type="text"
                  name="designation"
                  id="desg"
                  className="form-control"
                  value={this.state.user.designation}
                  onChange={this.changeHandler}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="join">Joining Date:</lable>
                <input
                  disabled
                  type="date"
                  name="join"
                  id="join"
                  className="form-control"
                  value={this.state.user.joiningDate}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="dob">Date of Birth:</lable>
                <input
                  type="date"
                  name="DOB"
                  id="dob"
                  className="form-control"
                  value={this.state.user.DOB}
                  onChange={this.changeHandler}
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={4}>
                <lable htmlFor="Speciality">Speciality:</lable>

                <input
                  type="text"
                  name="specialist"
                  id="Speciality"
                  className="form-control"
                  value={this.state.user.specialist}
                  onChange={this.changeHandler}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="gender">Gender:</lable>
                <input
                  disabled
                  type="text"
                  name="gender"
                  id="gender"
                  className="form-control"
                  value={this.state.user.gender}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="Speciality">Phone:</lable>

                <input
                  type="text"
                  name="Phone"
                  id="phone"
                  className="form-control"
                  value={this.state.user.Phone}
                  onChange={this.changeHandler}
                />
              </Col>
            </Row>
            <br />

            <br />
            <Row>
              <Col md={4}>
                <lable htmlFor="Speciality">Mobile:</lable>

                <input
                  type="text"
                  name="mobile"
                  id="Mobile"
                  className="form-control"
                  value={this.state.user.mobile}
                  onChange={this.changeHandler}
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="department">Department:</lable>

                <Dropdown
                  options={this.state.department}
                  id="department"
                  value={this.state.user.department}
                  onChange={event => {
                    this.vlauechanged2(event);
                  }}
                  placeholder="Select an option"
                />
              </Col>
              <Col md={4}>
                <lable htmlFor="address">Address:</lable>

                <textarea
                  type="text"
                  name="address"
                  id="adrs"
                  className="form-control"
                  value={this.state.user.address}
                  onChange={this.changeHandler}
                  rows="2"
                  cols="3"
                ></textarea>
              </Col>
            </Row>
            <br />

            <div className="row">
              <div className="col-md-4 col-sm-12" style={{ padding: 0 + "px" }}>
                <div
                  className="fileinputdiv"
                  style={{ marginLeft: 17 + "px" }}
                  onClick={() => {
                    this.fileinput.click();
                  }}
                >
                  <img
                    src={
                      `http://localhost:3004/images/` + this.state.user.image
                    }
                    alt="bgimage"
                    style={{ width: 114 + "px", height: 94 + "px" }}
                  />
                </div>
                <input
                  style={{ display: "none" }}
                  type="file"
                  name="myImage"
                  ref={fileinput => {
                    this.fileinput = fileinput;
                  }}
                  onChange={e => {
                    let user = this.state.user;
                    user.image = e.target.files[0];
                    this.setState({ user });
                  }}
                />
              </div>
              <div className="col-md-4 col-sm-12">
                <lable htmlFor="status">Status:</lable>
                <input
                  type="radio"
                  name="status"
                  checked={this.state.user.status === "active"}
                  id="active"
                  onChange={this.radioHandler}
                />
                Active
                <input
                  type="radio"
                  name="status"
                  checked={this.state.user.status === "inactive"}
                  id="inactive"
                  onChange={this.radioHandler}
                />
                Not Active
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button fill onClick={this.updateData} bsStyle="success">
              <i className="fa fa-check" aria-hidden="true"></i>
              Save Changes
            </Button>
            <Button
              bsStyle="danger"
              fill
              onClick={() => {
                this.setState({ showModal: false });
              }}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title={
                  this.state.user.firstname + " " + this.state.user.lastname
                }
                content={
                  <form>
                    <div className="row">
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="firstname">
                          First Name:
                        </label>
                        <strong id="firstname">
                          {this.state.user.firstname}
                        </strong>
                      </div>
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="lastname">
                          Last Name:
                        </label>
                        <strong id="lastname">
                          {this.state.user.lastname}
                        </strong>
                      </div>
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="status">
                          Status:
                        </label>
                        <strong id="status">{this.state.user.status}</strong>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="dept">
                          Department:
                        </label>
                        <strong id="dept">{this.state.user.department}</strong>
                      </div>
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="desig">
                          Designation:
                        </label>
                        <strong id="desig">
                          {this.state.user.designation}
                        </strong>
                      </div>
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="dob">
                          Date Of Birth:
                        </label>
                        <strong id="dob">{this.state.user.DOB}</strong>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <label
                          style={{ display: "block" }}
                          htmlFor="Specialist"
                        >
                          Specialist of:
                        </label>
                        <strong id="Specialist">
                          {this.state.user.specialist}
                        </strong>
                      </div>
                      <div className="col-md-4" id="address">
                        <label style={{ display: "block" }} htmlFor="gender">
                          Gender:
                        </label>
                        <strong id="gender">{this.state.user.gender}</strong>
                      </div>
                      <div className="col-md-4">
                        <label style={{ display: "block" }} htmlFor="joindate">
                          Joining Date:
                        </label>
                        <strong id="joindate">
                          {this.state.user.joiningDate}
                        </strong>
                      </div>
                    </div>
                    <Row>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="mobile">
                          Mobile:
                        </label>
                        <strong id="mobile">{this.state.user.mobile}</strong>
                      </Col>
                      <Col md={4}>
                        <label style={{ display: "block" }} htmlFor="phone">
                          Phone:
                        </label>
                        <strong id="phone">{this.state.user.Phone}</strong>
                      </Col>
                    </Row>
                    <div className="row">
                      <div className="col-md-12">
                        <label style={{ display: "block" }} htmlFor="address">
                          Address:
                        </label>
                        <strong id="address">{this.state.user.address}</strong>
                      </div>
                    </div>
                    <Button
                      bsStyle="warning"
                      fill
                      onClick={() => {
                        this.setState({ showmodal2: true });
                      }}
                    >
                      <i className="fa fa-user-times"></i>
                      Delete My Profile
                    </Button>

                    <Button
                      bsStyle="info"
                      pullRight
                      fill
                      onClick={() => {
                        this.setState({ showModal: true });
                      }}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                      Edit Profile
                    </Button>

                    <div className="clearfix" />
                    <Modal
                      show={this.state.showmodal2}
                      onHide={() => {
                        this.setState({ showmodal2: false });
                      }}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          {" "}
                          <i className="fa fa-trash"></i>
                          Confirm Delete Profile
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <h6>Are You Sure You wanna Delete This Profile</h6>
                        <p>
                          Be Aware that the Profile of{" "}
                          {this.state.user.firstname +
                            " " +
                            this.state.user.lastname +
                            " "}
                          will not be accessible from any resource.
                        </p>
                        <p>
                          And{" "}
                          {this.state.user.firstname +
                            " " +
                            this.state.user.lastname +
                            " "}
                          will not be able to Log In.
                        </p>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          bsStyle="success"
                          fill
                          onClick={() => {
                            this.setState({ showmodal2: false });
                          }}
                        >
                          <i className="fa fa-times-circle"></i>
                          Cancel
                        </Button>
                        <Button
                          bsStyle="warning"
                          fill
                          onClick={
                            this.deleteProfile
                            // () => {
                            // this.setState({ showmodal2: false });
                            // }
                          }
                        >
                          <i className="fa fa-check-circle"></i>
                          Continue
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <UserCard
                bgImage={
                  `http://localhost:3004/images/` + this.state.user.image
                }
                avatar={`http://localhost:3004/images/` + this.state.user.image}
                name={this.state.user.email}
                userName={
                  this.state.user.firstname + " " + this.state.user.lastname
                }
                description={<span></span>}
                socials={
                  <div>
                    {/* <Button simple>
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-google-plus-square" />
                    </Button> */}
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
