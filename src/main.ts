import AWS, { SQS } from 'aws-sdk'
import initMB from 'messagebird'
import { config } from 'dotenv'
import util from 'util'

(async function main () {
  config()
  while (true) {
    try {
      const queueUrl = 'here you place the url of queue in AWS SQS'

      const sqs = new AWS.SQS({ region: 'place your aws region here' })

      const params: SQS.Types.ReceiveMessageRequest = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10
      }

      const result = await sqs.receiveMessage(params).promise()
      result?.Messages?.map(async message => {
        console.log(message.Body)
        await sqs.deleteMessage({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle
        }).promise()
      })

      const messageBird = initMB(process.env.MESSAGE_BIRD_API_KEY_TEST)

      const send = util.promisify(messageBird.messages.create)

      const smsParams = {
        originator: 'TestMessage',
        recipients: [
          process.env.SMS_PHONE_RECIPIENTS
        ],
        body: 'This is a test message - Have Faith'
      }

      const smsResult = await send(smsParams)

      console.log(smsResult)
    } catch (err) {
      console.log(err)
    }
  }
})()
