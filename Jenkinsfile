def latestBranch = ''

pipeline {
    agent none // don't allocate an executor for the entire Pipeline
    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0' // to download browsers into the project's local node_modules folder - a directory Jenkins can read
    }
    stages {
        stage('Get latest branch') {
            agent any
            steps {
                script {
                    "git clone https://github.com/DenysMatolikov/playwright_project_1" // clone the repository to a local workspace
                    // takes the first line of output; because we've sorted by committerdate, this will be the most recently updated branch
                    latestBranch = bat(
                        script: "git for-each-ref --sort='-committerdate' --format='%(refname:short)' refs/remotes/origin | head -n1",
                        returnStdout: true
                    ).trim()

                    echo "Checking out branch ${latestBranch}"
                }
            }
        }
        stage('Run tests') {
            parallel {
                stage('Chromium') {
                    // agent { label 'chromium' } // specific agent for chromium tests
                    agent any
                    steps {
                        runTests('chromium', latestBranch)
                    }
                }
                stage('Firefox') {
                    // agent { label 'firefox' } // specific agent for firefox tests
                    agent any
                    steps {
                        runTests('firefox', latestBranch)
                    }
                }
                stage('Webkit') {
                    // agent { label 'webkit' } // specific agent for webkit tests
                    agent any
                    steps {
                        runTests('webkit', latestBranch)
                    }
                }
            }
        }
    }
}

void runTests(String browser, String latestBranch) {
    script {
        stage("Checkout ${browser}") {
            git url: 'https://github.com/DenysMatolikov/playwright_project_1', branch: ${latestBranch}
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
    }
}