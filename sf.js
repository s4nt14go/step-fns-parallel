import 'source-map-support/register';
const Promise = require('bluebird');

/* Example input data to step function
{
    "branch2": {
      "rangeToProcess": [200, 230]
    },
    "branch3": {
      "rangeToProcess": [300, 360]
    },
    "branch4": {
      "rangeToProcess": [400, 490]
    },
    "branch5": {
      "rangeToProcess": [500, 530]
    },
    "branch6": {
      "rangeToProcess": [600, 630]
    },
    "branch7": {
      "rangeToProcess": [700, 730]
    },
    "branch8": {
      "rangeToProcess": [800, 830]
    },
    "branch9": {
      "rangeToProcess": [900, 930]
    },
    "branch10": {
      "rangeToProcess": [1000, 1030]
    },
    "branch11": {
      "rangeToProcess": [1100, 1130]
    }
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
