import 'source-map-support/register';
const Promise = require('bluebird');

export const branch1 = async (event, context) => {
  console.log('event', event);
  return await message({time: 6, msg: 'From branch1'});
};

export const branch2 = async (event, context) => {
  console.log('event', event);
  const endId = 30;
  const marginTime = 10000;
  const taskTakes = 1000;
  let nextId = event.nextId || 0;

  let remainingTime;
  try {
    do {
      await Promise.delay(taskTakes);
      console.log(`Item ${nextId} processed`);
      nextId++;
      remainingTime = context.getRemainingTimeInMillis();
      console.log(`RemainingTimeInMillis ${remainingTime}`);
      if (!(remainingTime > marginTime)) console.log(`Stop processing as there is no time left`);
    } while (nextId <= endId &&
    remainingTime > marginTime);

    let ret;
    if (nextId <= endId) {
      ret = {
        done: false,
        nextId
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
  console.log("afterBranches", event);
  // const [branch1, branch2] = event;
  return event;
};

const message = ({ time, ...rest }) => new Promise((resolve, reject) =>
  setTimeout(() => {
    resolve(`${rest.msg} using ${time}s delay`);
  }, time * 1000)
);
