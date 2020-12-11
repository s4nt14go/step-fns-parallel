import 'source-map-support/register';
const Promise = require('bluebird');

/* Input data to step function
{
    "branch2": {
      "rangeToProcess": [0, 30]
    },
    "branch3": {
      "rangeToProcess": [31, 60]
    },
    "branch4": {
      "rangeToProcess": [61, 90]
    },
    "branch5": {
      "rangeToProcess": [91, 120]
    },
    "branch6": {
      "rangeToProcess": [121, 150]
    },
    "branch7": {
      "rangeToProcess": [151, 180]
    },
    "branch8": {
      "rangeToProcess": [181, 210]
    },
    "branch9": {
      "rangeToProcess": [211, 240]
    },
    "branch10": {
      "rangeToProcess": [241, 270]
    },
    "branch11": {
      "rangeToProcess": [271, 300]
    }
}
{
    "branch2": [0, 30],
    "branch3": [31, 60],
  	"branch4": [61, 90],
    "branch5": [91, 120],
    "branch6": [121, 150],
    "branch7": [151, 180],
    "branch8": [181, 210],
    "branch9": [241, 270],
    "branch10": [271, 300],
    "branch11": [301, 330],
}*/

export const branch1 = async (event, context) => {
  console.log('event', event);
  return await message({time: 6, msg: 'From branch1'});
};

export const branch2 = async (event, context) => await worker(event, context);
export const branch3 = async (event, context) => await worker(event, context);
export const branch4 = async (event, context) => await worker(event, context);
export const branch5 = async (event, context) => await worker(event, context);
export const branch6 = async (event, context) => await worker(event, context);
export const branch7 = async (event, context) => await worker(event, context);
export const branch8 = async (event, context) => await worker(event, context);
export const branch9 = async (event, context) => await worker(event, context);
export const branch10 = async (event, context) => await worker(event, context);
export const branch11 = async (event, context) => await worker(event, context);

const worker = async (event, context) => {
  console.log('event', event);
  const { AWS_LAMBDA_FUNCTION_NAME } = process.env;
  const handlerName = AWS_LAMBDA_FUNCTION_NAME.split('-').slice(-1);  // AWS_LAMBDA_FUNCTION_NAME is step-fns-parallel-dev-branchX

  const { rangeToProcess } = event[handlerName];

  // const endId = 30;
  const endId = rangeToProcess[1];
  const marginTime = 10000;
  const taskTakes = 1000;
  // let nextId = event.nextId || 0;
  let nextId = event.nextId || rangeToProcess[0];

  let remainingTime;
  try {
    do {
      await Promise.delay(taskTakes);
      console.log(`Item ${nextId} processed`);
      nextId++;
      remainingTime = context.getRemainingTimeInMillis();
      console.log(`RemainingTimeInMillis ${remainingTime}`);
      if (!(remainingTime > marginTime)) console.log(`Stop processing as there is no time left`);
    } while (nextId < endId + 1 &&
    remainingTime > marginTime);

    let ret;
    if (nextId <= endId) {
      ret = {
        done: false,
        nextId
      };
      ret = {
        done: false,
        nextId,
        [handlerName]: {
          rangeToProcess,
        }
      };
    } else {
      ret = {
        done: true
      };
    }
    console.log('return', ret);
    return ret;
  } catch (err) {
    throw err;
  }
};

export const afterBranches = async (event, context) => {
  console.log("event", event);
  // const [branch1, branch2] = event;
  return event;
};

const message = ({ time, ...rest }) => new Promise((resolve, _reject) =>
  setTimeout(() => {
    resolve(`${rest.msg} using ${time}s delay`);
  }, time * 1000)
);
