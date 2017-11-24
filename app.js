/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [START app]
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Buffer = require('safe-buffer').Buffer;
const process = require('process'); // Required for mocking environment variables

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/gcloud-node/#/docs/google-cloud/latest/guides/authentication
// These environment variables are set automatically on Google App Engine
const PubSub = require('@google-cloud/pubsub');

// Instantiate a pubsub client
const pubsub = PubSub();

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// List of all messages received by this instance

// The following environment variables are set by app.yaml when running on GAE,
// but will need to be manually set when running locally.


// [START index]
app.get('/', (req, res) => {
  // References an existing subscription, e.g. "my-subscription"
  const subscription = pubsub.subscription(subscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
	console.log(`\tAttributes: ${message.ack()}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    //message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
});

// [END push]

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]

module.exports = app;
