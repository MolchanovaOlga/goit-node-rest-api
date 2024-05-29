async function changeAvatar(req, res, next) {
  try {
    res.send("Change avatar");
  } catch (err) {
    next(err);
  }
}

export default { changeAvatar };
