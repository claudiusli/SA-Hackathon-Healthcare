import React, {Component} from 'react';
import {Button} from 'react-md';
import MaterialTable from 'material-table';

// Import the Stitch components required
import {stitchClient} from "./App";
import {RemoteMongoClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk';

export default class Patients extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            username: ''
        }

        this.onClick = this.onClick.bind(this);
        this.isUnmounted = false;
    }

    // function driver via Stitch Query Anywhere.
    // list different fields according to user type
    listPatientsByUser(username) {

        this.setState({username:username});

        // Start of Stitch use
        // Strictly for example.  Each user would most likely have a different password :)
        console.log("List Patients. User selected: " + this.state.username);
        let pass = 'myPassword123';
        let credential = new UserPasswordCredential(username, pass);

        return stitchClient.auth.loginWithCredential(credential).then(user => {
            console.log("User logged in: " + user.id);

            // Initialize Mongo Service Client
            let mongodb = stitchClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );

            // get a reference to the inventory collection
            let patientsCollection = mongodb.db("sahackathon").collection("health");

            // query the collection
            return patientsCollection.find({}, {
                limit: 30
                //,sort: {"PATIENT_ID": 1}
            }).asArray();
        // End of Stitch use

        }).then(results => {

            if(this.isUnmounted) {
                console.log("component unmounted");
                return;
            }
            this.setState({data: results});

        }).catch(e => {
            console.log("Error with listpatients by user: " + e);
        })
    }

    componentDidMount() {
        if(this.state.data.length === 0) {
            this.setState({
                data : this.listPatientsByUser('Doctor')
            })
        }
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    onClick(username) {
        this.setState({
            data: this.listPatientsByUser(username)
        })
    }

    render() {

        const {data} = this.state;
        let mtData = [];
        if(data.length > 0) {
            mtData = data.slice();
        }

        return (
            <div className="md-grid">
                <pre className="md-cell md-cell--12">
                    <h4 className="md-cell md-cell--12">
                    <b>Note: </b>This page is built using the <a target={"_blank"} href={"https://docs.mongodb.com/stitch/getting-started/configure-rules-based-access-to-mongodb/"}>Query Anywhere</a> functionality of Stitch. {"\n"}
                    Additionally, results/fields are filtered based on the selected User Role.  {"\n"}
                    This is controlled via <a target={"_blank"} href={"https://docs.mongodb.com/stitch/mongodb/mongodb-rules/"}>Rules</a> in MongoDB Stitch.
                    </h4>
                </pre>
                <h2 className="md-cell md-cell--12">Patient Listing Page</h2>
                <Button className="md-cell--left" raised primary onClick={() => this.onClick('Doctor')}>Doctor</Button>
                <Button className="md-cell--left" raised primary onClick={() => this.onClick('Provider')}>Provider</Button>
                <Button className="md-cell--left" raised primary onClick={() => this.onClick('Pharmacy')}>Pharmacy</Button>
                <h4 className="md-cell md-cell--12"><b>Displaying data for user role: {this.state.username}</b></h4>
                <MaterialTable
                        columns={[{title: 'Patient ID', field: 'PATIENT_ID'},
                            {title: 'SSN', field: 'SSN'},
                            {title: 'First', field: 'FIRST'},
                            {title: 'Last', field: 'LAST'},
                            {title: 'Address', field: 'ADDRESS'},
                            {title: 'Marital', field: 'MARITAL'},
                            {title: 'Gender', field: 'GENDER'}]}

                            data={mtData}
                            title={"Patients"}/>

            </div>
        );
    }
}