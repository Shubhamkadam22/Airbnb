module.exports = (fn) => {    
  if (typeof fn !== 'function') {
    console.error("❌ CRITICAL ERROR: wrapAsync received a non-function!", fn);
  
  }
  
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};