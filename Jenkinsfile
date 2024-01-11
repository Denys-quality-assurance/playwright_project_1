def latestBranch = ""

pipeline {
    agent any
    parameters { 
        string(name: "PROJECT", defaultValue: params.PROJECT ?: "Desktop Google Chrome", description: "Project name") // If the job already has a defined default value, it will be retained rather than overwritten
        string(name: "BROWSER", defaultValue: params.BROWSER ?: "chrome", description: "Browser to run the tests") // If the job already has a defined default value, it will be retained rather than overwritten     
    }
    environment {
        PLAYWRIGHT_BROWSERS_PATH = "0" // to download browsers into the project's local node_modules folder - a directory Jenkins can read
        CI = "true" // to tell the script that we're in a CI/CD environment
        CI_WORKERS = "5" // to controll the amount of workers in the CI/CD environment
    }
    stages {
        stage("Get latest branch") {
            steps {
                script {
                    "git clone https://github.com/Denys-quality-assurance/playwright_project_1" // clone the repository to a local workspace
                    // takes the first line of output; because we've sorted by committerdate, this will be the most recently updated branch
                    def fullBranchName = powershell(returnStdout: true, script: "git for-each-ref --sort=-committerdate --format='%(refname:short)' refs/remotes/origin | Select-Object -First 1").trim()
                        latestBranch = fullBranchName - "origin/"
                    echo "The latest branch: ${latestBranch}"
                }
            }
        }
        stage("Run tests") {
            steps {
                runTests("${params.PROJECT}", "${params.BROWSER}", latestBranch)
            }
        }
    }
    post {
        always {
            archiveArtifacts "playwright-report/**"
            echo "Playwright report generated and archived: ${env.BUILD_URL}artifact/playwright-report"
        }
    }
}

void runTests(String project, String browser, String latestBranch) {
    script {
        stage("Checkout ${project}") {
            echo "Checking out branch ${latestBranch}"
            git url: "https://github.com/Denys-quality-assurance/playwright_project_1", branch: "${latestBranch}"
        }
        stage("Install dependencies ${project}") {
            bat 'npm ci'
        }
        stage("Install browser ${browser}") {
            bat "npx playwright install ${browser}"
        }
        stage("Run tests ${project}") {
            // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]){    
            bat "npx playwright test tests/ --project='${project}'"
            //}
        }
    }
}