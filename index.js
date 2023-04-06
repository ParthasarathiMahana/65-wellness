const express = require('express');
const env = require('./config/environment')
const app = express();
const port = 8000;
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use('/assets',express.static(env.asset_path));
app.use(express.urlencoded());

const db = require("./config/mongoose");
const model = require("./models/courses");
const adminDB = require("./models/admin");
const subcategories = require("./models/subcategory");
const { render } = require('ejs');

// home page(default)
app.get('/', function(req, res)
{
    model.find({}, function(err, courses){
        if(err){
            console.log(err);
            return;
        }
        return res.render("index",
        {
            courseList: courses
        });
    });
});

// login form authentication
app.post('/login', function(req, res){
    adminDB.find({}, function(err, admin){
        if(err)
        {
            console.log("error finding admin", err);
            return;
        }

        if(req.body.email === admin[0].email && req.body.password === admin[0].password)
        {
            model.find({}, function(err, courses){
                if(err){
                    console.log(err);
                    return;
                }
                return res.render("createCourse",{
                    courseList: courses
                });
            });
        }
    })
});

// creating course after authentication
app.post('/create_course', function(req, res){
   model.create({
    courseName:req.body.CourseName,
    description:req.body.description
   },
   function(err){
    if(err)
    {
        console.log(err);
        return;
    }

    model.find({}, function(err, courses){
        if(err){
            console.log(err);
            return;
        }
        return res.render("createCourse",
        {
            courseList: courses
        });
    })
})
});

// for course details
app.get('/coursedetails/:id', function(req, res){
    // model.findById(req.params.id, function(err, course){
    //     if(err)
    //     {
    //         console.log(err);
    //         return;
    //     }
    //     return res.render('courseDetails', {
    //         course : course
    //     });
    // })
    model.findById(req.params.id).populate({
        path: 'subcategory'
    }).
    exec(function(err, course){
        return res.render('courseDetails', {
                    course : course
                });
    })
});

// adding subcategories
app.post('/addSubcategory', function(req, res){
    model.findById(req.body.course, function(err, course){
        if(err)
        {
            console.log(err);
            return;
        }

        subcategories.create({
            categoryId: req.body.course,
            subcategoryName: req.body.subcategory,
            description: req.body.subcategoryDescription
        }, function(err, sc){
            if(err)
            {
                console.log(err);
                return;
            }

            course.subcategory.push(sc);
            course.save();

            model.find({}, function(err, courses){
                if(err){
                    console.log(err);
                    return;
                }
                return res.render("createCourse",
                {
                    courseList: courses
                });
            })
        })
    });
});

app.listen(port, function(err)
{
    if(err)
    {
        console.log("Error Occured While Lstening to the port", port);
        return;
    }

    
    console.log(`Server is up and running on port ${port}`);
});