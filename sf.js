import 'source-map-support/register';

export const branch1 = async (event, context) => {
  return await message({time: 6, msg: 'from branch1'});
};
export const branch2 = async (event, context) => {
  return await message({time: 3, msg: 'from branch2'});
};

export const afterBranches = async (event, context) => {
  console.log("afterBranches", event);
  // const [branch1, branch2] = event;
  return event;
};

const message = ({ time, ...rest }) => new Promise((resolve, reject) =>
  setTimeout(() => {
    resolve(`${rest.msg} with a delay ${time}s`);
  }, time * 1000)
);
