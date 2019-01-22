import React, {Component} from 'react';
import {Button, TextField, SelectField, Snackbar, DatePicker } from "react-md";

const ROUTES = ['Oral', 'Intramuscular', 'Intravenous', 'Intradermal', 'Topical', 'Sublingual'];
const FREQUENCY = ['Daily', 'Every other day', '2x Daily', '3x Daily', 'Bedtime', 'Every 4 hours'];
const STRENGTH = ['0.1mg', '0.5mg', '10mg', '20mg', '30mg'];

const mdbStitchWebhook = 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/hackathon-application-tgnby/service/addPrescriptionToPatientService/incoming_webhook/newPrescriptionWebhook?secret=mySecret';

export default class AddPrescriptionToPatient extends Component {

    constructor(props) {
        super(props)

        this.state = {
            toasts: [],
            savedPrescription: '',
            dateWritten: new Date()
        };

        this.patientIdField = React.createRef();
        this.medicationField = React.createRef();
        this.amountField = React.createRef();
        this.strengthField = React.createRef();
        this.frequencyField = React.createRef();
        this.routeField = React.createRef();
        this.refillsField = React.createRef();

        this.handleChange = this.handleChange.bind(this);
    }

    postNewPrescription(prescriptionData) {
        console.log("Insert new prescription: " + JSON.stringify(prescriptionData));

        fetch( mdbStitchWebhook,{
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(prescriptionData)
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result: " + json);

                if(!this.state.toasts.length) {
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
            .catch(function(ex) {
                console.log('Error on post to new prescription', ex);
            })
    }

    handleChange(dateString, dateObject, event) {
        this.setState({
            dateWritten:dateObject
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
                patientId : patientIdValue,
                medication : medicationValue,
                strength : strengthValue,
                amount : amountValue,
                frequency : frequencyValue,
                route : routeValue,
                refills : refillsValue,
                dateWritten : dateWrittenValue
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

    render() {

        const{ toasts } = this.state;

        return (

            <div className="md-grid">
                <pre className="md-cell md-cell--12">
                    <h4 className="md-cell md-cell--12">
                    <b>Note: </b>This page is using the <a target={"_blank"} href={"https://docs.mongodb.com/stitch/services/create-a-service-webhook/index.html"}>Webhook</a> feature of MongoDB Stitch.  This enables the ability to {"\n"}
                    define a REST-enabled endpoint that can accept HTTP GET and POST requests.  This page {"\n"}
                    is posting the contents of a new prescription to an endpoint that is backed by an {"\n"}
                    associated function which handles the insert.
                    </h4>
                </pre>
                <h2 className="md-cell md-cell--12">Add Prescription to Patient</h2>
                <h4 className="md-cell md-cell--12"><b>{this.state.savedPrescription}</b></h4>

                <form onSubmit={this.handleSubmit}
                      onReset={this.handleReset}>
                    <TextField
                        id="patientId"
                        label="Enter Patient ID"
                        ref={this.patientIdField}
                        className="md-cell md-cell--12"
                        required
                    />
                    <TextField
                        id="medication"
                        label="Enter Medication Name"
                        ref={this.medicationField}
                        className="md-cell md-cell--12"
                        required
                    />
                    <TextField
                        id="amount"
                        label="Amount"
                        type="number"
                        defaultValue={1}
                        className="md-cell md-cell--12"
                        required
                        ref={this.amountField}
                    />
                    <SelectField
                        id="strength"
                        label="Strength"
                        className="md-cell md-cell--12"
                        menuItems={STRENGTH}
                        required
                        ref={this.strengthField}
                        defaultValue='0.1mg'
                    />
                    <SelectField
                        id="frequency"
                        label="Frequency"
                        className="md-cell md-cell--12"
                        menuItems={FREQUENCY}
                        required
                        ref={this.frequencyField}
                        defaultValue='Daily'
                    />
                    <SelectField
                        id="route"
                        label="Route"
                        className="md-cell md-cell--12"
                        menuItems={ROUTES}
                        required
                        ref={this.routeField}
                        defaultValue='Oral'
                    />
                    <TextField
                        id="refills"
                        label="Refills"
                        type="number"
                        defaultValue={0}
                        step={1}
                        max={11}
                        className="md-cell md-cell--12"
                        required
                        ref={this.refillsField}
                    />
                    <DatePicker
                        id='dateWritten'
                        label='Date Written'
                        required
                        value={this.state.dateWritten}
                        className="md-cell md-cell--12"
                        onChange={this.handleChange}
                    />
                    <Button className="md-cell" raised primary type="submit">Submit</Button>
                    <Button className="md-cell" raised primary type="reset">Reset</Button>
                    <Snackbar id="toasts" toasts={toasts} onDismiss={this.handleDismiss} autohide={false}/>
                </form>
            </div>
        );
    }
}