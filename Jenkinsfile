pipeline {
    agent none // don't allocate an executor for the entire Pipeline
    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0' //to download browsers into the project's local node_modules folder - a directory Jenkins can read
    }
    stages {
        stage('Checkout') {
            agent any
            steps {
                git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                branch: 'main'
            }
        }
        stage('Install dependencies') {
            agent any
            steps {
                bat 'npm ci'
            }
        }
        stage('Install browsers') {
            agent any
            steps {
                bat 'npx playwright install'
            }
        }
        stage('Run tests') {
            parallel {
                stage('Run tests on Chromium') {
                    agent any
                    steps {
                        // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                            bat 'npx playwright test tests/ --project=chromium'
                    }
                }
                stage('Run tests on Firefox') {
                    agent any
                    steps {
                        // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                            bat 'npx playwright test tests/ --project=firefox'
                    }
                }
                stage('Run tests on Webkit') {
                    agent any
                    steps {
                        // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                            bat 'npx playwright test tests/ --project=webkit'
                    }
                }  
            }
        }      
    }
}