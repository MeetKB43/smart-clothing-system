pipeline
{
    agent any
    tools {nodejs "NodeJS14"}
    environment {
        registryCredential = 'ecr:us-east-1:awscreds'
        appRegistry = "036970036011.dkr.ecr.us-east-1.amazonaws.com/scsimage"
        fractionalRegistry = "https://036970036011.dkr.ecr.us-east-1.amazonaws.com"
    }
    stages{
        stage('Build App Image for client') {
            steps {
                sh "docker-compose build"
            }
        }
        stage('Tag') {
            steps {
                sh "docker tag frontend:latest ${appRegistry}:frontend"
                sh "docker tag backend:latest ${appRegistry}:backend"
            }
        }
        stage('Upload App Image for client') {
          steps{
                script {
                    docker.withRegistry( fractionalRegistry, registryCredential ) {
                    sh "docker push ${appRegistry}:frontend"
                    sh "docker push ${appRegistry}:backend"
                    }
                }
            }

        }
    }
}





