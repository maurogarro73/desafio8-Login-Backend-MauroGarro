import express from 'express';

export const sessionRouter = express.Router();

sessionRouter.get('/', (req, res) => {
  if (req.session.cont) {
    req.session.cont++;
    res.send('nos visitaste ' + req.session.cont);
  } else {
    req.session.cont = 1;
    res.send('nos visitaste ' + 1);
  }
});

sessionRouter.get('/login', (req, res) => {
  /* console.log(req.session.user, req.session.admin); */
  const { username, password } = req.query;
  if (username !== 'pepe' || password !== 'pepepass') {
    return res.send('login failed');
  }
  req.session.user = username;
  req.session.admin = true;
  res.send('login success!');
});

sessionRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: 'Logout ERROR', body: err });
    }
    res.send('Logout ok!');
  });
});

sessionRouter.get('/show', (req, res) => {
  return res.send(JSON.stringify(req.session));
});
