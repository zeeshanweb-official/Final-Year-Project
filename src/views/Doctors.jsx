import React, { Component } from "react";
import './custom-style.css'
import {
  Grid,
  Row,
  Col,
  Table,
  Modal,
} from "react-bootstrap";
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { NavLink } from "react-router-dom";
const axios = require('axios');

class UserProfile extends Component {
  constructor(props) {
		super(props);
		this.state = {
      file:null,
			user: {
				firstname: '',
				lastname: '',
				email: '',
				password: '',
				designation: '',
				department: '',
				address: '',
				Phone: '',
				mobile: '',
				specialist: '',
				DOB: "",
				gender: '',
				status: '',
      },
      departments:[],
      tdArray:[],
      thArray:['id','name','email','gender','department','action']
		};
  };
  
  
  componentDidMount(){
    axios.request({
      method: 'Get',
      url: `http://localhost:3004/Departments/List`,
    }).then((success)=>{
      var departments = this.state.departments
      var user= this.state.user;
        var successNew=[];
      success.data.map((item)=>{
        var obj = item.Name
        successNew.push(obj)
      })
      user.department = successNew[0]
      departments = successNew
      this.setState({
        departments
      })
    });
    axios.request({
      method: 'Get',
      url: `http://localhost:3004/Doctors/List`,
    }).then((success)=>{
      var tdArray = this.state.tdArray
      var successNew=[];
      success.data.map((item)=>{
         var obj = [item._id,item.firstname + " "+ item.lastname,item.email,item.gender,item.department,]
         successNew.push(obj)
       })
       tdArray = successNew
        this.setState({
          tdArray
        })
    });
  }
  getInitialState=()=> {
    return { showModal: false };
  }
  radioChanged=(e)=>{
    var user = this.state.user
    if(e.target.name==='gender'){
      user.gender = e.target.value; 
    }
    else{
      user.status = e.target.value;
    }
  }
  close=()=> {
    this.setState({ showModal: false });
  }
 
