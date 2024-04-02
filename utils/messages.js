function generateMessage(text, username) {

  const name = username.split(" ");

  for (let i = 0; i < name.length; i++) {
    name[i] = name[i][0].toUpperCase() + name[i].substr(1);
  }

  name.join(" ");

  return {
    text,
    name,
    createdAt: new Date().getTime()
  }

}

module.exports = { generateMessage };