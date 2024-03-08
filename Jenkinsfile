/*
 * This Jenkins pipeline is designed to run automated end-to-end tests on the 
 * Playwright JavaScript testing framework.
 *
 * The main points of the file are:
 * - Parameters for choosing the browser for the tests to run
 * - Cloning the latest git branch, installing dependencies, and downloading the specified browser
 * - Running the tests on the Playwright framework 
 * - Archiving the results of the testing process
 */

def latestBranch = ""

pipeline {
    agent any
    parameters { 
        // Defines the project on which the tests are run
        string(name: "PROJECT", defaultValue: params.PROJECT ?: "Desktop Google Chrome", description: "Project name") // If the job already has a defined default value, it will be retained rather than overwritten
        // Defines the browser in which the tests are run
        string(name: "BROWSER", defaultValue: params.BROWSER ?: "chrome", description: "Browser to run the tests") // If the job already has a defined default value, it will be retained rather than overwritten     
    }
    environment {
        PLAYWRIGHT_BROWSERS_PATH = "0" // Download browsers into the project's local node_modules folder. This directory is available to Jenkins
        CI = "true" // Indicates that the script is running in a CI/CD environment
        CI_WORKERS = "4" // Controls the number of workers in the CI/CD environment
    }
    stages {
        stage("Get latest branch") {
            steps {
                script {
                    "git clone https://github.com/Denys-quality-assurance/playwright_project_1" // Clone the repository to a local workspace
                    // takes the first line of output; because we've sorted by committerdate, this will be the most recently updated branch
                    def fullBranchName = powershell(returnStdout: true, script: "git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/remotes/origin | Select-Object -First 1").trim()
                        latestBranch = fullBranchName - "origin/"
                    echo "The latest branch: ${latestBranch}"
                }
            }
        }
        stage("Run tests") {
            steps {
                runTests("${params.PROJECT}", "${params.BROWSER}", latestBranch) // Runs the tests on the latest branch
            }
        }
    }
    post {
        always {
            archiveArtifacts "playwright-report/**" // Archives the Playwright reports
            echo "Playwright report generated and archived: ${env.BUILD_URL}artifact/playwright-report" // Logs the URL of the archived reports
        }
    }
}

void runTests(String project, String browser, String latestBranch) {
    script {
        stage("Checkout") {
            echo "Checking out branch ${latestBranch}"
            git url: "https://github.com/Denys-quality-assurance/playwright_project_1", branch: "${latestBranch}" // Checks out the latest branch
        }
        stage("Install dependencies") {
            bat 'npm ci' // Installs the NPM modules required for the project
        }
        stage("Install browser ${browser}") {
            bat "npx playwright install ${browser}" // Installs the browser 
        }
        stage("Run tests ${project}") {
            // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]){    
            bat "npx playwright test tests/ --project=${project}" // Runs the tests
            //}
        }
    }
}