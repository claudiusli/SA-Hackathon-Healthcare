import React, {Component} from 'react';
import {Button, Collapse} from 'react-md';
import MaterialTable from 'material-table';
import Moment from 'react-moment';

// Import the Stitch components required
import {stitchClient} from "./App";
import {RemoteMongoClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk';

export default class Notifications extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            collapsed: true
        }

        this.onClick = this.onClick.bind(this);
        this.isUnmounted = false;
    }

    // function driver via Stitch Query Anywhere.
    listNotifications() {

        // Start of Stitch use
        // Strictly for example.
        let username = 'Doctor';
        let pass = 'myPassword123';
        let credential = new UserPasswordCredential(username, pass);

        return stitchClient.auth.loginWithCredential(credential).then(user => {
            console.log("User logged in: " + user.id);

            // Initialize Mongo Service Client
            let mongodb = stitchClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"
            );

            // get a reference to the order new inventory collection
            let notificationsCollection = mongodb.db("sahackathon").collection("notifications");

            // query the collection
            return notificationsCollection.find({},
                { sort : {"notificationTs" : -1}}).asArray();
            // End of Stitch use

        }).then(results => {

            if (this.isUnmounted) {
                console.log("component unmounted");
                return;
            }

            this.setState({data: results});

        }).catch(e => {
            console.log("Error with list notifications: " + e);
        })
    }

    componentDidMount() {
        if (this.state.data.length === 0) {
            this.setState({
                data: this.listNotifications()
            })
        }
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

    onClick() {
        this.setState({
            data: this.listNotifications(),
            selectedPrescriptionsToFill: []
        })
    }

    render() {

        const {data, collapsed} = this.state;
        let mtData = [];
        if (data.length > 0) {
            mtData = data.slice();
        }

        return (
            <div className="md-grid">
                <h2 className="md-cell md-cell--12">Filled Prescriptions Notifications</h2>
                <Button className="md-cell--left" raised primary onClick={() => this.onClick()}>Refresh</Button>
                <div style={{width: '100%'}}>
                    <MaterialTable
                        columns={[{title: 'Patient ID', field: 'patientId'},
                            {title: 'Type', field: 'type'},
                            {
                                title: 'Date Sent', field: 'notificationTs', render: rowData => {
                                    const notificationTs = rowData.notificationTs
                                    return (
                                        <Moment format='LLL'>{notificationTs}</Moment>
                                    )
                                }
                            }
                        ]}
                        data={mtData}
                        title={"Notifications"}
                    />
                </div>
                <div className="md-cell md-cell--12"/>
                <Button className="md-cell--left" raised primary onClick={this.toggle}>Page Notes</Button>
                <div className="md-cell md-cell--12"/>
                <div className="md-cell md-cell--8">
                    <Collapse collapsed={collapsed}>
                        <h4 className="md-cell md-cell--12">
                            This page is built using the <a target={"_blank"} href={"https://docs.mongodb.com/stitch/getting-started/configure-rules-based-access-to-mongodb/"}>Query Anywhere</a> functionality of Stitch. {"\n"}
                            When a prescription is filled, a <a target={"_blank"} href={"https://docs.mongodb.com/stitch/triggers/"}>Stitch Trigger</a> is fired that will send a notification via Twilio/Slack/etc.{"\n"}
                            The result set on this page is a result of the trigger firing, sending notifications, and writing to a notifications collection.
                        </h4>
                    </Collapse>
                </div>
            </div>
        );
    }
}