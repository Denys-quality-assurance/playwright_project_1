# Software Testing System with Playwright and Jenkins

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

5. **Artifact Archival**
   After each test run, the results are archived for future reference. This ensures traceability, allowing us to look back at specific test runs' results if required.

6. **Discards Old Builds**
   Our system is designed to retain builds for a certain period (1 day in this particular configuration) and then discard older ones. This strategy optimizes memory usage by discarding out-of-date build information.

### Playwright Configuration

Our software testing system offers a highly configurable environment for running end-to-end tests via the `playwright.config.js` file. This allows the system to adapt to specific project needs and provide an efficient testing process. Here are some of the configurations that can be done:

**Simultaneous Testing**: You can specify the number of tests that can run concurrently, improving testing efficiency.
**Timeout Control**: Control the maximum time a test is allowed to run before marking it as failed. This prevents lengthy, unresponsive tests from consuming unnecessary resources.
**Retry Attempts**: Configure the maximum number of retries when a test fails to ensure all tests are accurately verified.
**Test Pathing**: Specify the file paths for your tests, enabling organized and precise test runs.
**Environment Configurations**: Set specific settings unique to the projects being tested, enabling fine-tuned testing processes.
Our system follows best practices such as cross-browser testing, device-specific settings, test-skipping for known failing tests, usage of environment variables, feature-specific testing, and multiple reporting options for both local and CI environments.

### Test Lifecycle Management

Our testing system incorporates smart test lifecycle management through the `baseWithSharedContext.mjs` file. The code manages the test lifecycle around known bugs. It determines if tests should be skipped or failed based on existing known bugs documented in a knownBugs JSON file. Each test is configured based on the context options.

### Screenshot and Report Management

Another feature of our testing system is efficient screenshot and report management. The system configures when screenshots should be taken and attaches them, along with known bug information, to the HTML report. This provides thorough documentation and eases debugging. Scenarios for successful tests can also have screenshots for better visualization.

### Known Bugs Tracking

Our testing system includes a `knownBugs.js` file that comprises a collection of known bugs. Each object in the file represents a specific bug and includes properties like the bug identifier, a brief description, the test spec file where the bug was found, the title of the test during which the bug was discovered, and its status across different environments. This feature enhances the traceability of the known bugs and helps handle them efficiently in subsequent test runs.

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

```sh
node --version
```

2. **Clone the repository**:

- Git: The project uses Git for version control. You will need Git to clone the project repository. Visit the [official Git website](https://git-scm.com/) for download and installation instructions.

  ```sh
  git --version
  ```

- Clone the project repository from Github to your local machine.

  ```sh
  git clone https://github.com/Denys-quality-assurance/playwright_project_1.git
  ```

3. **Change to the directory**:

   ```sh
   cd playwright_project_1
   ```

4. **Install dependencies**: Next, use npm to install the dependencies required by the project. Run the following command from the root of the cloned repository:

   ```sh
   npm install
   ```

5. **Install Playwright browsers**: After that, you will need to install all Playwright compatible browsers:

   ```sh
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
