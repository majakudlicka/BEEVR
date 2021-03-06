import React from 'react';
import LoginForm from '../Login_Form.js';
import {connect} from 'react-redux';
import {Link, browserHistory} from 'react-router';
import * as actions from '../../actions/login.js';

class LoginPage extends React.Component {
    render() {
        if (this.props.isAuthenticated === true) {
            if (this.props.role === 'Student') {
                browserHistory.push('/browsejobs');
            } else {
                browserHistory.push('/browsestudents');
            }
        }
        return (
            <div className="container register_container">
                <div className="row justify-content-md-center">
                    <div className="col col-md-8">
                        <LoginForm />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const isAuthenticated =
        state.auth &&
        state.auth.response &&
        state.auth.response.isAuthenticated;

    const role =
        state.auth && state.auth.response && state.auth.response.role;

    return {
        loginRequest: state.auth,
        isAuthenticated,
        role,
    };
}

export default connect(mapStateToProps, actions)(LoginPage);
