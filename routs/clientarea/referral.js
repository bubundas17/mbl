const express       = require('express');
const middlewares   = require('../../includs/middlewares');
const func          = require('../../includs/func');
var   router        = express.Router();
const userDB        = require('../../models/user');
const referralDB    =  require('../../models/referrals');
const json          = require('json-parser');
const config        = require('../../config.js');


router.get('/', middlewares.ifLoggedIn, function(req, res) {
    let query = req.query.q || ".*";
    userDB.paginate({referedBy: req.user._id,
        $or: [

            {
                username: { "$regex": query + "", "$options": "i" }
            }, {
                name: { "$regex": query + "", "$options": "i" }
            }

        ]
    }, {
        page: req.query.page || 1,
        limit: 10
    })
        .then((users) => {
            res.render("clientarea/referrals/index.ejs", {users: users})
        })
        .catch( err => {
            if (err) {
                console.error(err);
                req.flash('error', 'Somthing Is Wents Wrong!')
                return res.redirect('back');
            }
        })
  // res.render('clientarea/referrals/index.ejs')
});

router.get('/tree', middlewares.ifLoggedIn, function(req, res) {
    let query = req.query.q || ".*";
    let level = req.query.level || 1;
    level = parseInt(level);

    referralDB.paginate({user: req.user,
        level: level,
        // $or: [
        //
        //     {
        //         username: { "$regex": query + "", "$options": "i" }
        //     }, {
        //         name: { "$regex": query + "", "$options": "i" }
        //     }
        // ]
    }, {
        page: req.query.page || 1,
        limit: 10,
        populate: "refUser",
        sort: {_id: -1}
    })
        .then((users) => {
            res.render("clientarea/referrals/treeview.ejs", {users: users})
        })
        .catch( err => {
            if (err) {
                console.error(err);
                req.flash('error', 'Something Is Wants Wrong!');
                return res.redirect('back');
            }
        })
  // res.render('clientarea/referrals/index.ejs')
});


module.exports = router;
