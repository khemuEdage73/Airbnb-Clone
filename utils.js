function asyncWrapper(fn) {
  let wrapper_func = (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
  return wrapper_func;
}


module.exports = asyncWrapper;