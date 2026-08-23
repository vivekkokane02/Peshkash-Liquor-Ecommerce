// Wraps an async Express handler so rejected promises reach the error middleware
// instead of crashing the process or requiring try/catch in every controller.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
