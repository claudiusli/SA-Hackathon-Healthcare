import React, {Component} from 'react';
import {Button, TextField, SelectionControlGroup, Collapse} from 'react-md';
import {stitchClient} from "./App";
import MaterialTable from 'material-table';

// import Stitch components
import {UserPasswordCredential} from 'mongodb-stitch-browser-sdk';


export default class PatientSearch extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultData: [],
            selection: 'patientId',
            collapsed: true
        };

        this.patientIdField = React.createRef();
        this.firstNameField = React.createRef();
        this.lastNameField = React.createRef();
        this.isUnmounted = false;
    }

    // Function using Stitch Functions
    // search function by patient id
    findPatientsByPatientId(patientId) {
        console.log("Search for patient by id: " + patientId);
        let username = 'Doctor';
        let pass = 'myPassword123';
        let credential = new UserPasswordCredential(username, pass);

        return stitchClient.auth.loginWithCredential(credential).then(user => {
            console.log("User logged in: " + user.id);

            return stitchClient.callFunction('searchPatientsByPatientId', [patientId]);

        }).then(results => {

            if(this.isUnmounted) {
                console.log("component unmounted");
                return;
            }

            console.log("result: " + JSON.stringify(results));
            this.setState({resultData: results});

        }).catch(e => {
            console.log("Error with findPatientsByPatientId " + e);
        })
    }

    // search function by patient first and/or last name
    findPatientsByName(firstName, lastName) {
        console.log("Search for patient by name");
        console.log("First Name: " + firstName);
        console.log("Last Name: " + lastName);

        let username = 'Doctor';
        let pass = 'myPassword123';
        let credential = new UserPasswordCredential(username, pass);

        return stitchClient.auth.loginWithCredential(credential).then(user => {
            console.log("User logged in: " + user.id);

            return stitchClient.callFunction('searchPatients', [firstName,lastName]);

        }).then(results => {

            if(this.isUnmounted) {
                console.log("component unmounted");
                return;
            }

            this.setState({resultData: results});

        }).catch(e => {
            console.log("Error with findPatients by name " + e);
        })
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    componentWillMount() {
        this.setState({collapsed: true})
    }

    toggle = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    handleSubmit = (e) => {
        console.log("submit");
        e.preventDefault();

        let patientIdValue = '';
        let firstNameValue = '';
        let lastNameValue = '';
        console.log("selected: " + this.state.selection);
        if(this.state.selection === 'patientId') {
            if (this.patientIdField.current) {
                patientIdValue = this.patientIdField.current.value;

                this.findPatientsByPatientId(patientIdValue);
            }
        } else {
            if(this.firstNameField.current) {
                firstNameValue = this.firstNameField.current.value;
            }
            if(this.lastNameField.current) {
                lastNameValue = this.lastNameField.current.value;
            }

            this.findPatientsByName(firstNameValue,lastNameValue);
        }

    };

    handleReset = () => {
        console.log("reset");
        this.setState({resultData: [], selection: 'patientId'})
    };

    handleSelection = (e) => {
        this.setState({resultData: [], selection: e})
    };

    render() {
        const {resultData, selection, collapsed} = this.state;
        let mtData = [];
        if (resultData.length > 0) {
            mtData = resultData.slice();
        }

        let patientSearch;
        let firstNameSearch;
        let lastNameSearch;

        if(selection === 'patientId') {
            patientSearch = <TextField
                id="application-title"
                label="Enter Patient ID"
                ref={this.patientIdField}
                className="md-cell md-cell--12"
                required
            />;
        } else {
            firstNameSearch = <TextField
                    id="application-title"
                    label="Enter Patient First Name"
                    ref={this.firstNameField}
                    className="md-cell md-cell--12"
                    required
                />;

            lastNameSearch = <TextField
                id="application-title"
                label="Enter Patient Last Name"
                ref={this.lastNameField}
                className="md-cell md-cell--12"

            />;

        }

        return (
            <div className="md-grid">
                <h2 className="md-cell md-cell--12">Patient Search Page</h2>
                <SelectionControlGroup
                    className="md-cell md-cell--12"
                    onChange={this.handleSelection.bind(this)}
                    id="selection-control-group-radios"
                    name="radio-selection"
                    type="radio"
                    label="Select Option to Search:"
                    value={selection}
                    controls={[{
                        label: 'Patient ID',
                        value: 'patientId',
                    }, {
                        label: 'First Name and/or Last Name',
                        value: 'name',
                    }
                    ]}
                />
                <form onSubmit={this.handleSubmit}
                      onReset={this.handleReset}>
                    {patientSearch}
                    {firstNameSearch}
                    {lastNameSearch}
                    <Button className="md-cell--left" raised primary type="submit">Submit</Button>
                    <Button className="md-cell--left" raised primary type="reset">Reset</Button>
                <MaterialTable
                    columns={[{title: 'Patient ID', field: 'PATIENT_ID'},
                        {title: 'SSN', field: 'SSN'},
                        {title: 'First', field: 'FIRST'},
                        {title: 'Last', field: 'LAST'},
                        {title: 'Address', field: 'ADDRESS'},
                        {title: 'Marital', field: 'MARITAL'},
                        {title: 'Gender', field: 'GENDER'}]}
                    data={mtData}
                    title={"Search Results"}/>
                </form>
                <div className="md-cell md-cell--12"/>
                <Button className="md-cell--left" raised primary onClick={this.toggle}>Page Notes</Button>

                <div className="md-cell md-cell--12">
                <Collapse collapsed={collapsed}>
                    <h4 className="md-cell md-cell--8">
                        This page is built using <a target={"_blank"} href={"https://docs.mongodb.com/stitch/functions/"}>MongoDB Stitch Functions.</a>  Using the Stitch client, {"\n"}
                        it is possible to call functions defined within MongoDB Stitch.
                    </h4>
                </Collapse>
                </div>


            </div>
        );
    }
}