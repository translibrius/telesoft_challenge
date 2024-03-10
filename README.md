
# Telesoft Challenge

Node.js script to download, clean up and organize Spotify datasets and SQL for data analysis

## Prerequisites

- Either Docker + Docker Compose **OR** Node v20.0.11 & Postgresql 16 installed
- An AWS account

## Setup instructions

Clone this repo `git clone https://github.com/translibrius/telesoft_challenge.git`
Import the **.env** or **docker-compose.yaml** (if using docker) template to the project root directory attached to submission email and change AWS credentials or simply use my AWS config.

Next, if using your own AWS account, set-up AWS S3 bucket,
Set-up AWS IAM user, making sure to enable `Provide user access to the AWS Management Console` -> `User Type` -> Select **I want to create an IAM user** -> Choose a password -> Next -> Permissions -> Select `Attach policies directly` -> From permissions list select **AmazonS3FullAccess** -> Create User.
Then go back to users list and select newly created user -> Security Credentials -> Create Access Key -> Local code -> Next > Create.
Now If using docker, replace existing AWS credentials with IAM user details and S3 bucket details in `docker-compose.yaml`
If using regular Node.js replace existing AWS credentials with IAM user details and S3 bucket details in `.env`

Any other `.env` or `.docker-compose.yaml` changes you want, take care because this can easily break the script upon a mistake! ( Don't recommend chaning kaggle api credentials ).

Next, for docker:

    bash > docker-compose up --build

For using Node v20.0.11 and Postgresql 16:

    bash > npm start

The docker version by default will also set-up pgadmin, which you can use to evaluate the database and my sql views, or otherwise connect to the db with psql Shell.

# Dev notes

### Acquiring relevant dataset
Decided to make use of Kaggle's [API](https://github.com/Kaggle/kaggle-api) to download the necessary datasets instead of expecting user to upload them manually. I think this is better user experience.
 *It is still possible to run by manually creating raw_data/ folder and extracting artists.csv together with tracks.csv inside*
 
### Aurora VS local Postgresql
Decided to go with local Postgresql because of the potential fee's of running AWS Aurora while developing this project, as it is excluded from the AWS free-tier services.
>**Load data from S3 into locally hosted PostgreSQL. Bonus if you load the data into AWS Aurora instead.**

### S3 download vs Local files
The script processes and transforms the dataset, uploads it to S3, then I'm left with a decision to either download the dataset that I just uploaded in order to load it into local Postgresql or simply use the processed data that still exists in local files.
Considering efficiency, I decided to simply load the local files instead, which saves time and API requests of S3. In my opinion I already demonstrate my ability to use the AWS-SDK by uploading to the bucket therefore I don't see a good reason to download the files again. 
> **Load data from S3 into locally hosted PostgreSQL. Bonus if you load the data into AWS Aurora instead.**