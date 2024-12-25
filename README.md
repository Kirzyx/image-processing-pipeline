# Serverless Image Processing Pipeline
### Overview
This project sets up an image processing pipeline using AWS services: S3, Lambda, IAM, and Terraform. It allows for the upload of raw images to a S3 bucket to be processed by a Lambda function. And the processed images are then stored in another S3 bucket.

#### Project Architecture
- **S3 Buckets**
	- **raw-images-bucket**: Used to store raw images
	- **processed-images-bucket**: Used to store processed images
- **IAM Role**: An AM role is created to grant Lambda permissions to access the S3 buckets to process images


### Setup
**1.** **Prerequisites**
- Terraform
- AWS CLI configured with your credentials
**2.** **Clone Repository**
```
placeholder
```
**3.** **Initialize Terraform**
```
terraform init
```
**4.** **Apply Terraform Configuration**
```
terraform apply
```

