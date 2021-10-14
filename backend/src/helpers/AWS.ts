import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

export const XAWS = AWSXRay.captureAWS(AWS)

