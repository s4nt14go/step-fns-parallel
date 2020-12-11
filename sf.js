import 'source-map-support/register';
const Promise = require('bluebird');

/* Example input data to step function
{
    "branch2": {
      "rangeToProcess": [200, 215]
    },
    "branch3": {
      "rangeToProcess": [300, 325]
    }
}*/

export const branch1 = async (event, context) => {
  console.log('event', event);
  return await message({time: 6, msg: 'From branch1'});
};

export const branch2 = async (event, context) => await worker(event, context);
export const branch3 = async (event, context) => await worker(event, context);

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
  // const [branch1, branch2, branch3] = event;
  return event;
};

const message = ({ time, ...rest }) => new Promise((resolve, _reject) =>
  setTimeout(() => {
    resolve(`${rest.msg} using ${time}s delay`);
  }, time * 1000)
);
