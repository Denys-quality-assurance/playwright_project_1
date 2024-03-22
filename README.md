# Software Testing System with Playwright and Jenkins

# Table of Contents

_Clicking on a section name will direct you straight to that section._

1. [Overview](#Overview)
2. [Technology Stack](#Technology-Stack)
   - [Primary Programming Languages](#Primary-Programming-Languages)
   - [Key Libraries and Frameworks](#Key-Libraries-and-Frameworks)
   - [Code Quality Tools](#Code-Quality-Tools)
   - [Environment Variable Management](#Environment-Variable-Management)
   - [Continuous Integration](#Continuous-Integration)
   - [Version Control](#Version-Control)
3. [Features](#Features)
   - [Jenkins CI/CD Pipeline](#Jenkins-CI/CD-Pipeline)
   - [Playwright Configuration](#Playwright-Configuration)
   - [Data-Driven Testing (DDT)](<#Data-Driven-Testing-(DDT)>)
   - [iFrame Handling](#iFrame-Handling)
   - [Screenshot Comparison & Visual Regression](#Screenshot-Comparison-&-Visual-Regression)
   - [Performance Metrics Tracking](#Performance-Metrics-Tracking)
   - [Test Lifecycle Management](#Test-Lifecycle-Management)
   - [Screenshot and Report Management](#Screenshot-and-Report-Management)
   - [Known Bugs Tracking](#Known-Bugs-Tracking)
   - [Custom Test Reporting](#Custom-Test-Reporting)
4. [Prerequisites and Installation](#Prerequisites-and-Installation)
5. [Codebase Structure](#Codebase-Structure)
   - [Key Files and Directories](#Key-Files-and-Directories)
6. [Configuration/Environment Setup](#Configuration/Environment-Setup)
   - [Environment Variables](#Environment-Variables)
7. [CI Setup](#CI-Setup)
   - [Jenkinsfile](#Jenkinsfile)
     - [How to configure Jenkinsfile](#How-to-configure-Jenkinsfile)
   - [Config.xml](#Config.xml)
     - [How to configure Config.xml](#How-to-configure-Config.xml)

## Overview

The aim of this project, aptly titled "Software Testing System with Playwright and Jenkins" is two-pronged. First, **it seeks to systemize knowledge and enhance skill sets dealing with various stages of test framework preparation** including Jenkins configuration, CI jobs configuration, playwright configuration, test lifecycle configuration, test design, and custom report configuration.

The goal is not to fully cover all the features of the object under test, but to provide solutions to a variety of high-demand problems so that I can improve my solution skills in pragmatic scenarios of **building a compact full-featured testing system from scratch**.

The secondary aim of the project is **testing the usage of CtahGPT as a mentor and co-pilot in test framework creation**. It provides an additional dimension and challenge for me to complete tasks with the AI system.

## Technology Stack

The Software Testing System is built leveraging diverse technology tools and libraries with JavaScript being the core programming language.

### Primary Programming Languages

- **JavaScript (ES6+)**: JavaScript, specifically its ES6 version and above, forms the backbone of the project, enabling multiple functionalities of the Software Testing System.

### Key Libraries and Frameworks

- **Playwright (`@playwright/test` and `playwright`)**: These are used as end-to-end browser testing tools. Playwright enables reliable and efficient testing by allowing control over the full browser context and simulating user actions.

- **Sharp (`sharp`)**: Used as a high-performance Node.js image processing library, primarily used for resizing images and tasks related to manipulating the Picture.

- **Pixelmatch (`pixelmatch`) and Pngjs (`pngjs`)**: Both are robust image comparison and processing libraries used to compare the testing snapshot with the baseline image.

### Code Quality Tools

- **ESLint (`eslint`)** (with several plugins and configurations): Used to enforce code quality and maintain consistency.

- **Prettier (`prettier`)**: An opinionated code formatter enforcing a consistent coding style.

### Environment Variable Management

- **Dotenv (`dotenv`)**: Utilized for managing environment variables.

### Continuous Integration

- **Jenkins**: Applied for continuous integration to automate the building and testing of the application.

### Version Control

- **Git and GitHub**: Used for source version control and project repository hosting, enabling collaborative work and contribution tracking.

## Features

### Jenkins CI/CD Pipeline

Our software testing system employs an automated Jenkins CI/CD pipeline that runs end-to-end tests using the Playwright JavaScript framework. The pipeline is configured via `Jenkinsfile` and `jenkins_job_configs/config.xml` to offer robust testing features and to ensure the software quality at every stage of the development process. Here are the key features of our Jenkins pipeline Jenkinsfile:

1. **Parameterized Test Execution**
   The Jenkins job is parameterized with the ability to choose the browser (BROWSER) and the project (PROJECT) on which the tests are run. This provides flexibility in performing browser-based testing as per the specific requirements of the project.

2. **Concurrent Builds**
   Our system is designed to manage multiple build requests efficiently. We have a configuration in place that disables concurrent builds, which ensures that if a new build starts before the previous one finishes, the previous build gets aborted, avoiding any conflicts.

3. **SCM Integration**
   Our software testing system's Jenkins pipeline is linked to the SCM (Source Control Management). It's configured to poll the SCM every hour, and it triggers new test runs based on these changes - ensuring updated testing as the codebase evolves.

4. **Branch Management and Dependency Installation**
   Our Jenkins pipeline is capable of autonomously managing branch checkouts and dependency installations. It detects the latest branch in the git repository, checks it out, and installs the necessary dependencies for running the tests. Seamless browser installation is also incorporated, which is crucial for browser-based testing. This automation ensures the test setup process is quick, smooth, and reliable.

5. **Separate CI/CD job for each project from playwright.config**
   By separating the CI/CD job on individual projects we make the work with runs more flexible, accounting of run results becomes easier, and we create opportunities for parallel execution of runs of different test projects by different agents, increasing the overall productivity.

6. **Artifact Archival**
   After each test run, the results are archived for future reference. This ensures traceability, allowing us to look back at specific test runs' results if required. After the run is complete, you will see a message in the console with a link to the archive: "Playwright report generated and archived: ${env.BUILD_URL}artifact/playwright-report"

7. **Discards Old Builds**
   Our system is designed to retain builds for a certain period (1 day in this particular configuration) and then discard older ones. This strategy optimizes memory usage by discarding out-of-date build information.

### Playwright Configuration

Our software testing system offers a highly configurable environment for running end-to-end tests via the `playwright.config.js` file. This allows the system to adapt to specific project needs and provide an efficient testing process. Here are some of the configurations that can be done:

**Simultaneous Testing**: You can specify the number of tests that can run concurrently, improving testing efficiency.
**Timeout Control**: Control the maximum time a test is allowed to run before marking it as failed. This prevents lengthy, unresponsive tests from consuming unnecessary resources.
**Retry Attempts**: Configure the maximum number of retries when a test fails to ensure all tests are accurately verified.
**Test Pathing**: Specify the file paths for your tests, enabling organized and precise test runs.
**Test Tagging**: Ability to filter tests by tags that define rules for skipping tests or including them in test suites by functionality, device type, browser type.
**Environment Configurations**: Set specific settings unique to the projects being tested, enabling fine-tuned testing processes.
Our system follows best practices such as cross-browser testing, device-specific settings, test-skipping for known failing tests, usage of environment variables, feature-specific testing, and multiple reporting options for both local and CI environments.

### Data-Driven Testing (DDT)

**Data-Driven Testing (DDT)** is a core feature of the testing structure provided by this system. This allows tests to be data-centric, making them highly scalable and maintainable. This functionality resides in the `queryData.js` file under the `tests/test-data/googleSearch` directory.

The queryData.js file exports a set of constant arrays that serve as pre-defined inputs for different testing scenarios. These arrays contain various forms of data, offering a wide spectrum for testing.

The DDT pattern makes the test suite more flexible and scalable. Adding a new test case is as simple as adding a new object to the relevant array. This approach significantly reduces the amount of code written and enhances the manageability of the test suite.

### iFrame Handling

One of the notable features of the POM in the `tests/pages/googleCustomSearchEngineIframe.js` is the handling of iFrames. iFrames, or inline frames, are HTML documents embedded inside another HTML document on a website. They often present substantial challenges for automation testing, mainly because contents within iFrames are not immediately available for interaction.
By integrating this functionality, our system can confidently handle and interact with webpages that are built using complex structures and multiple layers of iFrames.

### Screenshot Comparison & Visual Regression

An integral part of our software testing system is the feature that compares actual screenshots to intended baseline screenshots for visual regression testing. This feature is encapsulated in the `compareScreenshotsAndReportDifferences()` method in the `utilities/fileSystemHelper.js` file.

#### Screenshot Comparison

It begins by fetching the expected baseline image and actual screenshot and converting them into pixel data. If required, it'll resize the actual screenshot to match the dimensions of the baseline image.

Pixel comparison between the two images is performed using the `pixelmatch` library. A threshold is set for this comparison to allow for a small level of mismatch (as defined by the `PIXEL_MATCH_THRESHOLD` constant).

If there are any mismatches detected, the function will create a **difference image highlighting the distinct pixels**. This image is temporarily stored and then deleted after it has been processed for the final report.

#### Reporting Differences

Once the comparison is complete, if any mismatches are found, the function **links the baseline image, actual screenshot, and the differences image to the HTML report**. All images involved in the comparison are attached to this report, granting a clear overview of the differences and enabling easier troubleshooting.

This approach provides a comprehensive method for visual testing, allowing testers to quickly identify visual regressions and enhance overall UI consistency.

### Performance Metrics Tracking

One of the features of `GoogleSearchPage` class lies in its ability to measure and track performance. This feature utilizes various APIs (**Performance.mark(), window.performance.measure(), Chromium Performance tracing, Chrome DevTool Protocol**) to efficiently collect, calculate, and report performance metrics **attaching all collected information to the corresponding test in an HTML report**.

### Test Lifecycle Management

Our testing system incorporates smart test lifecycle management through the `baseWithSharedContext.mjs` file. The code manages the test lifecycle around known bugs. It determines if tests should be skipped or failed based on existing known bugs documented in a knownBugs JSON file. Each test is configured based on the context options.

### Screenshot and Report Management

Another feature of our testing system implemented in the `baseWithSharedContext.mjs` file is efficient screenshot and report management. The system configures when screenshots should be taken and attaches them, along with known bug information, to the HTML report. This provides thorough documentation and eases debugging. Scenarios for successful tests can also have screenshots for better visualization.
Each failed test in the HTML report will be provided with this kind of additional information:

```
KNOWN ISSUES:
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------
```

### Known Bugs Tracking

Our testing system includes a `knownBugs.js` file that comprises a collection of known bugs. Each object in the file represents a specific bug and includes properties like the bug identifier, a brief description, the test spec file where the bug was found, the title of the test during which the bug was discovered, and its status across different environments. This feature enhances the traceability of the known bugs and helps handle them efficiently in subsequent test runs.

### Custom Test Reporting

The CustomReporter class located in `tests/setup/customReporter.js` is a feature of our software testing system that helps to generate detailed and specific test reports.

Key features within the custom report include:

#### Issue Categorization

Our system categorizes known bug issues related to tests based on the test outcome:

- Failed tests with known unfixed or fixed bug issues
- Failed tests without known bug issues
- Passed tests with known unfixed bug issues
  These lists are created as instance variables of the CustomReporter class and are updated after each test concludes.

#### Aggregate Test Reporting

The `onEnd(`) method comes into play at the end of all tests. It compiles all known bug issues according to their categories and generates a comprehensive report. This reporting is particularly helpful by providing a lucid understanding of the test execution, aiding debugging and system improvement efforts.

A set of helper functions located in `utilities/customReporterHelper.js` are utilized within the CustomReporter class to help classify bugs in test cases and collect data for reporting.

The final report in the console will be provided with this kind of additional information:

```
RUN STATUS: failed

==================================
<PROD> FAILED AND FLAKY TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (expected test status - FAILED):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------

==================================
<ALL> FAILED AND FLAKY TESTS WITHOUT KNOWN ISSUES (to determine the cause and link the bug):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS NO KNOWN ISSUE - to determine the cause and link the bug
------------------------

==================================
<PROD> FAILED AND FLAKY TESTS WITH KNOWN FIXED ISSUES ON THE ENVIRONMENT (to determine the cause and link or reopen the bug):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------

==================================
<PROD> PASSED (OR FLAKY) TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (to clarify and update the status of the linked bug):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------
```

## Prerequisites and Installation

Before you can run the Software Testing System locally, there are a few prerequisites you must meet and installation steps to follow:

### Prerequisites

#### Tools and Software

- **Node.js** - You need to have Node.js (v18.17.0) installed on your local development environment.

- **Browsers** - Ensure all browsers supported by Playwright are installed on your system.

- **Git** - The project uses Git for version control. You will need Git to clone the project repository.

#### Skills and Knowledge

- **JavaScript (ES6+)**: A solid understanding of JavaScript ES6 and later would be required to work on this project effectively.

- **Playwright**: Good understanding or experience of testing with Playwright.

#### Operating System

- The configuration and commands provided are compatible with **Windows** operating systems.

### Installation

Below are step by step instructions that guide you on how to get a development environment running:

1. **Install Node.js**: Begin by installing Node.js (v18.17.0) if you haven't already. Visit the [official Node.js website](https://nodejs.org/) to download and install the correct version.

```
node --version
```

2. **Clone the repository**:

- Git: The project uses Git for version control. You will need Git to clone the project repository. Visit the [official Git website](https://git-scm.com/) for download and installation instructions.

  ```
  git --version
  ```

- Clone the project repository from Github to your local machine.

  ```
  git clone https://github.com/Denys-quality-assurance/playwright_project_1.git
  ```

3. **Change to the directory**:

   ```
   cd playwright_project_1
   ```

4. **Install dependencies**: Next, use npm to install the dependencies required by the project. Run the following command from the root of the cloned repository:

   ```
   npm install
   ```

5. **Install Playwright browsers**: After that, you will need to install all Playwright compatible browsers:

   ```
   npx playwright install
   ```

By following the above steps, the project should be set up and ready for use on your local machine.

Thank you for the detailed information. Here's your requested README {chapter} for Codebase Structure:

---

## Codebase Structure

Below is a high-level outline of the Software Testing System's codebase structure with brief descriptions of their roles. This project follows a modular approach, separating concerns into self-contained, reusable pieces.

```
.
├── .eslintignore
├── .eslintrc.js
├── .git
├── .gitignore
├── .prettierignore
├── .vscode
│   └── settings.json
├── Jenkinsfile
├── jenkins_job_configs
│   └── config.xml
├── hooks
│   ├── baseWithSharedContext.mjs
│   ├── testWithAfterEachHooks.mjs
│   └── testWithGeolocation.mjs
├── package-lock.json
├── package.json
├── playwright.config.js
├── prettier.config.js
├── tests
│   ├── features
│   │   ├── googleCalculator
│   │   │   └── googleCalculator.spec.js
│   │   ├── googleCustomSearchEngine
│   │   │   └── googleCustomSearchEngine.spec.js
│   │   ├── googleMaps
│   │   │   └── googleMaps.spec.js
│   │   ├── googleSearch
│   │   │   ├── googleSearch_AutoSuggestionAndCorrection.spec.js
│   │   │   ├── googleSearch_CookieAndStorage.spec.js
│   │   │   ├── googleSearch_HomePageUI.spec.js
│   │   │   ├── googleSearch_KeyboardNavigation.spec.js
│   │   │   ├── googleSearch_PerformanceMetrics.spec.js
│   │   │   └── googleSearch_SearchResults.spec.js
│   │   └── googleSearchPictures
│   │       └── googleSearchPictures.spec.js
│   ├── knownBugs.js
│   ├── pages
│   │   ├── basePage.js
│   │   ├── googleCalculatorPage.js
│   │   ├── googleCustomSearchEngineIframe.js
│   │   ├── googleMapsPage.js
│   │   ├── googleSearchPage.js
│   │   └── googleSearchPicturesPage.js
│   ├── setup
│   │   └── customReporter.js
│   └── test-data
│       ├── googleCalculator
│       │   └── mathOperation.js
│       └── googleSearch
│           ├── acceptablePerformanceData.js
│           ├── baseline-images
│           │   ├── baseline_homepage_logo.png
│           │   └── baseline_homepage_logo_Webkit_Mobile.png
│           ├── mocks
│           │   └── responseBodyForEmptyResults.html
│           └── queryData.js
└── utilities
    ├── customReporterHelper.js
    ├── fileSystemHelper.js
    ├── googleCalculator
    │   └── calculatorHelper.js
    ├── pagesHelper.js
    └── regexHelper.js
```

### Key Files and Directories

- **`package.json` & `package-lock.json`**: These files hold various metadata relevant to the project, including its dependencies.

- **`Jenkinsfile` & `config.xml`**: The Jenkins pipeline which runs automated end-to-end tests on the Playwright JavaScript testing framework.

- **`hooks`**: This directory contains hooks to provide custom functionalities for `test` objects.

- **`tests`**: This directory encompasses the core of the testing system including the actual test scenarios (`features`), Page Object Models (`pages`), test setup files (`setup`), and test data (`test-data`).

- **`utilities`**: This directory comprises utility functions that aid in multiple functionalities across the project such as custom reporter, regex handling, file systems, and page interactions.

- **`playwright.config.js`**: This configuration file controls the settings for running end-to-end tests using Playwright test.

- **`eslint, prettier, git, vscode configs`**: These files contain the configurations for various tools used in the project. They help ensure code consistency, manage version control, and provide a streamlined development environment.

The structure of the codebase is mainly feature-centric, focusing on modularization and separation of concerns. It emphasizes reusability and scalability, making it easier to navigate, maintain, and expand on the existing project.

If you're new to the project, a good place to start would be the `tests/features` directory to understand the test scenarios, followed by a look at the Page Object Models (`tests/pages`). For a deeper understanding of the codebase, you should explore the `hooks` and `utilities` directories, which would give you valuable insight into the underlying workings of the test cases.

## Configuration/Environment Setup

This project supports environment variables for configuration. These are defined in the `playwright.config.js` and `Jenkinsfile` scripts and can be modified manually in the `package.json` file or via **terminal commands**.

### Environment variables

`CI`: Specifies if the tests are being run in a CI/CD environment.
`CI_WORKERS`, `workers`: Controls the number of workers in a CI/CD environment.
`PLAYWRIGHT_BROWSERS_PATH`: Defines the directory for downloaded browsers.
`BROWSER`: Specifies the browser to run the tests in.
`PROJECT`: Defines the project on which the tests are run.
`BASE_URL`: Specifies the base URL for the tests.
`CURRENT_ENV`: Defines the current environment of the project (e.g., QA, PrePROD, PROD).
`SKIP_TESTS_WITH_KNOWN_BUGS`: Determines if tests with known bugs should be skipped.
`PASSED_TESTS_SCREENSHOT`: Decides if screenshots for passed tests should be taken.

| Variable Name                | File                               | `package.json` Script          | Terminal Command                             |
| ---------------------------- | ---------------------------------- | ------------------------------ | -------------------------------------------- |
| `CI`                         | Jenkinsfile                        | N/A                            | N/A                                          |
| `CI_WORKERS`, `workers`      | Jenkinsfile / playwright.config.js | N/A                            | N/A                                          |
| `PLAYWRIGHT_BROWSERS_PATH`   | Jenkinsfile                        | N/A                            | N/A                                          |
| `BROWSER`                    | Jenkinsfile                        | N/A                            | N/A                                          |
| `PROJECT`                    | Jenkinsfile                        | `run_test_project`             | `npx playwright test --project=project_name` |
| `BASE_URL`                   | playwright.config.js               | `change_base_url_and_env`      | `$env:BASE_URL='http://new_base_url.com'`    |
| `CURRENT_ENV`                | playwright.config.js               | `change_base_url_and_env`      | `$env:CURRENT_ENV='QA'`                      |
| `SKIP_TESTS_WITH_KNOWN_BUGS` | playwright.config.js               | `skip_tests_with_known_bugs`   | `$env:SKIP_TESTS_WITH_KNOWN_BUGS='true'`     |
| `PASSED_TESTS_SCREENSHOT`    | playwright.config.js               | `screenshots_for_passed_tests` | `$env:PASSED_TESTS_SCREENSHOT='false'`       |

Please adjust these variables as necessary for your local development environment and system settings.

## CI Setup

The Continuous Integration (CI) setup for the project is performed using Jenkins. Jenkins pipelines defined in `Jenkinsfile` and `config.xml` constitute the CI setup to execute test projects defined in `playwright.config.js`.

### playwright.config.js

This is the configuration file for the Playwright test runner. It specifies several options that dictate how the tests are executed, what environment settings should be in place for the tests, and which test files should be included in the test execution.

Let's break down each of the key aspects of the `playwright.config.js` file:

- **`fullyParallel: true,`** - This setting allows for all tests to be run at the same time, in parallel. This greatly reduces the total time taken to execute all the tests.
- **`workers: process.env.CI ? 4 : 2,`** - The number of tests that are run concurrently is determined by the `workers` setting. In a Continuous Integration (CI) environment, you are running up to 4 tests at the same time. Locally, you are running up to 2 tests concurrently.
- **`timeout: 30000,`** - Here, tests have a maximum runtime of 30000 milliseconds (30 seconds) before they are deemed to have failed due to a timeout.
- **`retries: 2,`** - If a test fails to pass initially, the test runner will attempt to run it again a maximum of two more times before it is ultimately marked as a fail. This can help avoid false negatives due to flaky tests or network issues.
- **`testMatch: 'tests/**/\*.spec.js',`** - This line specifies the file path pattern to find test files. Current configuration is set to match all JavaScript files ending with `.spec.js` recursively in the tests directory.
- **`reporter`** - depending on whether the tests are run locally or in a CI environment, different reporting formats can be used - ranging from a verbose 'list' for local development to a concise 'dot' for less verbose reporting in CI environments.

The **`projects`** section in the config file represents the various configurations to be included in the test suite. This could represent testing in different browsers, on different devices, etc.
Each project configuration object has multiple sub-sections:

- **`name`** - Friendly name for the project, and also the name of the project that you will use in Jenkins job as PROJECT param for running tests.
  Naming convention: DeviceType_BrowserType_Summary_Environment

  - **DeviceType** - Desktop or Mobile.
  - **BrowserType** - any value of `defaultBrowserType` or `channel` in your `playwright.config.js file > projects > use > defaultBrowserType or channel`.
  - **Summary** - optional: additional explenation.
  - **Environment** - QA, PrePROD, PROD.
    Example: Desktop_Chromium_Features_PROD.

- **`grepInvert`** - A regular expression pattern used to exclude certain tests from the test run.
- **`testMatch`** - Similar to the global `testMatch`, this setting can further refine which test files are included for the project.
- **`grep`** - A regular expression pattern used to include certain tests from the test run.

- **`metadata`** - This object can hold additional metadata for the test run. The metadata will be attached to the test and can be used in your test and in the reporter:

  - **`currentENV`** - Environment to run tests of the project: QA, PrePROD or PROD.
  - **`skipTestsWithKnownBugs`** - Tests with unfixed bugs is skipped when SKIP_TESTS_WITH_KNOWN_BUGS is 'true'.
  - **`passedTestsScreenshots`** - Screenshots for passed tests are taken when PASSED_TESTS_SCREENSHOT is 'true'.

- **`use`** - This object includes the settings for the browser to use:
  - **`defaultBrowserType`** - An option that allows you to specify the default browser type for your tests: `'chromium'`, `'firefox'`, and `'webkit'`.
  - **`channel`** - An option that allows you to specify if the test should run on a particular version of Chromium-based browsers or the channels: `'chrome'`, `'chrome-beta'`, `'msedge'`, `'msedge-beta'`, `'msedge-dev'`.
  - **`headless`** - An option that allows you to run the browser without a graphical user interface (GUI)
  - **`baseURL`** - An option that provides a shorthand for your application's URL. Instead of typing the full URL of the application under test in each action or in each test, you can set a baseURL. Must correspond to the value of the `currentENV` variable

### How to configure playwright.config.js

1. The `playwright.config.js` should be located at the root of your project folder.
2. Configure your project settings accordingly based on the categories — `workers`, `timeout`, `retries`, `testMatch`, `projects`, `reporter`, etc.
3. Under `projects -> use`, ensure to have `baseURL` appropriately configured as per project requirement.
4. Save the changes and run your tests using the Playwright test runner command.

### Jenkinsfile

The `Jenkinsfile` defines the pipeline stages for the CI process. Stages include preparing the environment, pulling the latest branch of the project from the Git repository, installing dependencies, running tests, and archiving the results. Specific environment parameters such as 'PROJECT', 'BROWSER', 'CI', and 'CI_WORKERS' are also set in this file.

#### How to configure Jenkinsfile

1. The `Jenkinsfile` should be located at the root of your project folder.
2. For Jenkins to recognize and run this file, it should be loaded into your Jenkins server. An option when creating a new Jenkins pipeline is to define the pipeline script from SCM (Source Control Management), where you can specify your Git repository's URL and set 'Script Path' to `Jenkinsfile`.
3. Optional: Amend parameters and environment settings to customize the test run if needed.

### config.xml

`config.xml` is a sample Jenkins job configuration file that contains settings such as the job name, description, project repository URL, log rotation, concurrent build options, parameters, triggers, etc.

#### How to configure config.xml

1. This file is generally stored inside the Jenkins job configurations folder, usually located under the `$JENKINS_HOME/jobs/<job_name>` directory.
2. To install this as a Jenkins job, you can create a new directory `jobs/<job_name>` and simply copy this `config.xml` into the `jobs/<job_name>` directory
3. The job has two parameters `PROJECT` and `BROWSER` under `<parameterDefinitions>` that are string parameters and have default values. They must be updated for each job.
   The default `PROJECT` is "Desktop_Google_Chrome_PROD", but this can be updated to any project `name` in your `playwright.config.js file > projects > name`.
   The default `BROWSER` is "chrome", but this can be updated to any `defaultBrowserType` or `channel` in your `playwright.config.js file > projects > use > defaultBrowserType or channel`.
4. Make sure to edit the SCM settings according to your project, such as the `<url>` and `<credentialsId>` tags under `<userRemoteConfigs>` with the correct Git repository URL.
5. If necessary, update the version of the plugins.
6. Reload the configuration. This can also be done via Jenkins UI/API.

After setting up the CI files, you're all set to run the pipeline via Jenkins! The pipeline will trigger according to the schedule set in the configuration (currently set to every hour), fetch the latest Git branch, and run tests according to the parameters provided.

## Running Tests

### Run All Test files

To run all your test files across all projects from `playwright.config.js` on your local machine, use the following command:

```
npx playwright test
```

### Run a Group of Test files

To run a group of tests across all projects from `playwright.config.js`, you can use a glob to specify the files you want to include. Make sure your test files are organized in such a way that you can easily select a group using a glob.

For example, to run all test files in the 'googleSearch' directory across all projects from `playwright.config.js`:

```
npx playwright test tests/features/googleSearch*.spec.js
```

### Run a Single Test file

To run a single test file across all projects from `playwright.config.js`, specify the path to the file:

```
npx playwright test tests/features/googleSearch/googleSearch_SearchResults.spec.js
```

### Run Specific Project

To run all tests of a specific project as defined in your `playwright.config.js`, use the `--project` option followed by the project name:

```
npx playwright test --project=Desktop_Google_Chrome_PROD
```

### Run Tests Using Tags via project settings

As defined in the `playwright.config.js`, we can include/exclude tests based on the tags provided in the `grep` and `grepInvert` property of the `project`. Add a project with the required properties using the explanations from [playwright.config.js](#playwright.config.js).

### Run Tests that match a certain pattern via command-line

The --grep option in the npx playwright test command-line tool is used to only run tests that match a certain pattern. It's a way of filtering tests based on their names.

```
npx playwright test --project=Desktop_Google_Chrome_PROD --grep=@filters
```

or

```
npx playwright test --project=Desktop_Google_Chrome_PROD --grep='search results page'
```

## Test Selection Using `test.describe.only`, `test.describe.skip`, `test.only` and `test.skip`

In your project, you can further specify a subset of tests to run within a test file using `test.describe.only`, `test.describe.skip`, `test.only` and `test.skip` methods.

- `test.describe.only`: This allows for specifying that only the described block of tests should be executed.

- `test.describe.skip`: This allows for specifying that the described block of tests should be skipped.

- `test.only`: This specifies that only this particular test should be executed.

- `test.skip`: This specifies that this particular test should be skipped.

For example:

```javascript
test.describe.only('Describe Block Title', () => {
  test.skip('TEST-1: Test Title @tags', async () => {
    // test code
  });
});
```

## Test Result Analysis

### Understanding Test Reports

Test reports are generated based on the `reporter` configuration defined in `playwright.config.js`. Running your tests either locally or inside a CI/CD environment will output an HTML report along with console logs in different formats according to your configurations.

In the `reporter` configuration:

- `dot` provides a very concise output to the console. It prints a single character for every test result - a dot for a passing test, `F` for a failing one, and so on.
- `list` provides a more detailed output to the console. It prints each test's status, duration, and name, along with any errors and their stack trace for failed tests.
- `html` generates an HTML report that provides an overview of your test suites, individual test cases and, if applicable, details of known bugs, and screenshots of test runs.
- `./tests/setup/customReporter.js` helps to generate detailed and specific test reports. Its main features described in the paragraph [Custom Test Reporting](#Custom-Test-Reporting)

### Interpreting Test Reports

#### HTML Report

Open the HTML report in a browser to view the test results.

- For the local run use the command:

```
npx playwright show-report
```

- For CI/CD run:
  After the run is complete, you will see a message in the console with a link to the archive:

```
"Playwright report generated and archived: ${env.BUILD_URL}artifact/playwright-report"
```

The report includes the outcome of every test case, output from console logs, and screenshot images (if applicable and set up).
[Environment variables](#Environment-variables): `PASSED_TESTS_SCREENSHOT` decides if screenshots for passed tests should be taken.

It also contains detailed information for failed tests, such as error messages, stack traces, and attached known bug info ([Screenshot and Report Management](#Screenshot-and-Report-Management)):

```
KNOWN ISSUES:
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------
```

Here you can see if this test has related bugs and their fix statuses for all environments.

[Test Lifecycle Management](#Test-Lifecycle-Management): If a test has related bugs in `knownBugs.js`, then it is marked as one that should fail, i.e. its expected status is `'failed'`, and if its actual status is `'passed'`, it will be considered a deviation from expectation and will be noted in the report.

#### Console Report

The console has two forms of reporting, `dot` and `list`. After a test run, you will have a console report detailing your known bug issues. You may inspect this log to understand the failure points and link the issues to known bugs:

- For `dot`: Each dot represents a test case, making up a concise report of passing, failing, and skipped tests.
- For `list`: Each line represents a complete report of a single test. It provides more details on pass/fail status and error messages.

### Analyzing Known Bug Issues

`knownBugs.js` contains a collection of known bugs that can aid in debugging failed test. When a test fails, the system checks if the failure is associated with a known issue. It provides additional information such as the bug identifier, status, and test details. By examining this file and the details attached, you can significantly improve your debugging process.

### Custom Test Reporting

[Aggregate Test Reporting](#Aggregate-Test-Reporting): With the custom reporter configured in `./tests/setup/customReporter.js`, after your test execution, there's an aggregated report that consolidates the known issue categorization in the console, empowering you to have a lucid understanding of your test execution status.

```
RUN STATUS: failed

==================================
<PROD> FAILED AND FLAKY TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (expected test status - FAILED):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------

==================================
<ALL> FAILED AND FLAKY TESTS WITHOUT KNOWN ISSUES (to determine the cause and link the bug):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS NO KNOWN ISSUE - to determine the cause and link the bug
------------------------

==================================
<PROD> FAILED AND FLAKY TESTS WITH KNOWN FIXED ISSUES ON THE ENVIRONMENT (to determine the cause and link or reopen the bug):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------

==================================
<PROD> PASSED (OR FLAKY) TESTS WITH KNOWN UNFIXED ISSUES ON THE ENVIRONMENT (to clarify and update the status of the linked bug):
==================================
[RUN STATUS] [Test_project_name] › tests\features\Feature_X_\Test_Script_Y_.js › Test Describe Title › Test ID: Test Title @tags
››› HAS KNOWN ISSUE [fix_status][BUG ID][QA:'fix_status',PrePROD:'fix_status',PROD:'fix_status'] Issue Description
------------------------
```

### Troubleshooting Tests

To troubleshoot failing tests, examine the error messages and stack trace for any failed test case depicted in the console log or HTML report. If a failed test is attached with known bug information, examine the bug details and its status across different environments. Use this information to determine whether the test failure is due to this known bug. If a test without known bug info is failing, investigation may be necessary to identify the cause and link it with an existing bug or open a new one.

- If the test `'failed'` and does not have any related bugs, a new bug should be created and added to `knownBugs.js`.
- If the test `'failed'` and has `unfixed` related bugs, it is worth checking whether it really failed due to these known issues.
- If the test `'failed'` and has `fixed` related bugs, it is worth to determine the cause and link or reopen the bug.
- If the test `'passed'` and has `unfixed` related bugs, it is worth checking the fix status of these bugs for current environment (perhaps the status was not updated in `knownBugs.js` after the fix).

## Writing Tests

When creating new tests for the software testing system, it's **important to follow a standardized structure and naming conventions**. This section gives detailed guidelines on creating new tests.

### Test Spec Naming and Folder Structure

The naming of test spec files and their folder structure is crucial for easy navigation and understanding the purpose of each test in the project.

Each test spec file should be named according to the main feature or functionality it is testing. It should be placed under the `/tests/features` folder, which contains a **separate folder for each feature**. Each feature's folder then contains its respective test spec files.

The structure of the folders and test specs helps to understand the hierarchy and grouping of the tests at an high level.

Here is an example of a good folder and test spec structure:

- tests/
  - features/
    - googleSearch/
      - googleSearch_AutoSuggestionAndCorrection.spec.js
      - googleSearch_CookieAndStorage.spec.js
      - googleSearch_HomePageUI.spec.js
      - googleSearch_KeyboardNavigation.spec.js
      - googleSearch_PerformanceMetrics.spec.js
      - googleSearch_SearchResults.spec.js

Spec files are saved with the `.spec.js` extension and a description of the functionality they are testing.

### Page Objects

Each test file should **import its required page objects**, which are classes that encapsulate the page-level operations that your tests will use. This helps keep your test code clean and maintainable.

```javascript
import GoogleSearchPage from '../../pages/googleSearchPage';
```

### Describe

Each test file should contain a `describe` block to organize related tests. The `describe` function is conventionally used to group related tests.

```javascript
test.describe('Describe Block Title @tags', () => {
  // Test cases go here
});
```

You can include additional tags in your test title, which help categorize the tests.

### Utilizing Conditional Test Execution

The `test.fail` and `test.skip` methods control the test execution based on certain conditions. This is beneficial for test management.

```javascript
test.describe(`Describe Block Title @tags`, () => {
  // Test should be failed when the condition is true: there is at least 1 unfixed bug
  test.fail(
    ({ shouldFailTest }) => shouldFailTest,
    `Test marked as "should fail" due to the presence of unfixed bug(s)`
  );
  // Test should be skipped when the condition is true: flag skipTestsWithKnownBugs is 'true' and there is at least 1 unfixed bug
  test.skip(
    ({ shouldSkipTest }) => shouldSkipTest,
    `Test skipped due to the presence of unfixed bug(s)`
  );
```

### Proper Setup and Teardown

`beforeEach` hooks are utilized to do necessary setup before each test. This eliminates redundant code and makes test independent of each other.

```javascript
test.beforeEach(
  'Navigate to Home page and reject all Cookies',
  async ({ sharedContext }, testInfo) => {
    // Prepare the test only if the test is not skipped
    if (testInfo.expectedStatus !== testStatus.SKIPPED) {
      page = await sharedContext.newPage();
      const isMobile = sharedContext._options.isMobile || false; // type of device is mobile
      googleSearchPage = new GoogleSearchPage(page, isMobile);
      await googleSearchPage.goToHomeAndRejectCookies();
    }
  }
);
```

### Test Case

Each individual test case should be defined with the `test` function. The first argument should be the title of the test case, and the second should be a callback function, which is the test's code.

```javascript
test('TEST-1: Test Title @tags', async ({}) => {
  // test code
});
```

You can include additional tags in your test title, which help categorize the tests.

#### Test Identification

Each test case must have an **unique identifier**. This helps to easily identify and reference a specific test. The identifier should be at the beginning of the test's title and follow the format `TEST-X` where `X` is the test's unique number.

Here is an example of a test title with a unique identifier:

```javascript
test('TEST-1: Test Title @tags', async ({ sharedContext }) => {
  // test code
});
```

#### Tags

Tags are statements that are added to describe the operator and can be added to the test title or to the `describe` block. They can be used to filter or differentiate tests.

```javascript
test('TEST-1: Test Title @only-desktop @mocked @results @filters', async ({
  sharedContext,
}) => {
  // test code
});
```

**Tags for filtering by device type**:

- @only-desktop
- @only-mobile

**Tags for filtering by browser type**:

- @only-chromium
- @skip-for-chromium
- @skip-for-webkit
- @skip-for-edge
- @skip-for-firefox

**Tags for filtering tests using mock response**:

- @mocked

**Tags for filtering tests by application features**:

- @results
- @filters
  ...

### Data-Driven Testing

The test is not hardcoded with specific data. Instead, it derives its inputs from an external data source, this enhances coverage with various combinations of inputs.

```javascript
queryDataGeneral.forEach((queryData) => {
  test(`TEST-1: Response body contains '${queryData.query}' query @results`, async () => {
    // Test code
  });
});
```

### Expect

Use `expect` to make assertions on some data. Most tests will include at least one `expect` statement, but not more than 6.

```javascript
expect(response.status()).toEqual(200);
```

#### Using custom error messages in `expect` functions

Using custom error messages in `expect` functions provides several advantages for both writing and maintaining your test cases.
Custom error messages make the test results more readable, tell you exactly what was expected and why it failed.

For example,

```javascript
expect(
  await searchResultsLocator.count(),
  `Search results page doesn't contain more than 1 result for the '${query}' query`
).toBeGreaterThan(1);
```

gives a much clearer idea of what went wrong if the test fails.

### Importing Needed Resources

Test utilities, helper classes, and data for tests are imported at the top of the file, allowing easy modification if resources' location changes.

```javascript
import test from '../../../hooks/testWithAfterEachHooks.mjs';
import GoogleSearchPage from '../../pages/googleSearchPage';
import {
  queryDataGeneral,
  queryDataCaseInsensitive,
  queryDataEmptyResults,
} from '../../test-data/googleSearch/queryData';
import { performSearchAndFetchResultsForNewPage } from '../../../utilities/pagesHelper';
```

### Consistent Naming Conventions

Variables and constants are written in camel case, following JavaScript conventions.

```javascript
const testStatus = {
  SKIPPED: 'skipped',
};
```

### Comprehensive Commenting

A well-documented codebase is easy to understand and maintain. The initial block comment gives an overview of what the test suite is doing. It concisely describes the purpose of the test, the setup steps, and the data sources for testing, which is beneficial when looking at the setup and purpose of the test suite.

```javascript
/*
 * Google Search Functionality Test Suite:
 * This test suite is designed to validate the search functionality of Google while emphasizing the crucial aspects.
 *
 * The suite configures and provides instances of page and googleSearchPage prior to running tests.
 * For the testing environment setup, it navigates to the homepage and rejects all cookies.
 *
 * The GoogleSearchPage class contains helper methods for the entire mechanism of the functionality being evaluated.
 *
 * The data for the search queries is imported from queryData and can be used with Data-driven testing (DDT) approach.
 *
 */
```

## Code Styleguides / Linting

Maintaining coding style and conventions is vital in every project, especially when collaborating with a team. This would involve following a set styleguide or rules that enforces consistency in the code.

In this project, we prioritize readability and maintainability. To help us achieve this, we use ESLint for identifying and reporting coding issues, and Prettier for automated formatting of our code.

### ESLint

ESLint is a highly configurable and pluggable JavaScript linter. An `.eslintrc.js` file has been provided in the project, which configures ESLint to work with the code base.

The ESLint configuration includes various environments, plugins, and rules. Notable configurations include "eslint:recommended", providing a base set of rules, 'playwright/recommended', that enforces best practices for Playwright, and 'plugin:prettier/recommended', which ensures that Prettier and ESLint do not conflict.

### Prettier

Prettier is a code formatter that ensures that all output code conforms to a consistent style by parsing your code and re-printing it with its own rules. A `prettier.config.js` file is added to the project to specify preferred code format options.

### VS Code Configuration

For people using the Visual Studio Code editor, a `settings.json` file in the `.vscode` directory has been created. This file defines the configuration of the Prettier extension for VS Code. It applies the ESLint rules when you save or copy-paste the code.

To apply the configurations, you need to have the **Prettier - Code formatter** and **ESLint** extension installed in your VS Code editor.

### Scripts

The `package.json` file provides the following scripts for convenience:

| Script                           | Description                                                  | Terminal command |
| -------------------------------- | ------------------------------------------------------------ | ---------------- |
| `"lint": "eslint ."`             | Runs ESLint to identify and report on patterns in JavaScript | `npm run lint`   |
| `"format": "prettier --write ."` | Runs Prettier to format the code                             | `npm run format` |

Running these scripts will help in keeping the codebase clean and consistent.

**Please ensure you run these commands before committing your code.**

## Error Handling and Debugging

Detecting, handling and debugging errors are important aspects of developing a robust test suite. This guide will help you understand how our testing framework handles errors and provides debugging capabilities.

### Using `expect` for Assertions in Tests

In Playwright we use the `expect` function with **custom error messages** to run assertions. It is used to verify that a certain part of code behaves as expected, by asserting the truthiness of a certain statement, and provide information about the type of error.

Look at the following example:

```javascript
expect(
  correctedQueryLocatorText,
  `The message "Showing results for <correcter query>" doesn't contain the corrected '${queryData.correctedQuery}' query`
).toContain(queryData.correctedQuery);
```

This uses `toContain` to check that the `correctedQueryLocatorText` includes the `correctedQuery`.

### Use Test Result Analysis

Look at [Test Result Analysis](#Test-Result-Analysis)

### Using Try/Catch Blocks for Error Handling

In order to control the flow of our code process, especially when an error occurs, we employ the use of try/catch blocks in our functions. These blocks will try to execute a block of code and if an error occurs, it will catch that error and execute specific code to handle the error.

```javascript
async viewSelectedPictureInPreview(picture) {
  try {
    await this.clickOrTap(picture);
    return await this.getLocator(this.selectors.picturePreview);
  } catch (error) {
    console.error(`Failed to open picture preview: ${error.message}`);
  }
}
```

In the above snippet, if there's an error when trying to select a picture, it will not stop the whole execution. It catches the error and logs it, allowing the developer to understand what went wrong.

### Debugging with Playwright

To debug your test suite, Playwright provides a way to run your tests in debug mode. You can run tests in debug mode with the following npm script:

```shell
npx playwright test --project=Desktop_Google_Chrome_PROD --debug
```

This starts the test runner in debug mode. This will launch the browser in non-headless mode. Also, debug information will be sent to stdout aiding your debugging process.

The debug mode outputs helpful information about the test runner, including a step-by-step advancement of the test.

### Debugging with Visual Studio Code

Visual Studio Code (VS Code) offers an integrated debugger that helps you set breakpoints, step through code, inspect variables and view the call stack. VS Code’s built-in debugger helps accelerate your edit, compile and debug cycle.

Here are the steps on how to set it up:

1. **Set Breakpoints:** Navigate to the source code where you want to stop executing and click to the left of the line number to set the breakpoint.

2. **Start Debugging:** Go to `package.json`, hover over the script (for example: `"run_test_project"`) and select `Debug Script`.
   At this point, you can inspect variables, execute commands in the Debug Console, and even change the value of variables.

## Contributing / Pull Request Process

Contributing to a project is a fantastic opportunity to improve software that you rely on. Here is a guide that will help you understand how to make a valuable contribution to this project. We look forward to your input!

### Branching Strategy

The main and develop branches are permanent branches in this project.

- **`main`** branch: This branch is for production-ready code. Merges into the main branch are finalized versions that are ready to go live. It always provides stable code.

- **`develop`** branch: This branch is used for integration of features. All development work converges into the `develop` branch. New features are pulled from this branch.

For task-specific updates, create a new branch from `develop` branch.

#### Task Branch Naming

A task branch should have a clear and descriptive name for better understanding.

Branch naming could follow this pattern: **`TASK_TYPE/TASK_ID:TASK_DESCRIPTION`**. This type of naming identifies right away the kind of task, the associated ID, and a brief description.

**TASK_TYPE**: `ta` - test automation.

**Examples:**

```shell
ta/TASK-123:Auto_suggestion
```

#### Git commands

1. **Switch to the `develop` branch:**

```shell
git checkout develop
```

2. **Pull the latest changes from the remote `develop` branch:**

```shell
git pull origin develop
```

3. **Create and check out a new branch:**

```shell
git checkout -b <your-branch-name>
```

Where `<your-branch-name>` should be replaced with your actual branch name.

4. **Verify current branch:**

```shell
git branch --show-current
```

Now, you have created a new branch from the `develop` branch and have switched to it.

### Pull Request Process

When you have implemented a test in your task branch, create a Pull Request (PR) to the `develop` branch.

Follow these steps for submitting a pull request:

1. Run `npm run format` and `npm run lint` ([Scripts](#Scripts))
2. **Commit & Push** - Commit your changes and push your task branch to the remote repository.

```shell
git add .
```

```shell
git commit -m "Meaningful commit message"
```

```shell
git push origin <your-branch-name>
```

3. **Create Pull Request** - Visit the repository page on GitHub, and click on the 'New pull request' button.
4. **Base & Compare** - Select the `develop` branch as a base, compare it with your task branch, and click 'Create pull request'.
5. **Pull Request Description** - Provide a clear and concise description of what the pull request includes, what changes you've made, and any additional context.
6. **Code Review** - After creating the PR, request a review. As per the review comments, update your code and push to the task branch if necessary.
7. **Clean History** - Ensure your feature branch updates with the latest version of `develop` branch.

```shell
git pull --rebase origin develop
```

8. **Merge Pull Request** - Once the PR has been reviewed and approved, it is ready to be merged into `develop`.
9. **Clean-up** - Clean up by deleting your task branch after a successful merge.
   Delete your task branch remotely:

```shell
git push origin --delete <your-branch-name>
```

And delete your task branch locally:

```shell
git branch -d <your-branch-name>
```
