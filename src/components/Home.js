import React, {Component} from 'react';
import { Avatar } from "react-md";
import img from "../styles/Red-Cross.svg";
import { Link } from 'react-router-dom';

export default class Home extends Component {
    render() {
        return (
            <div className="md-grid">
                <h2 className="md-cell md-cell--12">
                    <Avatar src={img} role="presentation"/>
                     Example Application using MongoDB Stitch
                    <Avatar src={img} role="presentation"/></h2>

                <pre className="md-cell md-cell--12">
                    <h4 className="md-cell md-cell--12">
                    The MongoDB Stitch serverless platform makes it easy to build modern, cross-platform {"\n"}
                    applications on top of MongoDB. Stitch removes the need for tedious boilerplate and {"\n"}
                    automatically manages your app’s backend so you can focus on building what matters. {"\n\n"}

                    This workshop will focus on how to integrate MongoDB Stitch (backed by MongoDB Atlas) into {"\n"}
                    a web-based application.  Details on MongoDB Stitch, MongoDB Atlas, and the technologies {"\n"}
                    used to build this boilerplate React/Material Design application can be found in the {"\n"}
                    <Link to={"/about"}>About</Link> section of this application.{"\n\n"}
                    Finally, this app can be built with npm to be hosted via MongoDB Stitch.
                    </h4>
                </pre>

            </div>
        );
    }
}