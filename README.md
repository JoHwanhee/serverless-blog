# Serverless Blog with TDD

Develop a cost-effective, serverless blog using AWS Lambda. This project is built following Test-Driven Development (TDD) principles.

## Architecture Overview
- AWS Lambda + EJS + Node.js + MongoDB (Atlas 500MB free)

### AWS Lambda
A compute service by AWS that triggers code in response to certain events, forming the foundation of our serverless infrastructure.

### EJS
Embedded JavaScript - a templating engine to embed dynamic content into HTML on the server side.

### Node.js
An asynchronous, event-driven JavaScript runtime, enabling scalable server-side applications.

### MongoDB Atlas
A cloud-hosted MongoDB service. With a free tier of up to 500MB, it`s ideal for starting projects.

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

## Custom Domain Configuration
1. Navigate to the API Gateway service in the AWS Management Console.
1. From the left sidebar, choose `Custom domain names`.
1. Click the `Create` button and input your desired domain name.
1. Confirm by clicking `Create domain name`.
1. Access your newly-created domain name, and under the `Configure API mappings` section, click `Add new mapping`.
1. Choose your API and stage, set the Base Path as `/`, and click `Save`.
