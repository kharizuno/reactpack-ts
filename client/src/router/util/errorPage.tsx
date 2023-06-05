import React from 'react';
import { useRouteError } from "react-router-dom";

import logo from '../../assets/images/logo.svg';
import '../../assets/css/hello.css';

export default function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>Oops!</h1>
                <p>Sorry, an unexpected error has occurred.</p>
                <p>
                    <i>{error.statusText || error.message}</i>
                </p>
            </header>
        </div>
    );
}