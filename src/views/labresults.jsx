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
import "./style.css";

class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      thArray: ["Name", "Age", "Gender", "CNIC", "Action"],
      thNames: ["ID", "Name", "Age", "Gender"],
      tdArray: [],
      docname: "",
      showModal: false,
      nameSearch: "",
      PatientsModal: [],
      file: {},
      dltmodl: false,
      viewmodl: false,
      current: {}
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
            item.gender,
            item.cnic
          ];
          successNew.push(obj);
        });
        tdArray = successNew;
        this.setState({
          tdArray,
          fulldata: JSON.stringify(success.data)
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
      bodyFormData.append(this.state.docname, this.state.file);
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

  openviewer = e => {
    let data = this.state.fulldata;
    data = JSON.parse(data);
    data.map(item => {
      if (item._id === e.target.id) {
        this.setState({ current: item, viewmodl: true });
      }
    });
  };
  closeViewer = () => {
    this.setState({ viewmodl: false });
  };
  docnamechanger = e => {
    this.setState({ docname: e.target.value });
  };
  filevalidator = e => {
    let type = e.target.files[0].type;
    if (type == "image/jpeg" || type == "image/jpg" || type == "image/png") {
      this.setState({ file: e.target.files[0] });
    } else {
      this.props.handleClick(
        "tr",
        "Please input valid data, Only jpg, jpeg, png files are Allowed",
        "pe-7s-close",
        3
      );
    }
  };
  dltpic = (item, file) => {
    this.state.current.extraFiles.map(itm => {
      if (itm === item) {
        console.log(itm, item, this.state.current._id);
        axios({
          method: "post",
          url: "http://localhost:3004/Patients/DeleteLabDocs",
          data: { file: item, patient: this.state.current._id },
          config: { headers: { "Content-Type": "multipart/form-data" } }
        })
          .then(response => {
            //handle success
            this.props.handleClick(
              "tr",
              "File Deleted Successfully",
              "pe-7s-close",
              3
            );
            this.componentDidMount();
            this.closeViewer();
          })
          .catch(function(response) {
            //handle error
            console.log(response);
          });
      }
    });
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
                        New File
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
                                {prop.map((item, index) => {
                                  if (!(index == 0)) {
                                    return <td key={index}>{item}</td>;
                                  } else {
                                    return true;
                                  }
                                })}
                                <td>
                                  <Button
                                    id={prop[0]}
                                    className="nav-link btn btn-success"
                                    onClick={this.openviewer}
                                  >
                                    <i id={prop[0]} className="fa fa-eye" />
                                  </Button>
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
                      accept="image/*"
                      onChange={this.filevalidator}
                    />
                  </div>
                </div>
                <Row>
                  <Col md={12}>
                    <div className="form-group">
                      <label htmlFor="docname">Document Name :</label>
                      <input
                        type="text"
                        className="form-control"
                        onChange={this.docnamechanger}
                        name="docname"
                        id="docname"
                        placeholder="Document Name"
                      />
                    </div>
                  </Col>
                </Row>
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
        <Modal
          show={this.state.viewmodl}
          onHide={this.closeViewer}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>View Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.current.extraFiles
              ? this.state.current.extraFiles.map((item, index) => {
                  console.log(item);
                  if (item) {
                    let name = Object.keys(item);
                    let file = Object.values(item);

                    var res = file[0].split(".");
                    if (
                      res[res.length - 1] === "png" ||
                      res[res.length - 1] === "PNG" ||
                      res[res.length - 1] === "jpg" ||
                      res[res.length - 1] === "jpeg" ||
                      res[res.length - 1] === "JPG" ||
                      res[res.length - 1] === "JPEG"
                    ) {
                      return (
                        <div key={index}>
                          <figure className="figure">
                            <img
                              src={
                                `http://localhost:3004/extrafiles/` + file[0]
                              }
                              style={{ width: 100 + "%" }}
                              className="figure-img img-fluid rounded"
                              alt="A generic square placeholder image with rounded corners in a figure."
                            />

                            <figcaption className="figure-caption">
                              <p>
                                type: <strong>{name}</strong>
                              </p>
                              <p>{file[0]}</p>
                              <div
                                className="deleter"
                                onClick={() => {
                                  this.dltpic(item, file);
                                }}
                              >
                                <i className="fa fa-times"></i>
                                <strong>Delete File</strong>
                              </div>
                            </figcaption>
                          </figure>
                        </div>
                      );
                    }
                  }
                })
              : ""}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeViewer}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.updateDoc}
          onHide={this.closeupdt}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>View Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeupdt}>
              Close
            </Button>
            <Button variant="primary" onClick={this.closeupdt}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default UserProfile;
