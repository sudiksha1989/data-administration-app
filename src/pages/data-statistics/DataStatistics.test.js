/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import DataStatistics from './DataStatistics';
import DataStatisticsTable from './DataStatisticsTable';

const stateWithTablesForDataStatistics = [
    {
        label: 'Object type',
        elements: [
            { label: 'object1', count: 1 },
            { label: 'object2', count: 2 }
        ],
    },
    {
        label: 'Users logged in',
        elements: [
            { label: 'Today', count: 2 },
            { label: 'Last hour', count: 1 }
        ],
    },
];

const t = jest.fn();
const updateAppState = jest.fn();

const ownShallow = () => {
    return shallow(
        <DataStatistics t={t} updateAppState={updateAppState}/>,
        {
            disableLifecycleMethods: true
        }
    );
};

it('DataStatistics renders without crashing', () => {
    ownShallow();
});

it('DataStatistics renders no DataStatisticsTable', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(0);
});

it('DataStatistics renders DataStatisticsTable define on state', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(0);
    wrapper.setState({tables: stateWithTablesForDataStatistics});
    expect(wrapper.find(DataStatisticsTable)).toHaveLength(stateWithTablesForDataStatistics.length);
});