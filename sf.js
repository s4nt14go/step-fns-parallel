import 'source-map-support/register';

export const branch1 = async (event, context) => {
  return await message({time: 6, msg: 'From branch1'});
};
export const branch2 = async (event, context) => {
  return await message({time: 3, msg: 'From branch2'});
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
