import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Internatinalization: i18next
import { translate } from 'react-i18next';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';

import './App.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from './pages/sections.conf';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const NoMatch = ({ location }) => (
    <div>
        <h3>No match for <code>{location.pathname}</code></h3>
    </div>
);

NoMatch.propTypes = {
    location: PropTypes.object.isRequired,
};

class App extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            currentSection: HOME_SECTION_KEY,
        };

        this.setContainer = this.setContainer.bind(this);
    }

    componentWillMount() {
        this.props.history.listen((location) => {
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                if (section.path === location.pathname) {
                    this.setState({
                        currentSection: section.key,
                    });
                }
            }
        });
    }

    setContainer(sectionKey) {
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (sectionKey === section.key) {
                this.props.history.push(section.path);
                break;
            }
        }
    }

    render() {
        const routes = sections.map(section => (
            <Route
                key={section.key}
                exact
                path={section.path}
                render={() => {
                    const Component = translate()(section.component);
                    return (<Component pageInfo={section.info} />);
                }}
            />));
        routes.push(<Route key="no-match-route" component={NoMatch} />);

        const translatedSections = sections.map(section => Object.assign(section, { label: this.props.t(section.info.label), icon: section.info.icon }));

        return (
            <div className="container">
                <HeaderBar />
                <Sidebar
                    sections={translatedSections}
                    currentSection={this.state.currentSection}
                    onChangeSection={this.setContainer}
                />
                <div className="content-area">
                    <Switch>
                        {routes}
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;
