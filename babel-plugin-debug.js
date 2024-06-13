// babel-plugin-debug.js
module.exports = function debugPlugin({ types: t }) {
    return {
      visitor: {
        Program(path, state) {
          console.log(`### ******** ### Babel config used: ${state.opts.message}`);
        },
      },
    };
  };
  