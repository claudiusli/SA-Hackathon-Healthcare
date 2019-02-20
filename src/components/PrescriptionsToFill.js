import React, {Component} from 'react';
import {Button, List, ListItem, Subheader, Collapse} from 'react-md';
import MaterialTable from 'material-table';
import Moment from 'react-moment';

// Import the Stitch components required
import {stitchClient} from "./App";
import {RemoteMongoClient, UserPasswordCredential} from 'mongodb-stitch-browser-sdk';

export default class PrescriptionsToFill extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedPrescriptionsToFill: [],
            collapsed: true
        }

        this.onClick = this.onClick.bind(this);
        this.mtOnClick = this.mtOnClick.bind(this);
        this.onClickFillPrescription = this.onClickFillPrescription.bind(this);
        this.isUnmounted = false;
    }

    // function driver via Stitch Query Anywhere.
    listPrescriptionsToFill() {

        // Start of Stitch use
        // Strictly for example.
        let username = 'Pharmacy';
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
            let prescriptionsToFillCollection = mongodb.db("sahackathon").collection("prescriptionsToFill");

            // query the collection
            return prescriptionsToFillCollection.find({"dateFilled" : null}, {
            }).asArray();
            // End of Stitch use

        }).then(results => {

            if(this.isUnmounted) {
                console.log("component unmounted");
                return;
            }

            this.setState({data: results});

        }).catch(e => {
            console.log("Error with list prescriptions to refill: " + e);
        })
    }

    // function driver via Stitch Query Anywhere.
    fillSelectedPrescriptions() {

        // Start of Stitch use
        // Strictly for example.
        let username = 'Pharmacy';
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
            let prescriptionsToFillCollection = mongodb.db("sahackathon").collection("prescriptionsToFill");

            // update the collection
            for (let idx = 0; idx < this.state.selectedPrescriptionsToFill.length; idx++) {
                let theId = this.state.selectedPrescriptionsToFill[idx]._id;
                prescriptionsToFillCollection.updateOne({"_id": theId}, {"$set": {"dateFilled": new Date()}})
                    .then(results => {

                        console.log("update results: " + JSON.stringify(results));

                        if (this.isUnmounted) {
                            console.log("component unmounted");
                            return;
                        }
                    })
                    .catch(e => {
                        console.log("Error with prescription to fill update", e);
                    })
            }

            this.setState({
                selectedPrescriptionsToFill: [],
                data: this.listPrescriptionsToFill()
            })
            // End of Stitch use
        })
    }

    componentDidMount() {
        if(this.state.data.length === 0) {
            this.setState({
                data : this.listPrescriptionsToFill()
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
            data: this.listPrescriptionsToFill(),
            selectedPrescriptionsToFill: []
        })
    }

    onClickFillPrescription() {
        console.log("Fill Prescriptions");
        this.fillSelectedPrescriptions();
    }

    mtOnClick(data) {
        if(data.length > 0){
            this.setState({
                selectedPrescriptionsToFill: data
            })
        } else {
            this.setState({
                selectedPrescriptionsToFill: []
            })
        }
    }

    render() {

        const {data, collapsed} = this.state;
        const {selectedPrescriptionsToFill} = this.state;
        let mtData = [];
        if(data.length > 0) {
            mtData = data.slice();
        }

        let fillPrescriptionsButton;
        let scriptsList;


        if(selectedPrescriptionsToFill.length > 0){
            fillPrescriptionsButton = <Button className="md-cell--left" raised primary onClick={() => this.onClickFillPrescription()}>Fill Selected</Button>
            scriptsList = <List className='md-cell md-cell--12'><Subheader primaryText="Fill the following selected prescriptions:" />{selectedPrescriptionsToFill.map((item,key) => (
                <ListItem key={key} primaryText={item.patientId + ' - ' + item.medication}/>
                )
            )}</List>;
        }

        return (
            <div className="md-grid">
                <h2 className="md-cell md-cell--12">Prescriptions To Fill</h2>
                <Button className="md-cell--left" raised primary onClick={() => this.onClick()}>Refresh</Button>
                {fillPrescriptionsButton}
                {scriptsList}
                <div style={{width:'100%'}}>
                <MaterialTable
                    columns={[{title: 'Patient ID', field: 'patientId'},
                        {title: 'Medication', field: 'medication'},
                        {title: 'Strength', field: 'strength'},
                        {title: 'Amount', field: 'amount'},
                        {title: 'Frequency', field: 'frequency'},
                        {title: 'Route', field: 'route'},
                        {title: 'Refills', field: 'refills'},
                        {title: 'Date Written', field: 'dateWritten', render: rowData => {
                            const dateWritten = rowData.dateWritten
                                return (
                                    <Moment format='MMM-DD-YYYY'>{dateWritten}</Moment>
                                )
                            }}
                        ]}
                    data={mtData}
                    title={"Prescriptions"}
                    actions={[
                        {
                            icon: 'done_all',
                            tooltip: 'Do',
                            onClick: (event, rows) => {
                                alert('You selected ' + rows.length + ' rows')
                            },

                        },
                    ]}
                    options={{
                        selection: true
                    }}
                    onSelectionChange={data => this.mtOnClick(data)}

                />
                </div>
                <div className="md-cell md-cell--12"/>
                <Button className="md-cell--left" raised primary onClick={this.toggle}>Page Notes</Button>
                <div className="md-cell md-cell--12"/>
                <div className="md-cell md-cell--8">
                <Collapse collapsed={collapsed}>
                    <h4 className="md-cell md-cell--12">
                        This page is built using the <a target={"_blank"} href={"https://docs.mongodb.com/stitch/getting-started/configure-rules-based-access-to-mongodb/"}>Query Anywhere</a> functionality of Stitch. {"\n"}
                        For this example, if a new prescription is added that has not been filled by the Pharmacy, a document is written to a new collection.  {'\n'}
                        All prescriptions not filled are listed on this page.  When a prescription is selected, the user can "fill" it.  When the prescription is filled,{"\n"}
                        a <a target={"_blank"} href={"https://docs.mongodb.com/stitch/triggers/"}>Stitch Trigger</a> is fired that will send a notification via Twilio/Slack/etc.
                    </h4>
                </Collapse>
                </div>

            </div>
        );
    }
}