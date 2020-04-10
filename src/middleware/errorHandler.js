import chalk from "chalk";

export function errorHandler(err, req, res, next) {
   console.log(chalk.bold.red("ERROR"), `${err.constructor.name}: ${err.message}`);
   res.status(err.responseCode ? err.responseCode : 500).json({
      status: false,
      message: err.message,
   });
}
