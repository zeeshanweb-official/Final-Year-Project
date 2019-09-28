import React, { Component } from "react";
import "./custom-style.css";
import { Grid, Row, Col, Table, Modal } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import Dropzone from "react-dropzone";
import { NavLink } from "react-router-dom";
const axios = require("axios");
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        depName: "",
        desc: "",
        HODName: "",
        status: "active"
      },
      tabledata: [],
      dltmodl: false,
      thArray: ["Id", "Name", "Description", "HOD", "", "Action"],
      dltitem: null
    };
  }
  // MyDropzone=()=> {
  //   const onDrop = useCallback(acceptedFiles => {

  //   }, [])
  //   const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  // }

  componentDidMount() {
    axios
      .request({
        method: "Get",
        url: `http://localhost:3004/Departments/List`
      })
      .then(success => {
        let tabledata = this.state.tabledata;
        var successNew = [];
        success.data.map(item => {
          var obj = Object.values(item);
          obj.splice(5);
          successNew.push(obj);
        });
        tabledata = successNew;
        this.setState({
          tabledata
        });
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
  save = () => {
    var validation = this.validate_form(this.state.user);
    if (validation === "good to go") {
      axios
        .request({
          method: "POST",
          url: `http://localhost:3004/Departments/add`,
          data: this.state.user
        })
        .then(success => {
          this.close();
          this.componentDidMount();
        });
    } else {
      this.props.handleClick("tr", validation, "pe-7s-close", 3);
      console.log(this.state.user);
    }
  };
  validate_form = data => {
    if (data.depName != "" && data.desc != "" && data.HODName != "") {
      if (data.depName.length >= 6) {
        return "good to go";
      } else {
        return "Length of Department name is less then 6";
      }
    } else {
      return "Please Input a Valid Input, All Fields Are Mendatory";
    }
  };
  open = () => {
    this.setState({ showModal: true });
  };
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  changeHandler = e => {
    let userinfo = this.state.user;
    userinfo[e.target.id] = e.target.value;
    this.setState({ userinfo: userinfo });
  };
  propgetter = e => {
    console.log(e.target);
  };
  deleteConfirm = e => {
    axios
      .request({
        method: "POST",
        url: `http://localhost:3004/Departments/delete`,
        data: { id: this.state.dltitem }
      })
      .then(success => {
        this.props.handleClick(
          "tr",
          "Departemnt Deleted Successfully",
          "pe-7s-check",
          3
        );
        this.closedlt();
        this.componentDidMount();
      });
  };
  opendlt = e => {
    this.setState({ dltmodl: true, dltitem: e.target.id });
  };
  closedlt = () => {
    this.setState({ dltmodl: false, dltitem: null });
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
                        onClick={this.open}
                        className="btn-block btn-primary"
                      >
                        Add Department
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
                      {this.state.tabledata.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                            <td>
                              <Button
                                small="true"
                                className="nav-link btn btn-success"
                                id={prop[0]}
                                onClick={this.opendlt}
                              >
                                <i id={prop[0]} className="fa fa-trash" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
        <Modal
          show={this.state.dltmodl}
          onHide={this.closedlt}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-captialize">
              <i className="fa fa-trash"></i>
              Confirm Delete Department
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-captialize">
            are you sure about deleting this Department from database
            <p>no can be see this after deletion</p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" fill onClick={this.closedlt}>
              <i className="fa fa-times"></i>
              Close
            </Button>
            <Button bsStyle="warning" fill onClick={this.deleteConfirm}>
              <i className="fa fa-check"></i>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <div>
          <Modal bsSize="large" show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>
                <center>Add Department</center>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form encType="multipart/form-data">
                <div className="row">
                  <div className="col-sm-12">
                    <label htmlFor="depName"> Department Name </label>
                    <input
                      type="text"
                      onChange={this.changeHandler}
                      value={this.state.depName}
                      required={true}
                      id="depName"
                      name="depName"
                      className="form-control"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <label htmlFor="desc"> Description </label>
                    <textarea
                      rows="6"
                      type="text"
                      value={this.state.desc}
                      onChange={this.changeHandler}
                      required={true}
                      id="desc"
                      className="form-control"
                      name="desc"
                      placeholder="Complete Description About The Department"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-sm-12">
                    <label htmlFor="HODName"> Head Of Department Name </label>
                    <input
                      type="text"
                      value={this.state.HODName}
                      onChange={this.changeHandler}
                      required={true}
                      id="HODName"
                      className="form-control"
                      name="HODName"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <label htmlFor="status"> Status </label>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          onClick={this.radioChanged}
                          value="active"
                          name="status"
                          defaultChecked="checked"
                        />{" "}
                        Active
                      </label>
                    </div>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          className="form-check-input"
                          onClick={this.radioChanged}
                          value="inactive"
                          name="status"
                        />{" "}
                        In-Active
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn-success" onClick={this.save}>
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
