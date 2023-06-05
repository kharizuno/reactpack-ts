import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actPost from '../../redux/actions/post';

import logo from '../../assets/images/logo.svg';
import '../../assets/css/hello.css';

import styled from '@emotion/styled';
import { setDate } from '../../helpers';

const NewStyle = styled.div`
	background: #cecece;
	padding-bottom: 1.5em;
`

interface DataProps extends PropsFromRedux {
	navigate: any,
	params: any
}

interface DataState { }

class Dashboard extends Component<DataProps, DataState> {
	constructor(props: any) {
		super(props);

		// console.log(process.env);
	}

	componentDidMount() {
		setTimeout(() => {
			// this.props.navigate({pathname: '/', search: '?search=test'})
		}, 10000)
	}

	render() {
		const { navigate, params } = this.props;
		console.log(navigate, params)

		return (
			<div className="App">
				<header className="App-header">
					<NewStyle>
						<img src={logo} className="App-logo" alt="logo" />
						<p>
							Dashboard Page, {setDate(true, false, 'en', true)}
						</p>
						<Link to={{ pathname: '/' }}>Back to App</Link>
					</NewStyle>
				</header>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {
		postList: state.post.postList
	}
}

const mapDispatchToProps = (dispatch: any) => {
	return {
		actPost: bindActionCreators(actPost, dispatch)
	}
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dashboard);
