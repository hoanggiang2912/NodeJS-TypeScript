var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const multer = require('multer');
const nodeMailer = require('nodemailer');

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

dotenv.config();

// Import Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const shopRouter = require("./routes/shop");
const singleProductRouter = require('./routes/singleProduct');
const checkoutRouter = require('./routes/checkout');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const forgotPasswordRouter = require('./routes/forgot');
const accountDetailRouter = require('./routes/accountDetail');

// Admin
const adminCategoriesRouter = require('./routes/admin/adminCategories');
const adminCategoryDetailRouter = require('./routes/admin/adminCategoryDetail');
const adminProductsRouter = require('./routes/admin/adminProducts');
const adminDashboardRouter = require('./routes/admin/adminDashboard');
const adminOrdersRouter = require('./routes/admin/adminOrders');
const adminUsersRouter = require('./routes/admin/adminUsers');

const categoriesAPIs = require('./routes/apis/categories');
const productsAPIs = require('./routes/apis/products');
const authAPIs = require('./routes/apis/auth');
const billsAPIs = require('./routes/apis/bills');
// const validateAPIs = require('./routes/validate');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use(cors());

app.use(async (req, res, next) => {
  const categoriesController = require('./controllers/CategoriesController');
  const categories = await categoriesController.getAll();
  const ProductsController = require('./controllers/ProductsController');
  const products = await ProductsController.getAll();
  // your data here
  const data = {
    categories,
    products
  };

  // add data to res.locals
  res.locals.data = data;

  // go to the next middleware function
  next();
});

// Route middleware
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/shop", shopRouter);
// app.use("/products", productsRouter);
app.use("/singleProduct", singleProductRouter);
app.use("/checkout", checkoutRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/category/', adminCategoryDetailRouter);
app.use('/admin/products/', adminProductsRouter);
app.use('/admin/dashboard/', adminDashboardRouter);
app.use('/admin/orders/', adminOrdersRouter);
app.use('/admin/users/', adminUsersRouter);

app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/forgot-password', forgotPasswordRouter);
app.use('/user/account-detail', accountDetailRouter);

//apis
app.use('/api/v1/categories', categoriesAPIs);
app.use('/api/v1/products', productsAPIs);
app.use('/api/v1/auth', authAPIs);
app.use('/api/v1/bills', billsAPIs);
// app.use('/api/v1/validate', validateAPIs);

// files uploading
app.post('/upload/categories/', upload.single('category-banner'), function (req, res, next) {
  res.json(req.file);
})
app.post('/upload/products', upload.array('productImages', 6), function (req, res) {
  res.json(req.files);
})

// connect to DB
// const connection = mongoose.connect('mongodb+srv://hohoanggiang80:hoduyhoanggiang2912@cluster0.xwkxz01.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
const connection = mongoose.connect('mongodb://localhost:27017/NodeJS-DB')
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404', { title: 'Not Found', layout: false});
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;



