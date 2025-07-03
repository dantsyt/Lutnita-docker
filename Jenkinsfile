pipeline {
    agent any

    stages {
        stage('Infisical Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'infisical-credentials',
                    passwordVariable: 'CLIENT_SECRET',
                    usernameVariable: 'CLIENT_ID'
                )]) {
                    script {
                        def token = sh(script: '''curl -s -X POST "https://eu.infisical.com/api/v1/auth/universal-auth/login" -H 'Content-Type: application/json' --data '{"clientId": "'${CLIENT_ID}'", "clientSecret": "'${CLIENT_SECRET}'"}' | jq -r '.accessToken' ''',
                            returnStdout: true
                        ).trim()
                        echo "Access token obtained"
                        env.ACCESS_TOKEN = token
                    }
                }
            }
        }

        stage('Use Access Token') {
            steps {
                sh '''
                    echo "Using Access Token: $ACCESS_TOKEN"
                    # You can now use $ACCESS_TOKEN here
                '''
            }
        }
    }
}
