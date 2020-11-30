# Run parallel tasks longer than Lambda time limited life using Step Functions
<br />
<p align="center">
  <img src="doc/graph.png" />
</p><br />

The state machine process 30 items, every item takes 1s to complete, but the lambda timeout is set to 20s (purposely so this PoC doesn't take so much time).<br /><br />
After each item is processed, lambda asks how much time is left from the 20s, if it's left less than 10s it will stop processing and return ` { done: false, nextId: <number> } ` so the following Choice state restarts the lambda from `nextId`.<br /><br />
Once all the 30 items were processed, lambda returns `{ done: true }` so Choice directs to end the state machine.  

#### Requirements
* AWS CLI
* AWS account
* Serverless Framework

#### Instructions
* Clone the repo and install the dependencies with `npm i`
* Configure your aws profile with the aws account credentials you want to use for the deployment
```bash
export AWS_DEFAULT_PROFILE=<your aws profile>
export AWS_PROFILE=$AWS_DEFAULT_PROFILE
export AWS_REGION=<aws region put on serverless.yml>
```
`TIP` You can check your current credentials with `aws configure list` 
* Deploy with
```bash
sls deploy
```
* Execute state machine. `data` parameter is optional, if it's not sent it will process from item 0 or specify `nextId` choosing between 1 and 30.
```bash
sls invoke stepf --name test --data '{"nextId": <number>}'
```
---
Starting repo: [Serverless Node.js Starter](https://github.com/AnomalyInnovations/serverless-nodejs-starter)
