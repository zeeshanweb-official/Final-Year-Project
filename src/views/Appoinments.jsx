import React, { Component } from "react";
import Scheduler, { SchedulerData, ViewTypes } from "react-big-scheduler";
import { Button, Modal } from "react-bootstrap";
import withDragDropContext from "./withDnDContext";
import "react-big-scheduler/lib/css/style.css";
import "./style.css";
import axios from "axios";
class Basic extends Component {
  constructor(props) {
    super(props);
    //let schedulerData = new SchedulerData(new moment("2017-12-18").format(DATE_FORMAT), ViewTypes.Week);
    let schedulerData = new SchedulerData(
      new Date(),
      ViewTypes.Week,
      false,
      false,
      {
        displayWeekend: false,
        weekCellWidth: "16%",
        schedulerWidth: "77%"
      }
    );

    this.getresoucesfromweb(schedulerData);
    this.setEvents(schedulerData);
    this.state = {
      viewModel: schedulerData,
      showModal: false,
      showModal2: false,
      neweventdata: {
        start: " ",
        end: " ",
        resourceId: "",
        title: " ",
        bgColor: "",
        resourceName: "",
        date: "",
        endDate: ""
      },
      eventn: {},
      update: false
    };
  }
  getresoucesfromweb = schedulerData => {
    axios({
      method: "Get",
      url: "http://localhost:3004/Doctors/List",
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(success => {
        let resourcesgot = [];
        success.data.map(item => {
          let extData = {
            id: item._id,
            name: item.firstname + " " + item.lastname
          };
          resourcesgot.push(extData);
          return;
        });
        schedulerData.setResources(resourcesgot);
      })
      .catch(error => {
        //handle error
        console.log(error);
      });
  };
  setEvents = schedulerData => {
    axios({
      method: "Get",
      url: "http://localhost:3004/eventsAPI/List",
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(success => {
        let arr = [];
        success.data.map(item => {
          item.id = item._id;
          delete item._id;
          arr.push(item);
          item.resourceName =
            item.resourceId.firstname + " " + item.resourceId.lastname;
          item.resourceId = item.resourceId._id;
        });

        schedulerData.setEvents(arr);
      })
      .catch(error => {
        //handle error
        console.log(error);
      });
  };
  componentDidMount() {
    setTimeout(() => {
      let viewModel = this.state.viewModel;
      this.setState({
        viewModel
      });
    }, 500);
  }
  toggler = () => {
    this.setState({ showModal2: !this.state.showModal2 });
  };
  eventCreator = event => {
    let data = this.state.neweventdata;
    data[event.target.id] = event.target.value;
    this.setState({ neweventdata: data });
  };

  render() {
    const { viewModel } = this.state;

    return (
      <div className="row" style={{ margin: 0 + "px" }}>
        <div className="col-md-12 px-0">
          <Scheduler
            schedulerData={viewModel}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
            eventItemClick={this.eventClicked}
            viewEventClick={this.ops1}
            viewEventText="Edit"
            viewEvent2Text="Delete"
            viewEvent2Click={this.ops2}
            updateEventStart={this.updateEventStart}
            updateEventEnd={this.updateEventEnd}
            moveEvent={this.moveEvent}
            newEvent={this.newEvent}
          />
        </div>
        {/* <Modal show={this.state.showModal} onHide={this.toggler1}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.state.event ? this.state.event.title : "pakistan"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              name="Title"
              id="Title"
              onChange={this.changeHandler}
              value={this.state.event ? this.state.event.title : ""}
            />
            <p>{JSON.stringify(this.state.event)}</p>

            <h4>Popover in a modal</h4>

            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.toggler1}>Close</Button>
          </Modal.Footer>
        </Modal> */}

        <Modal show={this.state.showModal2} onHide={this.toggler}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className="form-control"
                onChange={this.eventCreator}
                id="title"
                value={this.state.neweventdata.title}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="start">Start Time:</label>

                  <input
                    type="time"
                    className="form-control"
                    id="start"
                    onChange={this.eventCreator}
                    value={
                      this.state.neweventdata.start
                        ? this.state.neweventdata.start
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="end">End Time:</label>
                  <input
                    type="time"
                    className="form-control"
                    id="end"
                    onChange={this.eventCreator}
                    value={this.state.neweventdata.end}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="color">Select Color:</label>
                  <input
                    type="color"
                    className="form-control"
                    id="bgColor"
                    onChange={this.eventCreator}
                    value={this.state.neweventdata.bgColor}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="resourceId">Doctor Name:</label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    id="resourceName"
                    onChange={this.eventCreator}
                    value={this.state.neweventdata.resourceName}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="date">Start Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    onChange={this.eventCreator}
                    value={this.state.neweventdata.date}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="date">End Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    onChange={this.eventCreator}
                    value={this.state.neweventdata.endDate}
                  />
                </div>
              </div>
            </div>
            <div className="row"></div>

            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-success" onClick={this.saveData}>
              Save
            </Button>
            <Button onClick={this.toggler}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
  changeHandler = event => {
    let evt = this.state.event;
    evt.title = event.target.value;
    this.setState({ eventn: evt });
  };
  prevClick = schedulerData => {
    schedulerData.prev();
    this.setEvents(schedulerData);
    setTimeout(() => {
      this.setState({
        viewModel: schedulerData
      });
    }, 500);
  };

  nextClick = schedulerData => {
    schedulerData.next();
    this.setEvents(schedulerData);
    setTimeout(() => {
      this.setState({
        viewModel: schedulerData
      });
    }, 500);
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    this.setEvents(schedulerData);
    setTimeout(() => {
      this.setState({
        viewModel: schedulerData
      });
    }, 500);
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    this.setEvents(schedulerData);
    setTimeout(() => {
      this.setState({
        viewModel: schedulerData
      });
    }, 500);
  };

  eventClicked = (schedulerData, event) => {};

  ops1 = (schedulerData, event) => {
    this.setState({
      update: true
    });
    let emptdata = this.state.neweventdata;
    emptdata.title = "";
    emptdata.start = "";
    emptdata.end = "";
    emptdata.date = "";
    emptdata.id = "";
    emptdata.resourceId = "";
    emptdata.resourceName = "";
    emptdata.endDate = "";
    emptdata.bgColor = "#80ff80";
    this.setState({
      neweventdata: emptdata
    });
    this.toggler();
    let date = this.timechanger(event.start);
    let end = this.timechanger(event.end);
    let endDate = end.one;
    end = end.two;
    let start = date.two;
    date = date.one;
    let newevt = this.state.neweventdata;
    newevt.resourceId = event.resourceId;
    newevt.resourceName = event.resourceName;
    newevt.start = start;
    newevt.end = end;
    newevt.id = event.id;
    newevt.title = event.title;
    newevt.date = date;
    newevt.endDate = endDate;
    newevt.bgColor = "#80ff80";
    this.setState({
      ...this.state.neweventdata,
      neweventdata: newevt
    });
  };

  ops2 = (schedulerData, event) => {
    axios({
      method: "post",
      url: "http://localhost:3004/eventsAPI/remove",
      data: { id: event.id },
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        //handle success
        this.setEvents(schedulerData);
        setTimeout(() => {
          this.setState({
            viewModel: schedulerData
          });
        }, 500);
        console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };
  emptystate = () => {
    let emptdata = this.state.neweventdata;
    emptdata.title = "";
    emptdata.start = "";
    emptdata.end = "";
    emptdata.date = "";
    emptdata.id = "";
    emptdata.resourceId = "";
    emptdata.resourceName = "";
    emptdata.endDate = "";
    emptdata.bgColor = "#80ff80";
    this.setState({
      neweventdata: emptdata
    });
  };
  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    this.emptystate();
    this.toggler();
    let date = this.timechanger(start);
    end = this.timechanger(end);
    let endDate = end.one;
    end = end.two;
    start = date.two;
    date = date.one;
    let newevt = this.state.neweventdata;
    newevt.resourceId = slotId;
    newevt.resourceName = slotName;
    newevt.start = start;
    newevt.end = end;
    newevt.id = slotId;
    newevt.date = date;
    newevt.endDate = endDate;
    newevt.bgColor = "#80ff80";
    this.setState({
      ...this.state.neweventdata,
      neweventdata: newevt
    });
  };
  timechanger = string => {
    const one = string.split(" ")[0];
    const two = string.split(" ")[1];
    return { one, two };
  };
  saveData = () => {
    var add = "http://localhost:3004/eventsAPI/add";
    var update = "http://localhost:3004/eventsAPI/update";
    var truth = this.state.update;
    const schedulerData = this.state.viewModel;
    const newevt = this.state.neweventdata;
    let abc = {
      start: newevt.date + " " + newevt.start,
      end: newevt.endDate + " " + newevt.end,
      bgColor: newevt.bgColor,
      title: newevt.title,
      resourceId: newevt.resourceId,
      resourceName: newevt.resourceName,
      id: newevt.id ? newevt.id : ""
    };
    axios({
      method: "post",
      url: this.state.update ? update : add,
      data: abc,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        if (response.data._id) {
          try {
            this.setEvents(schedulerData);
            setTimeout(() => {
              this.setState({
                viewModel: schedulerData,
                update: false
              });
            }, 500);
            this.toggler();
          } catch (error) {
            console.log(error);
          }
        }
      })
      .catch(error => {
        //handle error
        console.log(error);
      });
  };
  axireq = (event, newStart, dir) => {
    const schedulerData = this.state.viewModel;
    axios({
      method: "post",
      url: "http://localhost:3004/eventsAPI/updatestartend",
      data: { event: event, point: newStart, dir },
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        this.setEvents(schedulerData);
        setTimeout(() => {
          this.setState({
            viewModel: schedulerData,
            update: false
          });
        }, 500);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
  };

  updateEventStart = (schedulerData, event, newStart) => {
    schedulerData.updateEventStart(event, newStart);
    var point = "start";
    this.axireq(event, newStart, point);
    this.setState({
      viewModel: schedulerData
    });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    schedulerData.updateEventEnd(event, newEnd);
    var point = "end";
    this.axireq(event, newEnd, point);
    this.setState({
      viewModel: schedulerData
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    axios({
      method: "post",
      url: "http://localhost:3004/eventsAPI/fullUpdate",
      data: { event: event, slotId, start, end },
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        this.setEvents(schedulerData);
        setTimeout(() => {
          this.setState({
            viewModel: schedulerData,
            update: false
          });
        }, 500);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      });
    this.setState({
      viewModel: schedulerData
    });
  };
}

export default withDragDropContext(Basic);
