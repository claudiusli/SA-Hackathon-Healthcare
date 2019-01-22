import React, {Component} from 'react';
import {NavigationDrawer} from 'react-md';
import NavLink from './NavLink';
import {Route, Switch} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Patients from './Patients';
import PatientSearch from './PatientSearch';
import AddPrescriptionToPatient from './AddPrescriptionToPatient';
import PrescriptionsToFill from './PrescriptionsToFill';
import img from '../styles/mongoDBStitch.jpg';

// Import Stitch from the browser SDK
import { Stitch } from 'mongodb-stitch-browser-sdk';

// Initialize Stitch - appId is unique
let appId = 'hackathon-application-tgnby';
Stitch.initializeDefaultAppClient(appId);
export const stitchClient = Stitch.defaultAppClient;

const navItems = [{
    exact: true,
    label: 'Home',
    icon: 'home',
    to: '/'
    }, {
    label: 'Patients',
    icon: 'people',
    to: '/patients'
    },{
    label: 'Patient Search',
    icon: 'search',
    to:'/patientSearch'
    }, {
    label: 'Add Prescription',
    icon: 'control_point',
    to: '/addPrescription'
    }, {
    label: 'Open Prescriptions',
    icon: 'local_pharmacy',
    to: '/prescriptionsToFill'
    }, {
    label: 'About',
    icon: 'info',
    to: '/about'
}];

class App extends Component {
    render() {
        return (
            <Route
                render={({location}) => (
                    <NavigationDrawer
                        drawerTitle="Healthcare Menu"
                        drawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                        toolbarTitle="Stitched Together with MongoDB"
                        //toolbarActions={}
                        navItems={navItems.map(props => <NavLink {...props} key={props.to}/>)}>

                        <Switch key={location.key}>
                            <Route exact path="/" location={location} component={Home}/>
                            <Route path="/patients" location={location} component={Patients}/>
                            <Route path="/patientSearch" location={location} component={PatientSearch}/>
                            <Route path="/addPrescription" location={location} component={AddPrescriptionToPatient}/>
                            <Route path="/prescriptionsToFill" location={location} component={PrescriptionsToFill}/>
                            <Route path="/about" location={location} component={About} />
                        </Switch>

                        <div className="footer">
                            <img alt="MongoDBStitch" src={img} className="img-footer"/>
                        </div>

                    </NavigationDrawer>
                )}
            />
        );
    }
}

export default App;