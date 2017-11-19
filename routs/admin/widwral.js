const express = require('express');
const router = express.Router();
const userDB = require('../../models/user');
const middlewares = require('../../includs/middlewares');
const func = require('../../includs/func');
const widwrawlDB = require('../../models/withdrawal');
const rechargeDB = require('../../models/recharge');


router.get('/', middlewares.ifLoggedIn, middlewares.ifAdmin, (req, res) => {
    Promise.all([
        widwrawlDB.find({status: 1}),
    ])
        .then(all => {
            res.render('admin/widwrawl/index.ejs', {widwrawls: all[0]})
        })
        .catch(err => {
            console.log('Database Error');
            console.log(err);
            req.flash('error', 'Database Read Error');
            res.redirect('back')
        })
});

router.get("/:id/view", (req, res) => {
    widwrawlDB.findById(req.params.id)
        .populate("user")
        .then( data => {
            res.render('admin/widwrawl/view.ejs', {data})
        })
});

router.post("/:id", (req, res) => {
    let status =  req.body.status
    status = parseInt(status);
    widwrawlDB.findById(req.params.id)
        .then( data => {
            data.status = status;
            data.save( err => {
                if(err){
                    console.log(err);
                    req.flash('error', 'Unable To Save! Contact to Developer!');
                    return res.redirect('back');
                }
                req.flash('success', 'Saved!');
                return res.redirect('back');
            })
        })
        .catch( err => {
            console.log(err);
            req.flash('error', 'Unable To Save! Contact to Developer!');
            return res.redirect('back');
        })

});

router.get('/all', middlewares.ifLoggedIn, middlewares.ifAdmin, (req, res) => {
    Promise.all([
        sysinfoDB.findOne({name: "Tkc4you"}),
        widwrawlDB.find().populate('user'),
        rechargeDB.find().populate('user')
    ])
        .then(all => {
            res.render('admin/widwrawl/requests.ejs', {info: all[0], widwrawls: all[1], recharges: all[2]})
        })
        .catch(err => {
            console.log('Database Error');
            console.log(err);
            req.flash('error', 'Database Read Error');
            res.redirect('back')
        })
});


module.exports = router;
