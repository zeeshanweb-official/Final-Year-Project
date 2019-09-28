import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table,
  FormGroup,
  ControlLabel,
  Modal
} from "react-bootstrap";
import axios from "axios";

import { NavLink } from "react-router-dom";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import avatar from "assets/img/faces/face-3.jpg";
import { async } from "q";

class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      thArray: ["ID", "Name", "Salary", "Country", "Action"],
      thNames: ["ID", "Name", "Age", "Gender"],
      tdArray: [],
      showModal: false,
      nameSearch: "",
      PatientsModal: [],
      file: {},
      dltmodl: false
    };
  }
  componentDidMount = () => {
    axios({
      method: "post",
      url: "http://localhost:3004/Patients/patientswithdocs",
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(success => {
        //handle success
        var tdArray = this.state.tdArray;
        var successNew = [];
        success.data.map(item => {
          var obj = [
            item._id,
            item.firstname + " " + item.lastname,
            item.age,
            item.gender
          ];
          successNew.push(obj);
        });
        tdArray = successNew;
        this.setState({
          tdArray
        });
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  check = id => {
    this.state.PatientsModal.map(item => {
      if (item[0] === id) {
        this.setState({ nameSearch: item[1] });
        document.getElementById("id").value = item[0];
      }
    });
  };
  save = () => {
    let name = document.getElementById("name").value;
    let id = document.getElementById("id").value;
    if (name == " " || id == " " || name == "" || id == "") {
      this.props.handleClick(
        "tr",
        "Please input valid data, All fields are compulsory",
        "pe-7s-close",
        3
      );
    } else {
      var bodyFormData = new FormData();
      bodyFormData.append("name", name);
      bodyFormData.append("id", id);
      bodyFormData.append("myImage", this.state.file);
      axios({
        method: "post",
        url: "http://localhost:3004/Patients/UploadLabDocs",
        data: bodyFormData,
        config: { headers: { "Content-Type": "multipart/form-data" } }
      })
        .then(response => {
          //handle success
          if (response.data._id === id) {
            this.setState({ showModal: false });
            this.componentDidMount();
          }
        })
        .catch(function(response) {
          //handle error
          console.log(response);
        });
    }
  };
  changeHandler = async e => {
    var value = e.target.value;
    await this.setState({ nameSearch: value, PatientsModal: [] });
    var bodyFormData = new FormData();
    bodyFormData.append("name", this.state.nameSearch);
    await axios({
      method: "post",
      url: "http://localhost:3004/Patients/lookforon",
      data: bodyFormData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(async response => {
        //handle success
        let data = response.data;

        let PatientsModal = this.state.PatientsModal;
        await data.map(item => {
          let newtuple = [
            item._id,
            item.firstname + " " + item.lastname,
            item.age,
            item.gender
          ];
          PatientsModal.push(newtuple);
        });
        this.setState({ PatientsModal: PatientsModal });
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  open = () => {
    this.setState({ dltmodl: true });
  };
  close = () => {
    this.setState({ dltmodl: false });
  };
  render() {
    return (
      <div className="content">
        <Grid fluid>
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
                        onClick={() => {
                          this.setState({ showModal: true });
                        }}
                        className="btn-block btn-primary"
                      >
                        <i className="fa fa-plus"></i>
                        New Report
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
                                    to={`details/${prop[0]}`}
                                    className="nav-link btn btn-success"
                                    activeClassName="active"
                                  >
                                    <i className="fa fa-eye" />
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
            <Modal
              show={this.state.showModal}
              onHide={() => {
                this.setState({ showModal: false });
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  <center>
                    <i className="fa fa-plus"> </i> New Document
                  </center>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <form>
                    <Col md={6}>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={this.state.nameSearch}
                          aria-describedby="emailHelp"
                          placeholder="Enter Name"
                          onChange={this.changeHandler}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Id</label>
                        <input
                          type="text"
                          disabled
                          className="form-control"
                          id="id"
                          name="id"
                          placeholder="ID"
                        />
                      </div>
                    </Col>
                  </form>
                </Row>
                <Row>
                  <Table striped hover>
                    <thead>
                      <tr>
                        {this.state.thNames.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.PatientsModal.length
                        ? this.state.PatientsModal.map((prop, key) => {
                            return (
                              <tr key={key}>
                                {prop.map((prop, key) => {
                                  return <td key={key}>{prop}</td>;
                                })}
                                <td>
                                  <div
                                    className="btn btn-info"
                                    onClick={() => {
                                      this.check(prop[0]);
                                    }}
                                  >
                                    <i className="fa fa-check" />
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </Table>
                </Row>
                <div className="row">
                  <div className="col-md-4 col-sm-12"></div>
                  <div
                    className="col-md-2 col-sm-12"
                    style={{ marginLeft: 25 + "px" }}
                  >
                    <div
                      className="fileinputdiv"
                      onClick={() => {
                        this.fileinput.click();
                      }}
                    >
                      click here to upload files
                    </div>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      name="myImage"
                      ref={fileinput => {
                        this.fileinput = fileinput;
                      }}
                      onChange={e => {
                        this.setState({ file: e.target.files[0] });
                      }}
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="btn-success"
                  type="submit"
                  id="savebtn"
                  onClick={this.save}
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ showModal: false });
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