  sync=(event)=>{
    const target = event.target.value;
    if(event.target.id==='cpwd'){
      if(this.state.user.password===target){
        var docs =  document.getElementsByClassName('pwds')
        var values = Object.values(docs)
        for (const key of values) {
         key.style.display='none'
         document.getElementById('savebtn').disabled=false;

       }
       }
      else{
        document.getElementById('savebtn').disabled=true;
      }
    }
    else if(event.target.id==='cemail'){
      if(this.state.user.email===target){
       var docs =  document.getElementsByClassName('emails')
       var values = Object.values(docs)
       for (const key of values) {
        key.style.display='none'
       
      }
      }
      else{
        document.getElementById('savebtn').disabled=true;

      }
    }
  }
  open=()=> {
    this.setState({ showModal: true });
  }
  changeHandler=(e)=>{
    let userinfo = this.state.user;
		userinfo[e.target.id] = e.target.value;
		this.setState({ userinfo: userinfo })
  }
  vlauechanged=(e)=>{
    const user = this.state.user;
    user.department = e.value;
    this.setState({
      user
    })
  }
  onFormSubmit=(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append('myImage',this.state.file);
    formData.append('firstname',this.state.user.firstname);
    formData.append('lastname',this.state.user.lastname);
    formData.append('email',this.state.user.email);
    formData.append('password',this.state.user.password);
    formData.append('department',this.state.user.department);
    formData.append('designation',this.state.user.designation);
    formData.append('address',this.state.user.address);
    formData.append('Phone',this.state.user.Phone);
    formData.append('mobile',this.state.user.mobile);
    formData.append('specialist',this.state.user.specialist);
    formData.append('DOB',this.state.user.DOB);
    formData.append('gender',this.state.user.gender);
    formData.append('status',this.state.user.status);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post("http://localhost:3004/Doctors/add",formData,config)
        .then((response) => {
          this.close();
          this.componentDidMount();
        }).catch((error) => {
    });
}
onChange=(e)=> {
    this.setState({file:e.target.files[0]});
}
  render() {
    
const options = this.state.departments
const defaultOption = options[0]
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{height:135+"px"}}>
              <Row>
              <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph3 on pe-7s-monitor text-warning" />}
                statsText="Total Doctors"
                statsValue={this.state.tdArray.length}
                statsIcon={<i className="fa fa-refresh" onClick={()=>{
                  this.componentDidMount()
                }} />}
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
                  <Col md={2} sm={12} style={{marginTop:15+"px", marginBottom:15+"px"}}>
                  <Button onClick={this.open} className="btn-block btn-primary">Add Doctor</Button>
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
                      {this.state.tdArray.length?
                      this.state.tdArray.map((prop, key) => {
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
                             ><i className="fa fa-user" /></NavLink>
                            </td>
                          </tr>
                        );
                      }):null}
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
            <Modal.Title><center>Add Doctor</center></Modal.Title>
          </Modal.Header>
          <Modal.Body>        
            <form onSubmit={this.onFormSubmit} encType="multipart/form-data">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="firstname"> First Name </label>
              <input type="text" onChange={this.changeHandler} value={this.state.firstname} required={true} id="firstname" className="form-control"/>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="lastname"> Last Name </label>
              <input type="text" id="lastname" onChange={this.changeHandler} value={this.state.lastname} required={true} className="form-control"/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="email"> Email </label>
              <input type="email" id="email" value={this.state.email} onChange={this.changeHandler} required={true} className="form-control"/>
              <span className="emails" style={{color:'red'}}>*</span>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="cemail"> Confirm Email </label>
              <input type="text" id="cemail" required={true} onChange={this.sync} className="form-control"/>
              <span className="emails" style={{color:'red'}}>*</span>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="password"> Password </label>
              <input type="password" id="password" value={this.state.password} onChange={this.changeHandler} required={true} className="form-control"/>
              <span className="pwds" style={{color:'red'}}>*</span>

            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="cpwd"> Confirm Password </label>
              <input type="password" id="cpwd" required={true} onChange={this.sync} className="form-control"/>
              <span className="pwds" style={{color:'red'}}>*</span>
           
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="designation"> Designation </label>
              <input type="text" id="designation" value={this.state.designation} onChange={this.changeHandler} required={true} className="form-control"/>
            </div>
            <div className="col-md-6 col-sm-12">
            <label htmlFor="designation"> Department </label>
              <Dropdown options={options} id="department" 
              value={this.state.department} 
              onChange={(event)=>{this.vlauechanged(event)}}
              value={defaultOption} 
              placeholder="Select an option" 
              />

            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <label htmlFor="address"> Address </label>
              <textarea rows="6" type="text" value={this.state.address} onChange={this.changeHandler} required={true} id="address" className="form-control" placeholder="Complete Postal Address i.e house no 5 street no 6 Sarwari Road Faisalabad"/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="Phone"> Phone </label>
              <input type="number" value={this.state.Phone} onChange={this.changeHandler} required={true} id="Phone" className="form-control"/>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="mobile"> Mobile </label>
              <input type="text" id="mobile" value={this.state.mobile} onChange={this.changeHandler} required={true} className="form-control"/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="specialist"> Specialist In </label>
              <input type="text" id="specialist" value={this.state.specialist} onChange={this.changeHandler} required={true} className="form-control"/>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="DOB"> Date of Birth </label>
              <input type="date" id="DOB" value={this.state.DOB} onChange={this.changeHandler} required={true} className="form-control"/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <label htmlFor="gender"> Gender </label>
              <div className="form-check">
                <label className="form-check-label">
                  <input type="radio" className="form-check-input" onClick={this.radioChanged} value="male" name="gender" /> Male
                </label>
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input type="radio" className="form-check-input" onClick={this.radioChanged} value="female" name="gender" /> Female
                </label>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <label htmlFor="status"> Status </label>
              <div className="form-check">
                <label className="form-check-label">
                  <input type="radio" className="form-check-input" onClick={this.radioChanged} value="active" name="status" /> Active
                </label>
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input type="radio" className="form-check-input" onClick={this.radioChanged} value="inactive" name="status" /> In-Active
                </label>
              </div>
            </div>
          </div>
          <br/>
          <div className="row">
            
            <div className="col-md-5 col-sm-12"></div>
            <div className="col-md-2 col-sm-12">
              
             <div className="fileinputdiv" onClick={()=>{this.fileinput.click()}}>click here to upload images</div>
            <input
              style={{display:'none'}}
              type="file"
              name="myImage" 
              ref={fileinput=>{this.fileinput=fileinput}}
              onChange= {this.onChange} />
             </div>
          </div>
          
        </form> 

          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-success" type='submit' id="savebtn" onClick={this.onFormSubmit}>Save</Button>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    
      </div>
    );
  }
}

export default UserProfile;
