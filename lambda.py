import json
import boto3

def lambda_handler(event, context):
    # image of the event from S3
    image_key = event['Records'][0]['s3']['object']['key']
    
    # bucket of the image
    bucket = event['Records'][0]['s3']['bucket']['name']

    # boto3
    client = boto3.client('s3')

    # get the raw image from the S3 bucket that we got from the event
    raw_image = client.get_object(Bucket = bucket, Key = image_key)

    # process the image
    processed_image = 0


    return processed_image