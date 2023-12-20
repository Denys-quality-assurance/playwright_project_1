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
                        stage('Checkout') {
                            steps {
                                git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                                    branch: 'main'
                            }
                        }
                        stage('Install dependencies') {
                            steps {
                                bat 'npm ci'
                            }
                        }
                        stage('Install browsers') {
                            steps {
                                bat 'npx playwright install chromium'
                            }
                        }
                        stage('Run tests') {
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
                        stage('Run tests on Firefox') {
                            agent any
                            stages {
                                stage('Checkout') {
                                    steps {
                                        git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                                            branch: 'main'
                                    }
                                }
                                stage('Install dependencies') {
                                    steps {
                                        bat 'npm ci'
                                    }
                                }
                                stage('Install browsers') {
                                    steps {
                                        bat 'npx playwright install firefox'
                                    }
                                }
                                stage('Run tests') {
                                    steps {
                                        // withCredentials([usernamePassword(credentialsId: 'credentials', passwordVariable: 'PASSWORD', usernameVariable: 'EMAIL')]) 
                                        bat 'npx playwright test tests/ --project=firefox'
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Webkit') {
                    agent any
                    stages {
                        stage('Run tests on Webkit') {
                            agent any
                            stages {
                                stage('Checkout') {
                                    steps {
                                        git url: 'https://github.com/DenysMatolikov/playwright_project_1',
                                            branch: 'main'
                                    }
                                }
                                stage('Install dependencies') {
                                    steps {
                                        bat 'npm ci'
                                    }
                                }
                                stage('Install browsers') {
                                    steps {
                                        bat 'npx playwright install webkit'
                                    }
                                }
                                stage('Run tests') {
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
    }
}