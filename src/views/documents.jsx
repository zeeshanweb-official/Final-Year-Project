import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import { NavLink } from "react-router-dom";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import avatar from "assets/img/faces/face-3.jpg";

class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      thArray: ["ID", "Name", "Salary", "Country", "City", "Action"],
      tdArray: [
        ["1", "Muhammad Awais Zeeshan", "$36,738", "Niger", "Shahkot"],
        ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
        ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
        ["4", "Philip Chaney", "$38,735", "Korea, South", "Overland Park"],
        ["5", "Doris Greene", "$63,542", "Malawi", "Feldkirchen in Kärnten"],
        ["6", "Muhammad Hassan", "$78,615", "Chile", "Faisalabad"]
      ]
    };
  }
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
                      md={3}
                      sm={12}
                      style={{ marginTop: 15 + "px", marginBottom: 15 + "px" }}
                    >
                      <Button
                        onClick={this.open}
                        className="btn-block btn-primary px-0"
                      >
                        <i className="fa fa-plus"></i>
                        Create Document
                      </Button>
                    </Col>
                    <Col
                      md={3}
                      sm={12}
                      style={{ marginTop: 15 + "px", marginBottom: 15 + "px" }}
                    >
                      <Button
                        onClick={this.open}
                        className="btn-block btn-info"
                      >
                        <i className="fa fa-upload"></i>
                        Upload Document
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
                                    <i className="fa fa-trash" />
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
      </div>
    );
  }
}

export default UserProfile;
