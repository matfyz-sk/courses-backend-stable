export async function fetchResource(req, res, next) {
   try {
      await res.locals.resource.fetch();
      next();
   } catch (err) {
      next(err);
   }
}
