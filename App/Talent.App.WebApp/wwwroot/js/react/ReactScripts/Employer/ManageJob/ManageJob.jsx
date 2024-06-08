import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, ButtonGroup, Button } from 'semantic-ui-react';
import axios from 'axios';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,//false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true,
            },
            totalPages: 1,
            activeIndex: "",            
            filterOptions: [    // States added by Sujan
                {
                    key: '0',
                    text: 'Choose filter',
                    value: 'Choose filter',
                },
                {
                    key: '1',
                    text: 'Active',
                    value: 'Active',
                },
                {
                    key: '2',
                    text: 'Closed',
                    value: 'Closed',
                },
                {
                    key: '3',
                    text: 'Draft',
                    value: 'Draft',
                },
                {
                    key: '4',
                    text: 'Expired',
                    value: 'Expired',
                },
                {
                    key: '5',
                    text: 'Unexpired',
                    value: 'Unexpired',
                }
            ],
            selectedFilterOption: 'Choose filter',
            sortOptions: [  // States added by Sujan
                {
                    key: 'Newest first',
                    value: 'desc',
                    text: 'Newest First'
                },
                {
                    key: 'Oldest first',
                    value: 'asc',
                    text: 'Oldest First'
                }
            ],            
            jobEditState: false,
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
                
        this.loadNextPage = this.loadNextPage.bind(this);
        this.loadPrevPage = this.loadPrevPage.bind(this);
        this.loadFirstPage = this.loadFirstPage.bind(this);
        this.loadLastPage = this.loadLastPage.bind(this);
        this.reloadCurrentpage = this.reloadCurrentpage.bind(this);

        let currentpage = this.state.activePage;

        this.jobEditWindow = this.jobEditWindow.bind(this);
        this.selectSort = this.selectSort.bind(this);
        this.selectFilter = this.selectFilter.bind(this);
        this.handleFilterState = this.handleFilterState.bind(this);
    };
    jobEditWindow() {
        this.setState((prevState) => ({
            jobEditState: !prevState.jobEditState
        }), () => { console.log(`jobEditState: ${this.state.jobEditState}`)});
        this.state.jobEditState
    }
    init() {
        
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;        
        
        this.loadData(() => {
            this.setState((
                { loaderData: loaderData })
            );            
        });
    }

    componentDidMount() {
        this.init();
    };
    
    loadFirstPage() {
        this.setState(
            { activePage: 1 },
            () => {
                this.loadData(() => { })
            }
        );        
    }
    loadPrevPage() {        
        this.setState((prevState) => (
            {
                activePage: (prevState.activePage > 1) ?
                    prevState.activePage - 1 :
                    prevState.activePage
            }),
            () => {
                this.loadData(() => { })
            }
        );        
    }
    loadNextPage() {
        this.setState((prevState) => (
            {
                activePage: (prevState.activePage < prevState.totalPages) ?
                    prevState.activePage + 1 :
                    prevState.activePage
            }),
            () => {
                this.loadData(() => { })
            }
        );        
    }
    loadLastPage() {
        this.currentpage = this.state.totalPages;
        this.setState(
            { activePage: this.state.totalPages },
            () => {
                this.loadData(() => { })
            }
        );                
    }
    reloadCurrentpage() {
        console.log('reload page...');        
    }
    selectSort(data) {        
        this.setState(
            {
                sortBy: {
                    date: data.value
                }
            },
            () => {                
                this.loadData(() => { })
            }
        );
    }
    
    handleFilterState(dataValue) {
        this.setState((
            {                
                selectedFilterOption: dataValue
            }            
        ));
    }
    selectFilter(data) {
        switch (data.value) {
            case 'Active':
                this.handleFilterState(data.value);
                break;
            case 'Closed':
                this.handleFilterState(data.value);
                break;
            case 'Draft':
                this.handleFilterState(data.value);
                break;
            case 'Expired':
                this.handleFilterState(data.value);
                break;
            case 'Unexpired':
                this.handleFilterState(data.value);
                break;
        }
    }
    
    loadData(callback) {
        callback();        
        /*var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?';*/
        var link = 'https://talentmain1.azurewebsites.net/listing/listing/getSortedEmployerJobs?';
        var cookies = Cookies.get('talentAuthToken');

        const jobsURL = link + `activePage=${this.state.activePage}` +
            `&sortbyDate=${this.state.sortBy.date}` +
            `&showActive=${this.state.filter.showActive}` +
            `&showClosed=${this.state.filter.showClosed}` +
            `&showExpired=${this.state.filter.showExpired}` +
            `&showUnexpired=${this.state.filter.showUnexpired}` +
            `&limit=2`;
        const headerField = {
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            }
        };        

        axios
            .get(
                jobsURL,
                headerField
            )
            .then((response) => {                
                if (response.status == 200) {                    
                    var myJobs = response.data.myJobs;
                    var totalCount = response.data.totalCount;
                    this.setState((
                        {
                            loadJobs: myJobs,
                            totalPages: (totalCount % 2 === 0) ? totalCount / 2 : Math.ceil(totalCount / 2)
                        }
                    ));                                        
                }
            })
            .catch((error) => {
                console.log(error);                
            });
    }    

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">                    
                    <h3><b>List of Jobs</b></h3>
                    <span>
                        <Icon name='filter' />Filter:{' '}
                        <Dropdown inline
                            options={this.state.filterOptions}
                            value={this.state.selectedFilterOption}
                            onChange={(e, data) => this.handleFilterState(data.value)} />
                        <Icon name='calendar' />Sort by date:{' '}
                        <Dropdown inline
                            value={this.state.sortBy.date}
                            onChange={(e, data) => this.selectSort(data)}
                            options={this.state.sortOptions} />
                    </span>
                    <div className="row">
                        <div className="ui grid">
                            <div className="row">                            
                                {this.state.loadJobs.map((job) =>
                                (
                                    <div
                                        className="eight wide column"
                                        key={job.id}
                                    >
                                        <JobSummaryCard job={job} />
                                    </div>

                                ))}                                
                            </div>
                        </div>
                    </div>

                    <br />
                    <div className="ui grid">
                        <div className="sixteen wide center aligned column">
                            <ButtonGroup>
                                <Button basic color='black' onClick={this.loadFirstPage}>
                                    &lt;&lt;
                                </Button>
                                <Button basic color='black' onClick={this.loadPrevPage}>
                                    &lt;
                                </Button>
                                <Button type="button">
                                    {this.state.activePage}
                                </Button>
                                <Button basic color='black' onClick={this.loadNextPage}>
                                    &gt;
                                </Button>
                                <Button basic color='black' onClick={this.loadLastPage}>
                                    &gt;&gt;
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <br />                    
                </div>
            </BodyWrapper>
        )
    }
}