pipeline {
    agent none // don't allocate an executor for the entire Pipeline
    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0' //to download browsers into the project's local node_modules folder - a directory Jenkins can read
    }
    stages {
        stage('Run tests') {
            parallel {
                stage('Chromium') {
                    agent any
                    steps {
                        runTests('chromium')
                    }
                }
                stage('Firefox') {
                    agent any
                    steps {
                        runTests('firefox')
                    }
                }
                stage('Webkit') {
                    agent any
                    steps {
                        runTests('webkit')
                    }
                }
            }
        }
    }
}

def runTests(browser) {
    stages {
        stage('Checkout for ${browser}') {
            steps {
                git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                    branch: 'main'
            }
        }
        stage('Install dependencies for ${browser}') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Install browser for ${browser}') {
            steps {
                bat 'npx playwright install ${browser}'
            }
        }
        stage('Run tests for ${browser}') {
            steps {
                // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                bat 'npx playwright test tests/ --project=${browser}'
            }
        }
    }
}