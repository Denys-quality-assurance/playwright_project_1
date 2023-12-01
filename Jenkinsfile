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
                bat 'npm ci'
            }
        }
        stage('Run tests') {
            steps {
                bat 'tests/login-test.js'
            }
        }
    }
}