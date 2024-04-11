import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Button, ButtonGroup, Card, CardContent, CardHeader, CardMeta, CardDescription, Label, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from "react-router-dom";

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this);
        const getJob = props.job ? Object.assign({}, props.job) : {};
        this.state = {
            job: getJob,
            jobEditState: false
        };
        this.jobInit = this.jobInit.bind(this);
        this.editJob = this.editJob.bind(this);
        this.closeJob = this.closeJob.bind(this);
        this.testJobExpiry = this.testJobExpiry.bind(this);
    }

    componentDidMount() {
        this.jobInit()
    }

    jobInit() {
        //const test = this.testJobExpiry() ? "Expired" : "Not Expired";
        //console.log(test);
    }
    testJobExpiry() {
        // return true if expired
        // return false if not expired        
        if (new Date().setHours(0, 0, 0, 0) > new Date(this.state.job.expiryDate).setHours(0, 0, 0, 0)) { return true; }
        return false;
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
        var link = 'http://localhost:51689/listing/listing/closeJob';
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: "json",
            type: "POST",
            data: JSON.stringify(id),
            success: function (res) {
                this.setState({ loadJobs: res.myJobs });
                //console.log('AJAX Job Close Response');
                //console.log(res);
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        });
    }
    editJob() {
        //this.setState(prevState => ({ jobEditState: !prevState.jobEditState, }), () => { console.log(`jobEditState: ${this.state.jobEditState}`); });
        //console.log(`Job id:${this.state.job.id} edited.`);

    }
    closeJob() {
        //console.log('Job closing...');
        //console.log(this.state.job.id);
        this.selectJob(this.state.job.id);
        //console.log('Job closed');
    }
    render() {
        const title = this.state.job.title;
        const summary = this.state.job.summary;
        const country = this.state.job.location.country;
        const city = this.state.job.location.city;
        let jobExpiry = this.testJobExpiry() ? (<Button color="red" content="Expired" />) : (<Button content="Not Expired" />);
        let linkString = "/EditJob/" + this.state.job.id;
        return (
            //<div class="card ten wide columns ui">
            /*this.state.jobEditState ? <div>This is job edit window</div>: (*/

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
                        <Button basic color="blue" icon="cancel" content="Close" onClick={this.closeJob} />
                        {/*<Button basic color="blue" icon="edit" content="Edit" onClick={() => { console.log(`edit string: ${linkString}`) }} />*/}
                        <Link to={linkString} >
                            <Button basic color="blue" icon="edit" content="Edit" onClick={this.editJob} />
                        </Link>
                        <Button basic color="blue" icon="copy" content="Copy" />
                    </ButtonGroup>
                </CardContent>
            </Card>
            //)

        )
    }
}