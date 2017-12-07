const express = require('express');
const middlewares = require('../../includs/middlewares');
const func = require('../../includs/func');
const router = express.Router();
const userDB = require('../../models/user');
const config = require('../../config.js');

router.get('/', (req, res) => {
    res.locals.title = 'Active Users Using Your Credits' + ' - ' + res.locals.title;
    res.render("clientarea/activation/activate.ejs");
});

router.post('/', (req, res) => {
    res.locals.title = 'Active Users Using Your Credits' + ' - ' + res.locals.title;
    userDB.findOne({username: req.body.username})
        .then(user => {
            if (!user) {
                req.flash("error", "User Nit found!");
                return res.redirect("back")
            }
            if (user.isActive == true) {
                req.flash("error", "No Need! User Is Already Activated!");
                return res.redirect("back")
            }
            if (req.user.credits < 800) {
                req.flash("error", "You do nor have enough credits in your account.");
                req.flash("info", "You Need atlast 800 Inr In your account to active.");
                return res.redirect("back")
            }
            if (req.body.confirm == "ok") {
                user.isActive = true
                func.doRefCredit(user);
                return user.save(e => {
                    if (e) {
                        console.log(e)
                        req.flash('error', 'Something Is Wants Wrong! Please Contact To Administrator.');
                        return res.redirect('back');
                    }
                    req.flash('success', 'User Activated!');
                    userDB.findByIdAndUpdate(req.user._id, {$inc: {credits: -800}}).exec();
                    return res.redirect('back');
                })
            }
            res.render("clientarea/activation/review.ejs", {actuser: user});
        })
});

module.exports = router;
