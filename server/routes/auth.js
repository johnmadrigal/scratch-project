const auth = require('express').Router();
const bcrypt = require('bcrypt');
const db = require('../pool/pool');

const saltRounds = 10;

// login route
auth.post('/login', (req, res) => {
  res.status(200).send('Connected to login route');
});

// passport - use passport.authenticate local strat to redirect success and failure
// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

// passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })

// signup route
auth.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, zipCode, st, city, state } = req.body;
  console.log('reqbody', req.body);
  // check if user is in database
  // const getUserQuery = `SELECT * FROM users WHERE email = ""`
  // const user = await db.query(getUserQuery);
  // if(!user) {
  try {
    const createAddressQuery = {
      text:
        'INSERT INTO public.address(zipcode, street, city, state) VALUES($1, $2, $3, $4) RETURNING *',
      values: [zipCode, st, city, state],
    };
    const address = await db.query(createAddressQuery);
    // console.log(address);
    const hash = await bcrypt.hash(password, saltRounds);

    const createUserQuery = {
      text:
        'INSERT INTO public.users("email", "firstName", "lastName", "password", "address_id") VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [email, firstName, lastName, hash, address.rows[0]._id],
    };

    const newUser = await db.query(createUserQuery);
    console.log(newUser.rows[0]);
    res.status(200).json({ user: newUser.rows[0], address: address.rows[0] });
  } catch (e) {
    console.log(e);
  }

  // }

  // bcrypt.hash(password, saltRounds, (err, hash) => {
  //   // insert a new user into the database

  //   db.query(createUserQuery, (err, res) => {
  //     if(err) return next(err)

  //   })
  //   res.status(200).json({ ...req.body, password: hash });
  // });
});

module.exports = auth;
