const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

dotenv.config();
const PORT = process.env.PORT || 8080;

//MongoDB connection
const  connectDB = require('./server/database/connection');
connectDB();

//parse request to bodyParser
app.use(bodyParser.urlencoded({extended: false}));

//Using session
app.use(session({
    secret: 'secretToken',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge3: 3 * 24 * 60 * 60 }
}));

//Using cookieParser
app.use(cookieParser());

//parse request to json
app.use(express.json());

//set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

//Using morgan
app.use(logger('dev'));

//load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/datatables", express.static(path.resolve(__dirname, "assets/datatables")));
app.use("/sweet-alert", express.static(path.resolve(__dirname, "assets/sweet-alert")));
app.use("/notifyjs", express.static(path.resolve(__dirname, 'assets/notifyjs')))
app.use("/fonts", express.static(path.resolve(__dirname, "assets/fonts")));

//Load All Routes
const AuthRoutes = require('./server/routes/auth.route');
const HomeRoutes = require('./server/routes/home.route');
const UserRoutes = require('./server/routes/user.route');
const ProfileRoutes = require('./server/routes/profile.route');
const FonctionRoutes = require('./server/routes/fonction.route');
const EmployeRoutes = require('./server/routes/employe.route');
const CategoryRoutes = require('./server/routes/category.route');
const MaterielRoutes = require('./server/routes/materiel.route');
const DemandeRoutes = require('./server/routes/demande.route');
const HistoryRoutes = require('./server/routes/history.route');

app.use('/', AuthRoutes);
app.use('/', HomeRoutes);
app.use('/', UserRoutes);
app.use('/', ProfileRoutes);
app.use('/', FonctionRoutes);
app.use('/', EmployeRoutes);
app.use('/', CategoryRoutes);
app.use('/', MaterielRoutes);
app.use('/', DemandeRoutes);
app.use('/', HistoryRoutes);

// Cookies
app.get("/set-cookies", (req, res) => {
    //res.setHeader('set-cookie', 'newUser=true');
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
    res.send("You got the cookies");
});

app.get("/read-cookies", (req, res) => {
    const cookies = req.cookies;
    res.json(cookies);
});

app.listen(PORT, (err) => {
    if(err) {
        console.log('Couldn\'t connect to the database because: ', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});