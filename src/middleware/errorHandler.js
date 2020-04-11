import chalk from "chalk";

export function errorHandler(err, req, res, next) {
   console.log(chalk.bold.red("ERROR"), `${err.constructor.name}: ${err.message}`);
   console.log(err);
   var responseCode = 500;
   if (err.name == "UnauthorizedError") {
      responseCode = 401;
   } else if (err.responseCode) {
      responseCode = err.responseCode;
   }
   res.status(responseCode).json({
      status: false,
      message: err.message,
   });
}
