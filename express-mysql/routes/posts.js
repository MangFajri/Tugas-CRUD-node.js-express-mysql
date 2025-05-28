var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');
const { name } = require('ejs');

/**
 * INDEX POSTS
 */
router.get('/', function(req, res, next) {
    //query 
    connection.query('SELECT * FROM tbl_27_post ORDER BY id DESC', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        }else { 
           // render ke view posts
           res.render('posts/index', {
                data: rows // <-- data dari database
            });
        }
    });
});    

/**
 * CREATE POSTS
 */
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        title: '',
        content: ''
    });
})

router.post('/store', function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if (title.length === 0) {
        errors = true;
        req.flash('error', "Title tidak boleh kosong");

        res.render('posts/create', {
            title: title,
            content: content
        });
    }

    // jika tidak ada error
    if (!errors) {
        let formData = {
            title: title,
            content: content
        }

        // query insert data
        connection.query('INSERT INTO tbl_27_post SET ?', formData, function (err, result) {
            // jika error
            if (err) {
                req.flash('error', err);
                // render ke view add.ejs
                res.render('posts/create', {
                    title: formData.title,
                    content: formData.content
                })
            } else {
                req.flash('success', 'Data berhasil disimpan');
                // redirect ke halaman posts
                res.redirect('/posts');
            }
        }); 
    }
})

/**
 * EDIT POSTS
 */
router.get('/edit/(:id)', function (req, res, next) {
    let id = req.params.id;

    // query select data by ID
    connection.query('SELECT * FROM tbl_27_post WHERE id = ' + id, function (err, rows, fields) {
        // jika ada error
        if(err) throw err
        // jika data tidak ditemukan
        if (rows.length <= 0) {
            req.flash('error', 'Data tidak ditemukan dengan ID = ' + id);
            // redirect ke halaman posts
            res.redirect('/posts');
        } else {
            // jika data ditemukan
            res.render('posts/edit', {
                title: rows[0].title,
                content: rows[0].content,
                id: rows[0].id
            });
        }

       
    });
});

/**
 * UPDATE POSTS
 */
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id;
    let title = req.body.title;
    let content = req.body.content;
    let errors = false;

    if (title.length === 0) {
        errors = true;
        req.flash('error', "Title tidak boleh kosong");

        res.render('posts/edit', {
            id: req.params.id, 
            title: title,
            content: content
            
        });
    }
    if (content.length === 0) {
        errors = true;
        req.flash('error', "Content tidak boleh kosong");

        res.render('posts/edit', {
            id: req.params.id,
            title: title,
            content: content
           
        });
    }

    // jika tidak ada error
    if (!errors) {
        let formData = {
            title: title,
            content: content
        }

        // query update data
        connection.query('UPDATE tbl_27_post SET ? WHERE id = ' + id, formData, function (err, result) {
            // jika error
            if (err) {
                req.flash('error', err);
                // render ke view edit.ejs
                res.render('posts/edit', {
                    id: req.params.id,
                    name: formData.name,
                    author: formData.author
                   
                })
            } else {
                req.flash('success', 'Data berhasil diupdate');
                // redirect ke halaman posts
                res.redirect('/posts');
            }
        });
    }
}
);    
module.exports = router;