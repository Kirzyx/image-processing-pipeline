# Create Buckets
resource "aws_s3_bucket" "raw_images" {
    bucket = "raw_images"

    

    tags = {
        Name = "raw images"
        Environment = "Dev"
    }

}

resource "aws_s3_bucket" "processed_images" {
    bucket = "processed_images"

    tags = {
        Name = "processed_images"
        Environment = "Dev"
    }

}

# Enable Versioning on our buckets
resource "aws_s3_bucket_versioning" "raw_images_versioning" {
    bucket = aws_s3_bucket.raw_images.id
    versioning_configuration {
      status = "Enabled"
    }
}


resource "aws_s3_bucket_versioning" "processed_images_versioning" {
    bucket = aws_s3_bucket.processed_images.id
    versioning_configuration {
      status = "Enabled"
    }
}


# Deleting old images
resource "aws_s3_bucket_lifecycle_configuration" "delete_raw_images" {
    bucket = aws_s3_bucket.raw_images.id

    rule {
        id = "Delete old objects"
        status = "Enabled"

        filter {
            prefix = ""
        }

        expiration {
            days = 1
        }

    }
}


resource "aws_s3_bucket_lifecycle_configuration" "delete_raw_images_versioned" {
    bucket = aws_s3_bucket.raw_images.id

    rule {
        id = "Delete old objects"
        status = "Enabled"

        filter {
            prefix = ""
        }

        noncurrent_version_expiration {
            noncurrent_days = 1
        }

    }
}

resource "aws_s3_bucket_lifecycle_configuration" "delete_processed_images" {
    bucket = aws_s3_bucket.processed_images.id

    rule {
        id = "Delete old objects"
        status = "Enabled"

        filter {
            prefix = ""
        }

        expiration {
            days = 1
        }

    }
}


resource "aws_s3_bucket_lifecycle_configuration" "delete_processed_images_versioned" {
    bucket = aws_s3_bucket.processed_images.id

    rule {
        id = "Delete old objects"
        status = "Enabled"

        filter {
            prefix = ""
        }

        noncurrent_version_expiration {
            noncurrent_days = 1
        }

    }
}

resource "aws_iam_role" "Image_S3_Role" {
    name = "Image_S3_Role"
    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Sid = ""
                Principal = {
                    Service = "lambda.amazonaws.com"
                }  
            },
        ]
    })
}

resource "aws_iam_policy" "S3_Permissions" {
    name = "S3_Permissions"
    path = "/"
    description = "Read and write permissions"

    policy = jsonencode({
        Statement = [
            {
                Action = [
                    "s3:GetObject",
                    "s3:PutObject"
                ]
                Effect = "Allow"
                Resource = [
                    "${aws_s3_bucket.raw_images.arn}/*",
                    "${aws_s3_bucket.processed_images.arn}/*"
                ]
            },
        ]
    })
}

resource "aws_iam_policy_attachment" "S3-attach" {
    name = "S3-Read-Write"
    roles = [aws_iam_role.Image_S3_Role.name]
    policy_arn = aws_iam_policy.S3_Permissions.arn
}

resource "aws_lambda_function" "placeholder_lambda" {
    function_name = "lambda_placeholder"
    role = aws_iam_role.Image_S3_Role.arn

    runtime = "python3.9"
    filename = "LambdaFunction.zip"
    handler = "lambda_function.lambda_handler"
}

resource "aws_lambda_permission" "allow_bucket" {
    statement_id = "AllowExecution"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.placeholder_lambda.arn
    principal = "s3.amazonaws.com"
    source_arn = aws_s3_bucket.raw_images.arn
}

# Notification to trigger lambda function when object is uploaded to S3 bucket
resource "aws_s3_bucket_notification" "raw_image_upload" {
    bucket = aws_s3_bucket.raw_images.id
    
    lambda_function {
        lambda_function_arn = aws_lambda_function.placeholder_lambda.arn
        events = ["s3:ObjectCreated:*"]
    }

    depends_on = [aws_lambda_permission.allow_bucket]
}