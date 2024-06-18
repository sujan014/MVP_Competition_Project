import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Popup, Button, ButtonGroup, Card, CardContent, CardHeader, CardMeta, CardDescription, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from "react-router-dom";
import JobCloseRender from './JobCloseRender.jsx';
import { CloseJobService } from '../EmployerServices/EmployerService.jsx';
//import { CloseJobAxios } from '../EmployerServices/EmployerAxios.jsx';


export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        
        const getJob = props.job ? Object.assign({}, props.job) : {};
        this.state = {
            job: getJob,
            jobEditState: false
        };
        
        this.closeJob = this.closeJob.bind(this);
        this.checkJobExpiry = this.checkJobExpiry.bind(this);
        //this.checkJobClosed = this.checkJobClosed.bind(this);        
    }

    componentDidMount() {
        
    }    
    
    checkJobExpiry() {
        // return true if expired, false if not expired        
        if (new Date().setHours(0, 0, 0, 0) > new Date(this.state.job.expiryDate).setHours(0, 0, 0, 0)) { return true; }
        return false;
    }
    /*checkJobClosed() {
        if (this.state.job.status === 1) {
            console.log("Job Closed.");
        } else {
            console.log("Job Open.");
        }
    }*/
    closeJob() {        
        const jobCloseStatus = CloseJobService(this.state.job.id);
        if (jobCloseStatus) {
            this.setState((prevState) => {
                let updatestate = Object.assign({}, prevState);         // creating copy of state variable job
                updatestate.job.status = 1;                             // update the status property,
                return { updatestate };                                 // return new object updateJob
            })
        }
    }
    render() {
        const title = this.state.job.title;
        const summary = this.state.job.summary;
        const country = this.state.job.location.country;
        const city = this.state.job.location.city;
        let jobExpiry = this.checkJobExpiry() ? (<Button color="red" content="Expired" />) : (<Button content="Not Expired" />);
        let linkString = "/EditJob/" + this.state.job.id;
        
        return (            
            <Card fluid>
                <CardContent style={{
                    height: '350px'
                }}>
                    <CardHeader>
                        <h3>{title}</h3>
                    </CardHeader>
                    <Label as='a' color='black' ribbon='right'>
                        <Icon name='user' />
                        <span>0</span>
                    </Label>
                    <br />
                    <CardMeta>
                        {city}, {country}
                    </CardMeta>
                    <CardDescription>
                        {summary}
                    </CardDescription>
                </CardContent>
                <CardContent extra>
                    <ButtonGroup floated='left' >
                        {jobExpiry}
                    </ButtonGroup>
                    <ButtonGroup floated="right">
                        <JobCloseRender
                            closeStatus={this.state.job.status}
                            jobCloseClick={this.closeJob}
                        />
                        <Link to={linkString} >
                            <Button
                                basic color="blue"
                                icon="edit"
                                content="Edit"                                
                            />
                        </Link>
                        <Button
                            basic color="blue"
                            icon="copy"
                            content="Copy"
                        />                        
                    </ButtonGroup>                    
                </CardContent>
            </Card>            
        )
    }
}