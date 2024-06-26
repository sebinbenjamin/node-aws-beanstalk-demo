# Node.js Elastic Beanstalk Demo

This repository contains a simple Node.js application that demonstrates how to deploy to AWS Elastic Beanstalk, which in turn deploys the application on an EC2 instance.

## Table of Contents

- [Prerequisites](#prerequisites)
  - [1. AWS Account](#1-aws-account)
  - [2. AWS CLI](#2-aws-cli)
  - [3. Elastic Beanstalk CLI](#3-elastic-beanstalk-cli)
- [Setup](#setup)
- [Deployment](#deployment)
- [Application](#application)
  - [How It Works](#how-it-works)
  - [CI using GitHub Action](#ci-using-github-action)
  - [Database Setup](#database-setup)

## Prerequisites

### 1. AWS Account

You need an AWS account. Sign up at [AWS official website](https://aws.amazon.com/).

### 2. AWS CLI
1. Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html). 
1. Setup your IAM user by following the instructions [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)
2. Add necessary permissions for the IAM user. Follow the instructions [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console). The following would be some of the permissions required.

```
  arn:aws:iam::aws:policy/AdministratorAccess-AWSElasticBeanstalk
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

1. Install the EB CLI. Instructions can be found [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html). You will need to also have  Go through the troubleshooting guide on their repo if you face any errors.
2. Configure the Elastic Beanstalk CLI. Instructions can be found [here](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-configuration.html). Run the command to configure the CLI

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
   eb init --profile aws-demo-user

   Select a default region
   1) us-east-1 : US East (N. Virginia)
   2) us-west-1 : US West (N. California)
   3) us-west-2 : US West (Oregon)
   4) eu-west-1 : EU (Ireland)
   5) eu-central-1 : EU (Frankfurt)
   6) ap-south-1 : Asia Pacific (Mumbai)
   7) ap-southeast-1 : Asia Pacific (Singapore)
   8) ap-southeast-2 : Asia Pacific (Sydney)
   ```

   Follow the prompts to configure your Elastic Beanstalk application. You will need to select your AWS region and provide your access credentials.

2. Create an Elastic Beanstalk environment and deploy your application:
   ```bash
   eb create --profile your_aws_profile_name
   ```
3. Create subnets using the AWS CLI
   ```bash
   aws ec2 create-subnet --vpc-id vpc-1-demo-fs-node --cidr-block 10.0.1.0/24 --region ap-southeast-2
   aws ec2 create-subnet --vpc-id vpc-1-demo-fs-node --cidr-block 10.0.2.0/24 --region ap-southeast-2
   ```

4. Deploy the application after updating `.ebextensions/rds.config` with the subnets created.
   ```bash 
   eb deploy --profile your_profile_name
   eb status --profile your_profile_name # use to monitor the app
   eb open --profile your_profile_name # use to open the app
   eb logs --profile your_profile_name # to view the logs
   ```
5. You can set any environment variables using

```sh
    eb --profile your_profile_name setenv KEY=value
```

6. You can also setup environment variables in `.ebextensions\environment.config` like in this sample project.

## Application

This application is a simple Node.js Express server that responds with "Hello, World!" when accessed.

### How It Works

When you deploy an application using Elastic Beanstalk, AWS automatically handles the deployment details of capacity provisioning, load balancing, scaling, and monitoring. Specifically, Elastic Beanstalk uses Amazon EC2 instances to run your application. Here’s what happens behind the scenes:

1. **Environment Creation**: Elastic Beanstalk creates an environment, which includes one or more EC2 instances to host your application.
2. **Application Deployment**: The application is deployed to the EC2 instances in the environment.
3. **Load Balancing and Auto Scaling**: Elastic Beanstalk automatically sets up load balancing and auto-scaling to ensure your application can handle varying amounts of traffic. In this particular example, we are just setting up a single instance.

By using Elastic Beanstalk, you can focus on writing code and not worry about the underlying infrastructure, while still having full control over the AWS resources powering your application.

### CI using GitHub Action

You can deploy your Node.js application to AWS Elastic Beanstalk using GitHub Actions. This allows you to automate the deployment process as part of your CI/CD pipeline. The following are the steps to do the same

#### Create an IAM User for Deployment.

1. Refer to [AWS CLI](#2-aws-cli) config.
2. Attach the policies `AWSElasticBeanstalkFullAccess` and `AmazonS3FullAccess` to the IAM user.
3. Generate and save the `access key` and `secret key` for this IAM user.

#### Add GitHub Secrets

1. In your GitHub repository, go to `Settings > Secrets and variables > Actions`, make sure you add the following secrets

```
   AWS_ACCESS_KEY_ID: your_access_key_id
   AWS_SECRET_ACCESS_KEY: your_secret_access_key
   AWS_REGION: ap-southeast-2
   EB_ENVIRONMENT_NAME: ec2-node-env
   EB_APPLICATION_NAME: eb-node-ec2
```

#### Database Setup

This project also includes the setup of an RDS MySQL database instance as part of the Elastic Beanstalk environment. The database setup is automated using CloudFormation templates specified in `.ebextensions` directory.

`.ebextensions/network.config` - sets up the VPC, subnet, and security groups required for the environment.
`.ebextensions/rds.config` - sets up the RDS MySQL database instance.

**Using the Database in Your Application**

The JDBC connection string for the database will be set as an environment variable `DATABASE_URL` in your Elastic Beanstalk environment. This file is used to configure it `.ebextensions\environment.config`. You can access this environment variable in your Node.js application to connect to the database.
