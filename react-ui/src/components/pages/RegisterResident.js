import React, {Component} from 'react';
import Form_Register_Resident from '../Form_Register_Resident.js';
import * as actions from '../../actions/register_resident.js';
import {connect} from 'react-redux';
import {Link} from 'react-router';

class RegisterResident extends Component {
    render() {
        if (this.props.registered === 'success') {
            return (
                <div className="parent-container">
                    <div>
                        <div className="flex-container">
                            <img
                                className="success_image"
                                src={require('../../utils/lemmling-Cartoon-beaver.svg')}
                            />
                        </div>

                        <div className="flex-container">
                            REGISTRATION SUCCESSFUL!
                        </div>
                        <div className="flex-container">
                            <Link to="/login">
                                <h6>Log in to continue</h6>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="container register_container">
                <div className="row justify-content-md-center">
                    <div className="col col-md-8">
                        <h2>Register as a Resident</h2>

                        <p>
                            <i>Fields marked with * are mandatory</i>
                        </p>
                        <Form_Register_Resident
                            registerResident={this.props.registerResident}
                            checkIfResidentExists={
                                this.props.checkIfResidentExists
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resident: state.registerResident.resident.response,
        registered: state.registerResident.resident.status,
    };
}
export default connect(mapStateToProps, actions)(RegisterResident);
