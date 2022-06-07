# Program Indicator Disaggregator App

## Introduction

The program indicator disagregator app is a DHIS2 tool that enables duplication of already configured DHIS2 program
indicators into different disaggregations, defined by either option sets or custom values.

## Motivation

In various DHIS2 implementations, the use of program indicators has been vital to facilitate data analysis and data use
in various tracker programs. Due to the difference in implementations of tracker programs, each program has its own set
of indicators that are required to be designed, configured, and tested. In configuring program indicators, different
data disaggregations might be necessary in order to get the intended data.

Unlike the aggregate indicators, the current implementation of DHIS2 program indicators does not allow on-the-fly data
disaggregation. This means in order to disaggregate a program indicator, it has to be duplicated and the filter to be
modified according to the disaggregation intended. This might not be a challenge for a small number of disaggregations (
sex, for example). However, in situations where there are many disaggregations (10 or more), it may be a tedious task to
duplicate and modify the program indicator accordingly. In such cases, it might be a good idea to automate the
disaggregation process.

The program indicator disaggregation app is a tool designed to ease the process of managing program indicators that
require disaggregations. It allows a user to define program indicator details, an expression, and filter once and then
use the definition to automatically generate disaggregated program indicators The application also allows the user to
modify the main indicator and the modifications will be propagated to the disaggregated.

## Getting Started

### Installation

To use the app, download the [latest release](https://github.com/hisptz/program-indicator-disaggregator/releases) from
github releases and manually install the app in your DHIS instance through the `App management app`

### Usage

A comprehensive guide will soon be released. Stay tuned!

## Development

This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## Prerequisites

This app requires:

- yarn `v1.22.19`
- node  `v16.14.2`

## Setup

To install dependencies run:

### `yarn install`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode on port `3000` by default.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `.env` file Usage

To avoid having to specify the server URL everytime you start the app, you can duplicate the `.env.example` file and
rename it to `.env`. Then change the `REACT_APP_DHIS2_BASE_URL` variable to the URL of your DHIS2 instances

#### CORS issues

When running in development mode, you may encounter CORS error. To fix this issue, proxy your DHIS2 instance by
appending `--proxy http://link-to-dhis2-instance` to the start command. This will start a local proxy server
at `http://localhost:8080` (It may change ports if 8080 is busy)
. You can then point your app to `http://localhost:8080`

### `yarn test:open`

Launches the `cypress` test runner.

### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App
Management authority.
You must run `yarn build` before running `yarn deploy`.

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

## License

[BSD 3-Clause “New” or “Revised” License](https://choosealicense.com/licenses/bsd-3-clause/)

