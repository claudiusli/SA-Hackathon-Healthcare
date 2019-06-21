import React, {Component} from 'react';
import {Avatar} from "react-md";
import img from "../styles/mongodb-leaf.png";

export default class About extends Component {
    render() {
        return (

            <div className="md-grid">
                <h2 className="md-cell md-cell--12">
                    <Avatar src={img} role="presentation"/>
                    About This Application
                    <Avatar src={img} role="presentation"/></h2>

                <pre className="md-cell md-cell--12">
                    <h4 className="md-cell md-cell--12">This application was built using several different technologies.  Following are the resources used {"\n"}
                        in constructing it: {"\n"}
                    <a target={"_blank"} href={"http://www.mongodb.com"}>Completed MongoDB Stitch Application (Hosted on MongoDB Stitch)</a>{"\n\n"}
                        <b>Backend</b>{"\n"}
                    <a target={"_blank"} href={"https://www.mongodb.com/cloud/atlas"}>MongoDB Atlas (Database as a Service)</a>{"\n"}
                    <a target={"_blank"} href={"https://docs.mongodb.com/stitch/"}>MongoDB Stitch Serverless Platform</a>{"\n"}
                    NOTE:  It is <b>FREE</b> to signup for MongoDB Atlas!{"\n\n"}
                        <b>Frontend</b>{"\n"}
                    <a target={"_blank"} href={"https://reactjs.org/"}>React</a>{"\n"}
                    <a target={"_blank"} href={"https://react-md.mlaursen.com/"}>react-md (Material Design for React)</a>{"\n"}
                    <a target={"_blank"} href={"https://react-md.mlaursen.com/"}>material-table (DataTable based on the material-ui table component)</a>{"\n\n"}
                        <b>Source Code</b>{"\n"}
                    <a target={"_blank"} href={"https://github.com/blainemincey/SA-Hackathon-Healthcare/tree/master/src/components"}>GitHub Source Code for React Frontend</a>{"\n"}
                    <a target={"_blank"} href={"https://github.com/blainemincey/SA-Hackathon-Healthcare"}>GitHub Source Code for MongoDB Stitch Application</a>{"\n\n"}

                    <b>Questions?</b>  Reach out to the following Atlanta based MongoDB Solutions Architects:{"\n"}
                    Blaine Mincey - <a href={"mailto:blaine.mincey@mongodb.com"}>blaine.mincey@mongodb.com</a>{"\n"}
                    Marcelo Rocha - <a href={"mailto:marcelo.rocha@mongodb.com"}>marcelo.rocha@mongodb.com</a>{"\n"}
                    </h4>
                </pre>

            </div>
        );
    }
}
