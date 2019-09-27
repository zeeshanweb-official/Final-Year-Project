import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
class Applications extends Component {
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
  labresults = () => {
    this.props.history.push("/admin/labresults");
  };
  pharmacy = () => {
    this.props.history.push("/admin/pharmacy");
  };
  documents = () => {
    this.props.history.push("/admin/documents");
  };
  reports = () => {
    this.props.history.push("/admin/reports");
  };
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={4} sm={12}>
              <Button
                className="btn-block btn-primary"
                onClick={this.labresults}
              >
                Lab Results
              </Button>
            </Col>
            <Col md={4} sm={12}>
              <Button className="btn-block btn-success" onClick={this.pharmacy}>
                Pharmacy
              </Button>
            </Col>
            <Col md={4} sm={12}>
              <Button className="btn-block btn-info" onClick={this.documents}>
                Documents
              </Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={4} sm={12}>
              <Button className="btn-block btn-warning" onClick={this.reports}>
                Reports
              </Button>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Applications;
