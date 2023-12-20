pipeline {
    agent any
    environment {
        PLAYWRIGHT_BROWSERS_PATH = '0' //to download browsers into the project's local node_modules folder - a directory Jenkins can read
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/DenysMatolikov/playwright_project_1'
            }
        }
        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Install browsers') {
            steps {
                bat 'npx playwright install'
            }
        }
        stage('Run tests on Chromium') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'linkedin_credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                {
                    bat 'npx playwright test tests/ --project=chromium'
                }
            }
        }
        stage('Run tests on Firefox') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'linkedin_credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                {
                    bat 'npx playwright test tests/ --project=firefox'
                }
            }
        }
        stage('Run tests on Webkit') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'linkedin_credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                {
                    bat 'npx playwright test tests/ --project=webkit'
                }
            }
        }        
    }
}