import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';

const API_KEY = process.env.REACT_APP_BUGSNAG_API_KEY;

const bugsnagClient = bugsnag(API_KEY);
bugsnagClient.use(bugsnagReact, React);

export const ErrorBoundary = bugsnagClient.getPlugin('react');
