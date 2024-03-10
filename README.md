# Telesoft Challenge
Solution to the Spotify Data Transformation and Analysis task
Ingests, Cleans, and organizes Spotify dataset samples for analytical purposes.
Did my best to follow best-practices, however be warned that this is my first time using Docker and AWS services.
Will try to further improve anything I missed out on before our talk on Wednesday. (Error handling mostly)

## Prerequisites
- Either Docker + Docker Compose (Recommended) **OR** Node v20.0.11 & Postgresql 16 installed
- An AWS account

## Setup instructions
 - Clone this repo `git clone
   https://github.com/translibrius/telesoft_challenge.git`
 - Import the **.env** or **docker-compose.yaml** (if using docker)
   template to the project root directory attached to submission email
   and change AWS credentials or simply use my AWS config.

Next, if using your own AWS account, set-up AWS S3 bucket
 - Set-up AWS IAM user, making sure to enable `Provide user access to
   the AWS Management Console` -> `User Type` -> Select **I want to
   create an IAM user** -> Choose a password -> Next -> Permissions ->
   Select `Attach policies directly` -> From permissions list select
   **AmazonS3FullAccess** -> Create User
   
 - Then go back to users list and select newly created user -> Security
   Credentials -> Create Access Key -> Local code -> Next > Create

Now If using docker, replace existing AWS credentials with IAM user details and S3 bucket details in `docker-compose.yaml`
If using regular Node.js replace existing AWS credentials with IAM user details and S3 bucket details in `.env`

Do any other `.env` or `.docker-compose.yaml` changes you want, take care because this can easily break the script upon a mistake! ( Check the in-line comments inside for more info ).

Next, for docker:

    bash > docker-compose up --build
    
For using Node v20.0.11 and Postgresql 16:

    bash > npm start
    
The docker version by default will also set-up pgadmin, which you can use to evaluate the database and my sql views, or otherwise connect to the db with psql Shell. Use the port you set in the configuration files **.env** or **docker-compose.yaml**

You can find the deliverable SQL Views are in `src/sql/views/`

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

### Node AWS-SDK v2 vs v3

Since I'm not that experienced with AWS and node, realised a little too late that AWS-SDK v2 will be deprecated in some time. However due to time constraints for the tasks decided to focus on other stuff rather than refractoring the sdk code.