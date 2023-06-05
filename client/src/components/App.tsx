import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from '../assets/images/logo.svg';
import '../assets/css/hello.css';

interface DataProps { }
interface DataState { }

class App extends Component<DataProps, DataState> {
    constructor(props: any) {
        super(props);

        // console.log(process.env);
    }

    render() {
		// const { navigate, location, match, params } = this.props;
		console.log(this.props)
		
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.tsx</code> and save to reload.
					</p>
					<Link to={{ pathname: '/dashboard/1', search:'?keyword=test' }}>Test Link</Link>
				</header>
			</div>
		);
	}
}

export default App;
