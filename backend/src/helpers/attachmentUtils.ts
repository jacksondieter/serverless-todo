// import * as AWS from 'aws-sdk'
import {XAWS as AWS}from './AWS'
import { createLogger } from '../utils/logger'

const logger = createLogger('TodosImageAttachment')
export class AttachmentUtils {
    constructor(
        private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly bucket = process.env.ATTACHMENT_S3_BUCKET,
        private readonly expires = Number(process.env.SIGNED_URL_EXPIRATION)) {
    }

    getGetUrl( key: string ): string {  
        logger.info(`Get url`)  
        return `https://${this.bucket}.s3.amazonaws.com/${key}`
    }

    deleteImg( key: string ) {
        logger.info(`Delete image`)
        const params = {  Bucket: this.bucket, Key: key }
        return this.s3.deleteObject(params,(err,data) => {
            if(err){
                logger.info(err)
            } else {
                logger.info(data)
            }
        })
    }
    
    getPutSignedUrl( key: string ): string {  
        logger.info(`Get signed url`)
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucket,
            Key:key,
            Expires: this.expires,
        });
  }
}

  