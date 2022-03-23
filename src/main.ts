import AWS, { SQS } from 'aws-sdk'

(async function main () {
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
      })
    } catch (err) {
      console.log(err)
    }
  }
})()
