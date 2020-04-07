export function errorHandler(err, req, res, next) {
   console.error(err);
   res.status(err.responseCode ? err.responseCode : 500).send({
      status: false,
      message: err.message,
   });
}