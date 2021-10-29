/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloworld = (req, res) => {
  let message = req.query.message || req.body.message || '{"message": "Hello World!"}';
  res.status(200).send(message);
};
