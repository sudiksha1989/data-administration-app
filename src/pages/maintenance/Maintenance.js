import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList, GridTile } from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { Card, CardText } from 'material-ui/Card';

import Page from '../Page';

// App configs
import { maintenanceCheckboxes, RESOURCE_TABLES_OPTION_KEY } from './maintenance.conf';
import { LOADING, SUCCESS, ERROR } from '../../components/feedback-snackbar/SnackbarTypes';

import styles from './Maintenance.css';

const STATE_PROPERTIES_WHITE_LIST = [
    'checkboxes',
    'checkAll',
];


class Maintenance extends Page {
    static propTypes = {
        pageInfo: PropTypes.object.isRequired,
    }

    constructor() {
        super();

        const checkboxes = {};
        for (let i = 0; i < maintenanceCheckboxes.length; i++) {
            const checkbox = maintenanceCheckboxes[i];
            checkboxes[checkbox.key] = { checked: false };
        }

        // state defaults
        this.state = {
            checkboxes,
            checkAll: false,
        };

        // actions
        this.performMaintenance = this.performMaintenance.bind(this);
        this.toggleCheckAll = this.toggleCheckAll.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && STATE_PROPERTIES_WHITE_LIST.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    areActionsDisabled() {
        return this.context.loading;
    }

    buildFormData() {
        let formData = null;
        const checkboxKeys = Object.keys(this.state.checkboxes);
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            const checked = this.state.checkboxes[key].checked;
            if (key !== RESOURCE_TABLES_OPTION_KEY && checked) {
                formData = formData || new FormData();
                formData.append(key, checked);
            }
        }

        return formData;
    }

    toggleCheckAll() {
        const checked = !this.state.checkAll;

        const checkboxes = {};
        const checkboxKeys = Object.keys(this.state.checkboxes);
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i];
            checkboxes[key] = { checked };
        }

        this.setState({
            checkAll: checked,
            checkboxes,
        });
    }

    performMaintenance() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();

        const apiRequests = [];
        const formData = this.buildFormData();
        if (formData) {
            apiRequests.push(api.post('maintenance', formData));
        }

        // resource table option is checked. It is treated differently
        if (this.state.checkboxes[RESOURCE_TABLES_OPTION_KEY].checked) {
            apiRequests.push(api.post('resourceTables'));
        }

        if (apiRequests.length > 0) {
            this.context.updateAppState({
                showSnackbar: true,
                loading: true,
                snackbarConf: {
                    type: LOADING,
                    message: translator('Performing Maintenance'),
                },
                pageState: {
                    checkboxes: this.state.checkboxes,
                    checkAll: this.state.checkAll,
                },
            });

            Promise.all(apiRequests).then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: SUCCESS,
                            message: translator('Maintenance done'),
                        },
                        pageState: {
                            checkboxes: this.state.checkboxes,
                            checkAll: this.state.checkAll,
                        },
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        translator('An unexpected error happend during maintenance');

                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            checkboxes: this.state.checkboxes,
                            checkAll: this.state.checkAll,
                        },
                    });
                }
            });
        }
    }

    render() {
        const translator = this.context.translator;
        const checkboxes = this.state.checkboxes;
        const gridElements = maintenanceCheckboxes.map((checkbox) => {
            const checkboxState = checkboxes[checkbox.key].checked;
            const toggleCheckbox = (() => {
                checkboxes[checkbox.key].checked = !checkboxState;
                this.setState({ checkboxes });
            });
            return (
                <GridTile key={checkbox.key}>
                    <Checkbox
                        label={translator(checkbox.label)}
                        checked={checkboxState}
                        onCheck={toggleCheckbox}
                        labelStyle={{ color: '#000000' }}
                        iconStyle={{ fill: '#000000' }}
                        disabled={this.areActionsDisabled()}
                    />
                </GridTile>
            );
        });

        return (
            <div className="page-wrapper">
                <h1>{translator(this.props.pageInfo.label)}</h1>
                <Card>
                    <CardText>
                        <Checkbox
                            id="maintenance-check-all"
                            className={styles.maintenanceCheckAll}
                            label={translator('Select all')}
                            checked={this.state.checkAll}
                            onCheck={this.toggleCheckAll}
                            labelStyle={{ color: '#757575' }}
                            iconStyle={{ fill: '#757575' }}
                            disabled={this.areActionsDisabled()}
                        />
                        <GridList
                            className={styles.maintenanceGridContainer}
                            cellHeight="auto"
                            cols={3}
                            padding={16}
                        >
                            {gridElements}
                        </GridList>
                        <RaisedButton
                            label={translator('PERFORM MAINTENANCE')}
                            onClick={this.performMaintenance}
                            primary={Boolean(true)}
                            disabled={this.areActionsDisabled()}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default Maintenance;
