
# Telesoft Challenge

Node.js script to download, clean up and organize Spotify datasets and SQL for data analysis.

# Setup instructions

Todo

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