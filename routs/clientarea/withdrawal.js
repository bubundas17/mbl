const express = require('express');
const middlewares = require('../../includs/middlewares');
const func = require('../../includs/func');
const router = express.Router();


const sysinfoDB = require('../../models/sysinfo');
const widwrawlDB = require('../../models/withdrawal');

// Withdrawal Paths
router.get('/', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    Promise.all([widwrawlDB.find({user: req.user._id, status: 1}), widwrawlDB.find({user: req.user._id})])
        .then(reqs => {
            res.locals.title = 'Withdrawal Requests ' + ' - ' + res.locals.title;
            res.render('clientarea/widwrawl/index.ejs', {widwrawls: reqs[0], all: reqs[1]})
        })
        .catch(err => {
            console.log("Cannot read Database!");
            console.log(err);
        })
});

router.get('/bank', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    res.locals.title = 'Withdrawal Via Bank Transfer' + ' - ' + res.locals.title;
    res.render('clientarea/widwrawl/bank.ejs')
});

router.post('/bank', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    let amount = req.body.amount;
    let bank =  req.body.bank;
    let payee =  req.body.payee;
    let ifsc =  req.body.ifsc;
    let accountnumber =  req.body.accountnumber;
    let message   = req.body.message;

    amount = parseInt(amount);
    if (amount < 100) {
        req.flash("error", "Amount cannot be less than 100!");
        return res.redirect('back')
    }

    if (req.user.credits > amount) {
        req.user.credits -= amount;
        req.user.save()
    } else {
        req.flash("error", "You do not have enough credits in your account");
        return res.redirect('back')
    }

    widwrawlDB.create({
        method: 1,
        user: req.user._id,
        amount: amount,
        bank: {
            payee: payee,
            bank: bank,
            accountNumber: accountnumber,
            ifsc: ifsc
        },
        message: message
    })
        .then(data => {
            req.flash("success", "Cool! Your request is submitted!");
            res.redirect('back')
        })
        .catch(err => {
            req.flash("error", "Something is wants Wrong.");
            res.redirect('back');
            console.log("Database Update Failed!");
            console.log(err);
        })
});

router.get('/bitcoin', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    res.locals.title = 'Withdrawal Via BitCoin ' + ' - ' + res.locals.title;
    res.render('clientarea/widwrawl/bitcoin.ejs');
});

router.post('/bitcoin', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    let amount = req.body.amount;
    amount = parseInt(amount);

    if (amount < 1000) {
        req.flash("error", "Amount cannot be less than 1000!");
        return res.redirect('back')
    }

    if (req.user.credits > amount) {
        req.user.credits -= amount;
        req.user.save()
    } else {
        req.flash("error", "You do not have enough credits in your account");
        return res.redirect('back')
    }

    widwrawlDB.create({
        user: req.user._id,
        amount: amount,
        method: 3,
        bitcoin: {
            walletAddress: req.user.bitcoin
        },
        tkcaddress: req.user.bitcoin
    })
        .then(data => {
            req.flash("success", "Cool! Your request is submitted!");
            res.redirect('back')
        })
        .catch(err => {
            req.flash("error", "Something is wants Wrong.");
            res.redirect('back');
            console.log("Database Update Failed!");
            console.log(err);
        })
});

router.get('/recharge', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    res.locals.title = 'Withdrawal Via Mobile Recharge ' + ' - ' + res.locals.title;
    sysinfoDB.findOne({name: "Tkc4you"})
        .then(info => {
            res.render('clientarea/widwrawl/recharge.ejs', {info})
        })

});

router.post('/recharge', middlewares.ifLoggedIn, middlewares.ifActive, (req, res) => {
    const number = req.body.number;
    const message = req.body.message;
    let amount = req.body.amount;
    amount = parseInt(amount);

    if (amount < 10) {
        req.flash("error", "Amount cannot be less than 10!");
        return res.redirect('back')
    }

    if (req.user.credits > amount) {
        req.user.credits -= amount;
        req.user.save()
    } else {
        req.flash("error", "You do not have enough credits in your account");
        return res.redirect('back')
    }

    widwrawlDB.create({
        user: req.user._id,
        method: 2,
        recharge: {
            number: number,
        },
        message: message,
        amount: amount
    })
        .then(data => {
            req.flash("success", "Cool! Your request has been submitted!");
            return res.redirect('back')
        })
        .catch(err => {
            req.flash("error", "Something is wants Wrong.");
            res.redirect('back');
            console.log("Database Update Failed!");
            console.log(err);
        })
});

module.exports = router;