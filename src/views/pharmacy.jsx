import React, { Component } from "react";
import { Grid, Row, Col, Table, Modal } from "react-bootstrap";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      thArray: ["ID", "Name", "For", "Quantity", "Action"],
      tdArray: [],
      showModal: false,
      medicine: {
        medname: "",
        medfor: "",
        quantity: 0,
        dltmdl: false,
        dltitem: ""
      }
    };
  }
  componentDidMount = () => {
    axios({
      method: "get",
      url: "http://localhost:3004/medicine/list",
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        let tdArray = [];
        response.data.map(item => {
          let array = [item._id, item.name, item.for, item.quantity];
          tdArray.push(array);
        });
        this.setState({ tdArray });
        // window.location.assign("https://www.google.com");
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  save = () => {
    axios({
      method: "post",
      url: "http://localhost:3004/medicine/add",
      data: this.state.medicine,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        //handle success
        this.componentDidMount();
        let medicine = this.state.medicine;
        medicine = {
          medname: "",
          medfor: "",
          quantity: 0
        };
        this.setState({ medicine, showModal: false });
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  changeHandler = e => {
    let medicine = this.state.medicine;
    medicine[e.target.name] = e.target.value;
    this.setState({ medicine });
  };
  opendlt = e => {
    this.setState({ dltmdl: true, dltitem: e.target.id });
  };
  closedlt = () => {
    this.setState({ dltmdl: false, dltitem: null });
  };
  ConfirmDlt = () => {
    axios({
      method: "post",
      url: "http://localhost:3004/medicine/delete",
      data: { id: this.state.dltitem },
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        //handle success
        this.closedlt();
        this.componentDidMount();
        this.props.handleClick("tr", "Deleted Successfully", "pe-7s-close", 3);
      })
      .catch(response => {
        //handle error
        this.props.handleClick(
          "tr",
          "Data Cannot Be Deleted",
          "pe-7s-close",
          3
        );
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
                        New Medicine
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
                                  <Button
                                    onClick={this.opendlt}
                                    id={prop[0]}
                                    className="nav-link btn btn-success"
                                  >
                                    <i id={prop[0]} className="fa fa-trash" />
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
              <Modal
                show={this.state.dltmdl}
                onHide={this.closedlt}
                animation={true}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Woohoo, you're reading this text in a modal!
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.closedlt}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={this.ConfirmDlt}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Grid>
        <Modal
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <center>
                <i className="fa fa-plus"> </i> New Medicine
              </center>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <form>
                <Col md={6}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="medname"
                      value={this.state.medicine.medname}
                      aria-describedby="emailHelp"
                      placeholder="Enter Name"
                      onChange={this.changeHandler}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label htmlFor="For">For / Purpose</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.medicine.medfor}
                      id="For"
                      name="medfor"
                      placeholder="Name of diseases"
                      onChange={this.changeHandler}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={this.state.medicine.quantity}
                      id="quantity"
                      name="quantity"
                      placeholder="Name of diseases"
                      onChange={this.changeHandler}
                    />
                  </div>
                </Col>
              </form>
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
      </div>
    );
  }
}

export default UserProfile;
