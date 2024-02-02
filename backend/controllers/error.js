export function errorPage(req, res, next) {
  res
    .status(404)
    .send({ message: "Error: The requested resource could not be found." });
}
