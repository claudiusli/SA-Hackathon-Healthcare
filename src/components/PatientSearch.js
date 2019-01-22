import React, {Component} from 'react';
import {Button, TextField} from 'react-md';
import {stitchClient} from "./App";
import MaterialTable from 'material-table';

// import Stitch components
import {UserPasswordCredential} from 'mongodb-stitch-browser-sdk';


export default class PatientSearch extends Component {

    constructor(props) {
        super(props)

        this.state = {
            resultData: []
        };

        this.patientIdField = React.createRef();
    }

    // Function using Stitch Functions
    findPatientsByPatientId(patientId) {
        console.log("Search for patient by id: " + patientId);
        let username = 'Doctor';
        let pass = 'myPassword123';
        let credential = new UserPasswordCredential(username, pass);

        return stitchClient.auth.loginWithCredential(credential).then(user => {
            console.log("User logged in: " + user.id);

            return stitchClient.callFunction('searchPatientsByPatientId', [patientId]);

        }).then(results => {
            console.log("result: " + JSON.stringify(results));
            this.setState({resultData: results});

        }).catch(e => {
            console.log("Error with findPatientsByPatientId " + e);
        })
    }

    handleSubmit = (e) => {
        console.log("submit");
        e.preventDefault();

        let patientIdValue = '';
        if (this.patientIdField.current) {
            patientIdValue = this.patientIdField.current.value;

            this.findPatientsByPatientId(patientIdValue);
        }
        console.log("patient id: " + patientIdValue);
    };

    handleReset = () => {
        console.log("reset");
        this.setState({resultData: []})
    };

    render() {
        const {resultData} = this.state;
        let mtData = [];
        if (resultData.length > 0) {
            mtData = resultData.slice();
        }

        return (
            <div className="md-grid">
                <pre className="md-cell md-cell--12">
                    <h4 className="md-cell md-cell--12">
                        <b>Note: </b>This page is built using <a target={"_blank"} href={"https://docs.mongodb.com/stitch/functions/"}>MongoDB Stitch Functions.</a>  Using the Stitch client, {"\n"}
                    it is possible to call functions defined within MongoDB Stitch.
                    </h4>
                </pre>
                <h2 className="md-cell md-cell--12">Patient ID Search Page</h2>
                <form onSubmit={this.handleSubmit}
                      onReset={this.handleReset}>
                    <TextField
                        id="application-title"
                        label="Enter Patient ID"
                        ref={this.patientIdField}
                        className="md-cell md-cell--12"
                        required
                    />
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
            </div>
        );
    }
}