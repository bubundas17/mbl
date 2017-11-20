const express = require('express');
const middlewares = require('../../includs/middlewares');
const router = express.Router();
const userDB = require('../../models/user');
const referralDB = require('../../models/referrals');

// routes
const statementRoutes = require('./statement');
const ticketsRoutes = require('./tickets.js');
const referralRouts = require('./referral.js');
const withdrawalRouts = require('./withdrawal');

router.get('/', middlewares.ifLoggedIn, function (req, res) {
    Promise.all([
        userDB.count({referedBy: req.user._id}),
        userDB.count({upTree: req.user._id}),
        userDB.count({})
    ])
        .then( all => {
            res.render("clientarea/index.ejs", {totalRef: all[0], downLine: all[1], all: all[2]});
        })
});

router.use('/statement', statementRoutes);
router.use('/tickets', ticketsRoutes);
router.use('/referral', referralRouts);
router.use('/withdrawal', withdrawalRouts);

module.exports = router;
