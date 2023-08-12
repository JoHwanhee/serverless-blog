# Serverless Blog with TDD

Develop a cost-effective, serverless blog using AWS Lambda. This project is built following Test-Driven Development (TDD) principles.

## Architecture Overview
- AWS Lambda + EJS + Node.js + MongoDB (Atlas 500MB free)


## Setting up local

install and start docker

```bash
npm run install
```

```bash
npm run test
```

```bash
npm run dev
```

## Dependencies

### Main Dependencies:
- **ejs (^3.1.9)**: Our chosen templating engine.
- **express (^4.18.2)**: Web framework to structure our application.
- **mongoose (^7.4.2)**: ORM to connect and interact with MongoDB.
- **reflect-metadata (^0.1.13)**: Enables decorator metadata reflection capabilities.
- **serverless-http (^3.2.0)**: Allows for express apps to be compatible with AWS Lambda.

### Development Dependencies:
The project also integrates various development tools to make the development smoother and uphold the TDD principles:

- **jest (^29.6.2)** & **ts-jest (^29.1.1)**: Our main testing framework and its TypeScript support respectively.
- **supertest (^6.3.3)**: Provides a high-level abstraction for testing HTTP assertions.
- **testcontainers (^10.1.0)**: Offers a Node.js API for creating, managing, and disposing of containers during testing.
- **serverless-offline (^12.0.4)**: Simulates AWS Lambda and API Gateway for local development.
- **serverless-domain-manager (^7.1.1)**: Helpful for managing custom domains with the Serverless Framework.

## Setting Up & Development

1. **Set Up AWS**: Configure the AWS CLI and the Serverless Framework. Make sure to create an IAM user with the necessary permissions.
2. **Initialize Serverless Project**: Run `serverless create --template aws-nodejs` to start a new project.
3. **Set Up Express & EJS**: Install the required packages with `npm install express ejs`.
4. **Connect MongoDB Atlas**: Utilize the Mongoose library to establish a connection with MongoDB Atlas.
5. **Install Serverless Plugins**: Enhance your development and deployment experience by installing `serverless-express` and `serverless-offline` plugins.
6. **Write Lambda Functions**: Draft functions that allow hosting your Express app on AWS Lambda.
7. **Deploy**: Push your project to AWS Lambda using the `serverless deploy` command.
8. **Test**: Post-deployment, access the provided URL to ensure your blog functions as expected.

During development, ensure that you write tests first, adhering to the TDD approach. The project uses Jest as its primary testing framework. You can run your tests using:

## CI/CD with GitHub Actions

To automate the build, test, and deployment process of our serverless blog, we're utilizing GitHub Actions. This CI/CD pipeline is triggered on every push to the `main` branch. Here's a brief overview of the pipeline:

1. **Checkout Code**: Fetches the latest changes of your code.
2. **Setup Node.js**: Configures the desired Node.js version.
3. **Install Dependencies**: Installs all necessary npm packages.
4. **Build**: Compiles the code if necessary.
5. **Test**: Runs unit tests to ensure code quality.
6. **Deploy**: Utilizes the Serverless framework to deploy the application to AWS Lambda.

Here's the actual configuration for the GitHub Actions:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Deploy
        run: npx serverless deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          MONGO_URI: ${{ secrets.MONGO_URI }}
```

Ensure you have the necessary secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and MONGO_URI) set up in your GitHub repository's secrets section to ensure the workflow runs without issues.



## Custom Domain Configuration
1. Navigate to the API Gateway service in the AWS Management Console.
1. From the left sidebar, choose `Custom domain names`.
1. Click the `Create` button and input your desired domain name.
1. Confirm by clicking `Create domain name`.
1. Access your newly-created domain name, and under the `Configure API mappings` section, click `Add new mapping`.
1. Choose your API and stage, set the Base Path as `/`, and click `Save`.
