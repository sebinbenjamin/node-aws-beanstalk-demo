# Node.js Elastic Beanstalk Demo

This repository contains a simple Node.js application that demonstrates how to deploy to AWS Elastic Beanstalk, which in turn deploys the application on an EC2 instance.

## Prerequisites
### 1. AWS Account
You need an AWS account. Sign up at [AWS official website](https://aws.amazon.com/).

### 2. AWS CLI

1. Setup your IAM user by following the instructions [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
2. Add necessary permissions for the IAM user. Follow the instructions [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console). The following would be some of the permissions required.
  ```
    arn:aws:iam::aws:policy/AWSElasticBeanstalkFullAccess
    arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService
  ```
3. Install and configure the AWS CLI. Instructions can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html). Run the command to configure the CLI 
```sh
  $ aws configure --profile your_profile_name
    AWS Access Key ID [None]: your_access_key_id
    AWS Secret Access Key [None]: your_secret_access_key
    Default region name [None]: ap-southeast-2
    Default output format [None]: json
```
  - To use the named profile with the AWS CLI, specify the profile using the `--profile` option in your commands

### 3. Elastic Beanstalk CLI
1. Install the EB CLI. Instructions can be found [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). Go through the troubleshooting guide on their repo if you face any errors.
2. Configure the Elastic Beanstalk  CLI. Instructions can be found [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html).  Run the command to configure the CLI 
```sh
 $ eb init --profile your_profile_name
    Select a default region
    1) us-east-1 : US East (N. Virginia)
    2) us-west-1 : US West (N. California)
    3) us-west-2 : US West (Oregon)
    4) eu-west-1 : Europe (Ireland)
    5) eu-central-1 : Europe (Frankfurt)
    6) ap-south-1 : Asia Pacific (Mumbai)
    7) ap-southeast-1 : Asia Pacific (Singapore)
    8) ... 
    (default is 3): x

    You have not yet set up your credentials or your credentials are incorrect.
    You must provide your credentials.
    (aws-access-id): your_access_key_id
    (aws-secret-key): your_secret_access_key

    Select an application to use
    1) [ Create new Application ]
    (default is 1): 1

    Enter Application Name
    (default is "eb"): eb-node-ec2
    Application eb has been created.

    Select a platform.
    1) Node.js
    (default is 1): 1

    Do you want to set up SSH for your instances?
    (y/n): y

    Select a keypair.
    1) [ Create new KeyPair ]
    (default is 1): 1
```

## Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/sebinbenjamin/node-aws-beanstalk-demo.git
    cd node-beanstalk-demo
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Deployment

1. Initialize Elastic Beanstalk in your project directory:
    ```bash
    eb init --profile your_profile_name
    ```
    Follow the prompts to configure your Elastic Beanstalk application. You will need to select your AWS region and provide your access credentials.

2. Create an Elastic Beanstalk environment and deploy your application:
    ```bash
    eb create ec2-node-env --single --profile your_profile_name
    eb deploy --profile your_profile_name
    eb status --profile your_profile_name # use to monitor the app
    eb open --profile your_profile_name # use to open the app
    eb logs --profile your_profile_name # to view the logs
    ```
3. You can set any environment variables using 
```sh
    eb --profile your_profile_name setenv KEY=value
```
4. You can also setup environment variables in `.ebextensions\environment.config`.

## Application

This application is a simple Node.js Express server that responds with "Hello, World!" when accessed.

### How It Works

When you deploy an application using Elastic Beanstalk, AWS automatically handles the deployment details of capacity provisioning, load balancing, scaling, and monitoring. Specifically, Elastic Beanstalk uses Amazon EC2 instances to run your application. Here’s what happens behind the scenes:

1. **Environment Creation**: Elastic Beanstalk creates an environment, which includes one or more EC2 instances to host your application.
2. **Application Deployment**: The application is deployed to the EC2 instances in the environment.
3. **Load Balancing and Auto Scaling**: Elastic Beanstalk automatically sets up load balancing and auto-scaling to ensure your application can handle varying amounts of traffic.

By using Elastic Beanstalk, you can focus on writing code and not worry about the underlying infrastructure, while still having full control over the AWS resources powering your application.

## License

This project is licensed under the MIT License.
