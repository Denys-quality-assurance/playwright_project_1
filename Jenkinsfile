def latestBranch = ''

pipeline {
    agent any
    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0' // to download browsers into the project's local node_modules folder - a directory Jenkins can read
        CI = 'true' // to tell the script that we're in a CI/CD environment
        CI_WORKERS = '5' // to controll the amount of workers in the CI/CD environment
    }
    stages {
        stage('Get latest branch') {
            steps {
                script {
                    "git clone https://github.com/Denys-quality-assurance/playwright_project_1" // clone the repository to a local workspace
                    // takes the first line of output; because we've sorted by committerdate, this will be the most recently updated branch
                    def fullBranchName = powershell(returnStdout: true, script: 'git for-each-ref --sort=-committerdate --format="%(refname:short)" refs/remotes/origin | Select-Object -First 1').trim()
                        latestBranch = fullBranchName - 'origin/'
                    echo "The latest branch: ${latestBranch}"
                }
            }
        }
        stage('Run tests') {
            steps {
                runTests("${params.BROWSER}", latestBranch)
            }
        }
    }
}

void runTests(String browser, String latestBranch) {
    script {
        stage("Checkout ${browser}") {
            echo "Checking out branch ${latestBranch}"
            git url: 'https://github.com/Denys-quality-assurance/playwright_project_1', branch: "${latestBranch}"
        }
        stage("Install dependencies ${browser}") {
            bat 'npm ci'
        }
        stage("Install browser ${browser}") {
            bat "npx playwright install ${browser}"
        }
        stage("Run tests ${browser}") {
            // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]){    
            bat "npx playwright test tests/ --project=${browser}"
            //}
        }
        stage("Archive artifacts for ${browser}") {
            archiveArtifacts 'playwright-report/**'
            echo "Playwright report generated and archived: ${env.BUILD_URL}artifact/playwright-report"
        }
    }
}