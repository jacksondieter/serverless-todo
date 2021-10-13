import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStorage logic

export class AttachmentUtils {
    constructor(
        private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly bucket = process.env.ATTACHMENT_S3_BUCKET,
        private readonly expires = Number(process.env.SIGNED_URL_EXPIRATION)) {
    }

    getGetUrl( key: string ): string {    
        return `https://${this.bucket}.s3.amazonaws.com/${key}`
    }
    
    getPutSignedUrl( key: string ): string {  
    return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucket,
        Key:key,
        Expires: this.expires,
    });
  }
}

  