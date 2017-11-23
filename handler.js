'use strict';
const aws = require('aws-sdk');  
const async = require('async');


// trigger from new object in s3
module.exports.handleS3Event = (event, context, callback) => {
  
  // The is a sample event object
  // { Records: 
  //   [ { eventVersion: '2.0',
  //   eventSource: 'aws:s3',
  //   awsRegion: 'us-west-1',
  //   eventTime: '2017-11-22T21:16:45.082Z',
  //   eventName: 'ObjectCreated:Put',
  //   userIdentity: [Object],
  //   requestParameters: [Object],
  //   responseElements: [Object],
  //   s3: [Object] } ] }

  handleS3Messages(event.Records, callback);
};

function handleS3Messages(records, callback) {  
  console.log("handleS3Messages ");//, records);
  if (records && records.length > 0){
    var functions = [];
    records.forEach(function(record) {
      functions.push(function(callback){
        publishSNSMessage(record, callback);
      });
    });
    console.log("total functions ", functions.length);
    async.parallel(functions, function(err, data) {
      if (err) {
          console.error(err, err.stack);
          callback(err);
      } else {
        console.log("publish success ");//, data);
        callback(null, data);              
      }
    });
  }
}

function publishSNSMessage(record, callback) {  
  aws.config.region = 'us-west-1';
  var sns = new aws.SNS();
  console.log("publishSNSMessage record ");//, record);
  sns.publish({
    Message: JSON.stringify(record),
    TopicArn: process.env.TOPIC1_ARN,
    }, function(err, data) {
      if (err) {
        console.error(err, err.stack);
        callback(err);
      } else {
          //console.log(data);
          callback(null, data);
      } 
    });
}

// trigger when a new message is received
module.exports.handleTopic = (event, context, callback) => {
  handleSNSMessages(event.Records, callback);
};

function handleSNSMessages(records, callback){
  console.log("handleSNSMessages ");//, records);
  if (records && records.length > 0){
    var functions = [];
    records.forEach(function(record) {
      functions.push(function(callback){
        handleSNSMessage(record, callback);
      });
    });
    console.log("total functions ", functions.length);
    async.parallel(functions, function(err, data) {
      if (err) {
          console.error(err, err.stack);
          callback(err);
      } else {
        console.log("publish success ");//, data);
        callback(null, data);              
      }
    });
  }
}

function handleSNSMessage(record, callback){

  // Sample SNS Record
  // { EventSource: 'aws:sns',
  // EventVersion: '1.0',
  // EventSubscriptionArn: 'arn:aws:sns:us-west-1:893389647207:topic1-dev:30413cb8-74af-425c-9939-2ce539c49887',
  // Sns: 
  // { Type: 'Notification',
  // MessageId: '630e6a71-e371-589e-8fe6-38e1693b1de4',
  // TopicArn: 'arn:aws:sns:us-west-1:893389647207:topic1-dev',
  // Subject: null,
  // Message: '{"eventVersion":"2.0","eventSource":"aws:s3","awsRegion":"us-west-1","eventTime":"2017-11-23T08:34:17.273Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"A2364ISILLL5EQ"},"requestParameters":{"sourceIPAddress":"69.181.230.182"},"responseElements":{"x-amz-request-id":"99B8A5B1A91DC747","x-amz-id-2":"BQE4baMPONvZOguHug5AnaDiWsMN2wkuGjK7Fh4FNZf29Pe/BGA7lw2TYCFENPLrM0a/AvqPtKI="},"s3":{"s3SchemaVersion":"1.0","configurationId":"a7bb2268-ef6e-47b5-8b4d-a4d65a2fba03","bucket":{"name":"dev-plum-test-bucket1","ownerIdentity":{"principalId":"A2364ISILLL5EQ"},"arn":"arn:aws:s3:::dev-plum-test-bucket1"},"object":{"key":"contact-fields__1_.png","size":735,"eTag":"4faa2e42127accafb75fdee9658883c8","sequencer":"005A16880932FE82C4"}}}',
  // Timestamp: '2017-11-23T08:34:18.178Z',
  // SignatureVersion: '1',
  // Signature: 'ZbJyrqOd+RM3U6DBY+jv4+K9w78oCazowNpAfGlbqV/sfAVdiq42rp2oatnqI1oNzDLfkURV2knIP5Nny6IQbt9P+qyXrZwaiveLP9YXWI2W+qBWUN1Mo8Yy33zqJiMrwlRkEnn3+CY5IJSDeAxlTychsvWFrYwxozlYgKsdVz6eoElTzoN8ZZ7CfcNNDNRIEO3/bpL0Lk77E8PREyZ5NhhkZOIJFPm6LoZ/lPukNR9EsBVCc6CkGPkz3kk5vEuPJKP+Fxrg6sVpd+MUXUTBhboqWOaapJKrSu+czfQQNNLGMx/sjqUy2ao4ZqrwXIEjgg1fiiSlbEY8pTyQYtyqzg==',
  // SigningCertUrl: 'https://sns.us-west-1.amazonaws.com/SimpleNotificationService-433026a4050d206028891664da859041.pem',
  // UnsubscribeUrl: 'https://sns.us-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-1:893389647207:topic1-dev:30413cb8-74af-425c-9939-2ce539c49887',
  // MessageAttributes: {} } }

  console.log(record);
}

