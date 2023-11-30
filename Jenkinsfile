pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/DenysMatolikov/playwright_project_1', branch: 'main'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Run tests') {
            steps {
                sh 'node login-test.js'
            }
        }
    }
}