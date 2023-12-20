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
                    stages {
                        stage('Checkout for Chromium') {
                            steps {
                                git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                                    branch: 'main'
                            }
                        }
                        stage('Install dependencies for Chromium') {
                            steps {
                                bat 'npm ci'
                            }
                        }
                        stage('Install browser for Chromium') {
                            steps {
                                bat 'npx playwright install chromium'
                            }
                        }
                        stage('Run tests for Chromium') {
                            steps {
                                // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                                bat 'npx playwright test tests/ --project=chromium'
                            }
                        }
                    }
                }
                stage('Firefox') {
                    agent any
                    stages {
                        stage('Checkout for Firefox') {
                            steps {
                                git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                                    branch: 'main'
                            }
                        }
                        stage('Install dependencies for Firefox') {
                            steps {
                                bat 'npm ci'
                            }
                        }
                        stage('Install browser for Firefox') {
                            steps {
                                bat 'npx playwright install firefox'
                            }
                        }
                        stage('Run tests for Firefox') {
                            steps {
                                // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                                bat 'npx playwright test tests/ --project=firefox'
                            }
                        }
                    }
                }
                stage('Webkit') {
                    agent any
                    stages {
                        stage('Checkout for Webkit') {
                            steps {
                                git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                                    branch: 'main'
                            }
                        }
                        stage('Install dependencies for Webkit') {
                            steps {
                                bat 'npm ci'
                            }
                        }
                        stage('Install browser for Webkit') {
                            steps {
                                bat 'npx playwright install webkit'
                            }
                        }
                        stage('Run tests for Webkit') {
                            steps {
                                // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                                bat 'npx playwright test tests/ --project=webkit'

                            }
                        }
                    }
                }
            }
        }
    }
}