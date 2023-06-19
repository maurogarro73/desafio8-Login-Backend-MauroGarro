import express from 'express';
import { UserModel } from './../DAO/models/users.model.js';
import { isAdmin, isUser } from '../middleware/auth.js';

export const authRouter = express.Router();

authRouter.get('/perfil', isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin };
  return res.render('perfil', { user: user });
});

authRouter.get('/admin', isUser, isAdmin, (req, res) => {
  return res.send('datos clasificados');
});

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'No se pudo cerrar su sesión :(' });
    } else {
      return res.redirect('/auth/login');
    }
  });
});

authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

authRouter.post('/login', async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).render('error', { error: 'Complete todos los campos' });
  }

  const userFound = await UserModel.findOne({ email: email });

  if (userFound && userFound.pass == pass) {
    req.session.email = userFound.email;
    req.session.isAdmin = userFound.isAdmin;
    return res.redirect('/products');
  } else {
    return res.status(401).render('error', { error: 'Usuario o contraseña incorrectos' });
  }
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post('/register', async (req, res) => {
  const { firstName, lastName, email, pass } = req.body;
  if (!firstName || !lastName || !email || !pass) {
    return res.status(400).render('error', { error: 'Complete todos los campos' });
  }
  try {
    await UserModel.create({ firstName, lastName, email, pass, isAdmin: false });
    req.session.email = email;
    req.session.isAdmin = false;

    return res.redirect('/auth/perfil');
  } catch (error) {
    console.log(error);
    return res.status(400).render('error', { error: 'No se pudo crear el usuario. Use otro email' });
  }
});
