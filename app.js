require("dotenv").config
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { render } = require('ejs');
const cors = require('cors')
const bodyParser = require('body-parser')
const port =  process.env.PORT


const dbURI = process.env.URI;
//usenewurlparser... gets rid of deprecated error
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port || 4000)) //fire when connected to db
    .then((result) => console.log('handshake initialized'))
    .then((result) => console.log('connecting...'))
    .then((result) => console.log('handshake completed'))
    .catch((err) => console.log(err)); // logs mah errors

//express app
const app = express();

// register view engine
//app.set('view engine', 'ejs');


//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //takes all encoded data and passes into an object
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

//to add a blog              //create a new instance of a blog doc and save it to db
app.get('/add-blog', (req, res) => {
    const blog = new Blog({ //model used to create new doc
        title: 'new blog 2',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });
    
    blog.save()        //method to save to db (blog is const)
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
});
 //gets all blogs
app.get('/all-blogs', (req, res) => {
    Blog.find() //looks for blogs on the blog
    .then((result) => { 
     res.send(result);
    })
     .catch((err) => { 
        console.log(err);
     });
})

app.get('/single-blog', (req,res) => {
    Blog.findById('62c4f509d002955d465444f6') //gets a blog with a specific id
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
})

//route
app.get('/', (req, res) => {
    res.redirect('/blogs');
});


//routers

app.get('/about', (req, res) => {
    res.send( { title: 'about' })
});

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1})
    .then((result) => {
        console.log(req, res)
        res.send( { title: 'All Blogs', blogs: result })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/blogs', (req, res) => {
    console.log(req.body);
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});



// blog  routes
app.get('/blogs', (req, res) => {
    Blog.find().sort( {createdAt: -1}) //gets all blogs Blogs (model)
    .then((result) => {
        res.send( {title: 'ALL Blogs', blogs: result})
    })
    .catch((err) => {
        console.log(err); 
    })
})

//add post
// app.post('/blogs', (req, res) => {
//     const blog = new Blog(req.body);

//     blog.save()
//         .then((result) => {
//             res.redirect('/blogs')
//         })
//         .catch((err)=> {
//             console.log(err);
//         })
// })

app.get('/blogs/create', (req, res) => {
    res.send( { title: 'create' } );
});



//get a blog up close
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then((result) => {
        console.log(
            { blog: result, title: 'Blog Details' }
        )
        res.send( { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
        console.log(err);
    });
})

//handle delete request 
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });


//404 page (app.use says use this for every request but only is active if none of the above urls worked)
app.use((req, res) =>{
    res.status(404).render('404', { title: 'Error' });
});

