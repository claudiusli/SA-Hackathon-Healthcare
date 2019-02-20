import React, {Component} from 'react';
import {Button, TextField, SelectField, Snackbar, DatePicker, Collapse} from "react-md";

const ROUTES = ['Oral', 'Intramuscular', 'Intravenous', 'Intradermal', 'Topical', 'Sublingual'];
const FREQUENCY = ['Daily', 'Every other day', '2x Daily', '3x Daily', 'Bedtime', 'Every 4 hours'];
const STRENGTH = ['0.1mg', '0.5mg', '10mg', '20mg', '30mg'];

const mdbStitchWebhook = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/healthcare-application-yjsra/service/addPrescriptionToPatientService/incoming_webhook/newPrescriptionWebhook?secret=mySecret';

export default class AddPrescriptionToPatient extends Component {

    constructor(props) {
        super(props)

        this.state = {
            toasts: [],
            savedPrescription: '',
            dateWritten: new Date(),
            collapsed: true
        };

        this.patientIdField = React.createRef();
        this.medicationField = React.createRef();
        this.amountField = React.createRef();
        this.strengthField = React.createRef();
        this.frequencyField = React.createRef();
        this.routeField = React.createRef();
        this.refillsField = React.createRef();

        this.handleChange = this.handleChange.bind(this);

        this.isUnmounted = false;
    }

    postNewPrescription(prescriptionData) {
        console.log("Insert new prescription: " + JSON.stringify(prescriptionData));

        fetch(mdbStitchWebhook, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(prescriptionData)
        })
            .then(response => response.json())
            .then(json => {

                if (this.isUnmounted) {
                    console.log("component unmounted");
                    return;
                }

                console.log("Result: " + json);

                if (!this.state.toasts.length) {
                    const toasts = this.state.toasts.slice();
                    toasts.push({
                        text: json,
                        action: "Successful!",
                    });

                    this.setState({toasts});

                    // Saved Product Name
                    this.setState({
                        savedPrescription: json
                    });
                }
            })
            .catch(function (ex) {
                console.log('Error on post to new prescription', ex);
            })
    }

    handleChange(dateString, dateObject, event) {
        this.setState({
            dateWritten: dateObject
        })
    }

    handleDismiss = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({toasts});
    }

    handleSubmit = (e) => {
        console.log("submit");
        e.preventDefault();

        let patientIdValue;
        let medicationValue;
        let amountValue;
        let strengthValue;
        let frequencyValue;
        let routeValue;
        let refillsValue;
        let dateWrittenValue;

        let newPrescription;

        if (this.patientIdField.current &&
            this.medicationField.current &&
            this.amountField.current &&
            this.strengthField.current &&
            this.frequencyField.current &&
            this.routeField.current &&
            this.refillsField.current) {

            patientIdValue = this.patientIdField.current.value;
            medicationValue = this.medicationField.current.value;
            amountValue = this.amountField.current.value;
            strengthValue = this.strengthField.current.value;
            frequencyValue = this.frequencyField.current.value;
            routeValue = this.routeField.current.value;
            refillsValue = this.refillsField.current.value;
            dateWrittenValue = this.state.dateWritten;

            newPrescription = {
                patientId: patientIdValue,
                medication: medicationValue,
                strength: strengthValue,
                amount: amountValue,
                frequency: frequencyValue,
                route: routeValue,
                refills: refillsValue,
                dateWritten: dateWrittenValue
            }

            this.postNewPrescription(newPrescription);
        }
    };

    handleReset = () => {
        console.log("reset");
        this.setState({
            savedPrescription: '',
            dateWritten: new Date()
        })
    };

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    componentWillMount() {
        this.setState({collapsed: true})
    }

    toggle = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {

        const {toasts, collapsed} = this.state;

        return (

            <div className="md-grid">
                <div className="md-cell md-cell--12">
                        <h2>Add Prescription to Patient</h2>
                        <h4><b>{this.state.savedPrescription}</b></h4>
                </div>

                <form onSubmit={this.handleSubmit}
                      onReset={this.handleReset}>
                    <div className="md-cell md-cell--12">
                            <TextField
                                id="patientId"
                                label="Enter Patient ID"
                                ref={this.patientIdField}
                                required

                            />
                    </div>
                    <div className="md-cell md-cell--12">
                            <TextField
                                id="medication"
                                label="Enter Medication Name"
                                ref={this.medicationField}
                                required
                            />
                    </div>
                    <div className="md-cell md-cell--4">
                            <TextField
                                id="amount"
                                label="Amount"
                                type="number"
                                defaultValue={1}
                                required
                                ref={this.amountField}
                            />
                    </div>
                    <div className="md-cell md-cell--4">
                            <SelectField
                                id="strength"
                                label="Strength"
                                menuItems={STRENGTH}
                                required
                                ref={this.strengthField}
                                defaultValue='0.1mg'
                            />
                    </div>
                    <div className="md-cell md-cell--4">
                            <SelectField
                                id="frequency"
                                label="Frequency"
                                menuItems={FREQUENCY}
                                required
                                ref={this.frequencyField}
                                defaultValue='Daily'
                            />
                    </div>
                    <div className="md-cell md-cell--4">
                            <SelectField
                                id="route"
                                label="Route"
                                menuItems={ROUTES}
                                required
                                ref={this.routeField}
                                defaultValue='Oral'
                            />
                    </div>
                    <div className="md-cell md-cell--4">
                            <TextField
                                id="refills"
                                label="Refills"
                                type="number"
                                defaultValue={0}
                                step={1}
                                max={11}
                                required
                                ref={this.refillsField}
                            />
                    </div>
                    <div className="md-cell md-cell--8">
                            <DatePicker
                                id='dateWritten'
                                label='Date Written'
                                required
                                value={this.state.dateWritten}
                                onChange={this.handleChange}
                            />
                    </div>

                            <Button className="md-cell--left" raised primary type="submit">Submit</Button>


                            <Button className="md-cell--left" raised primary type="reset">Reset</Button>


                </form>

                <div className="md-cell md-cell--12"/>

                        <Button className="md-cell--left" raised primary onClick={this.toggle}>Page Notes</Button>
                <div className="md-cell md-cell--12"/>


                <div className="md-cell md-cell--8">
                    <Collapse collapsed={collapsed}>
                        <h4>
                            This page is using the <a target={"_blank"}
                                                      href={"https://docs.mongodb.com/stitch/services/create-a-service-webhook/index.html"}>Webhook</a> feature
                            of MongoDB Stitch. This enables the ability to {"\n"}
                            define a REST-enabled endpoint that can accept HTTP GET and POST requests. This page {"\n"}
                            is posting the contents of a new prescription to an endpoint that is backed by an {"\n"}
                            associated function which handles the insert.
                        </h4>
                    </Collapse>
                </div>

                <Snackbar id="toasts" toasts={toasts} onDismiss={this.handleDismiss} autohide={false}/>
            </div>

        );
    }
}