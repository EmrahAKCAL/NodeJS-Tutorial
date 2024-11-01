const exp = require('express');
const app = exp();
const adminCoursesRoutes = require('./routes/admin/courses');
const adminCatRoutes = require('./routes/admin/categories');
const userCoursesRoutes = require('./routes/users/courses');
const userCatRoutes = require('./routes/users/categories');
const path = require('path');
app.set('view engine', 'ejs');
app.use(exp.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.use("/libs", exp.static(path.join(__dirname, 'node_modules')));
app.use("/static", exp.static(path.join(__dirname, 'public')));
app.use('/admin/courses', adminCoursesRoutes);
app.use('/admin/categories', adminCatRoutes);
app.use('/categories', userCatRoutes);
app.use(userCoursesRoutes);


//ilişkiler
const sequelize = require('./data/db');
const dummyData = require('./data/dummy-data');
const Category = require('./models/category');
const Course = require('./models/course');

/**************************************************************** One-to-One BAŞLANGIÇ *********************************************************
Category.hasMany(Course, {
    foreignKey: {
        name: 'categoryId', // kurs tablosunda categoryId adında bir sütun oluşturulacak.
        allowNull: false, // categoryId sütunu boş olamaz.
        // defaultValue: 1 // Eğer bir kurs eklenirken categoryId belirtilmezse, categoryId değeri 1 olacak.
    },
    // onDelete: 'CASCADE', // Eğer bir Category silinirse, o Category'e ait tüm Course'lar da silinecek. // varsayılan olarak CASCADE
    // onUpdate: 'CASCADE' // Eğer bir Category güncellenirse, o Category'e ait tüm Course'lar da güncellenecek. // varsayılan olarak CASCADE
    onDelete: 'RESTRICT', // Eğer bir Category silinirse, o Category'e ait tüm Course'lar silinmeyecek.
    onUpdate: 'RESTRICT' // Eğer bir Category güncellenirse, o Category'e ait tüm Course'lar güncellenmeyecek.
    // onDelete: 'SET NULL', // Eğer bir Category silinirse, o Category'e ait tüm Course'ların categoryId değeri NULL olacak. (bu durum için allowNull: true olmalı)
    // onUpdate: 'SET NULL' // Eğer bir Category güncellenirse, o Category'e ait tüm Course'ların categoryId değeri NULL(bu durum için allowNull: true olmalı)
}); // Bir Category modeli birden fazla Course modeline sahip olabilir. Yabancı anahtar course tablosunda olacak.
 Course.belongsTo(Category); // Bir Course modeli bir Category modeline ait olabilir.

//**************************************************************** One-to-One SON *********************************************************/

//**************************************************************** Many-to-Many BAŞLANGIÇ *********************************************************

Course.belongsToMany(Category, {through: 'course_category'}); // Course modeli Category modeline ait olabilir. course_category adında bir tablo oluşturulacak.
Category.belongsToMany(Course, {through: 'course_category'}); // Category modeli Course modeline ait olabilir. course_category adında bir tablo oluşturulacak.




// IIFE fonksiyonu
// (async () => {
//     await sequelize.sync({force: false});
//     await dummyData();
// })();


app.use((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.write(JSON.stringify({
        success: false,
        status: 404,
        message: "Resource not found"
    }));
    res.end();
});
app.use((error, req, res) => {
    res.setHeader("Content-Type", "application/json");
    const status = error.status || 500;
    res.statusCode = status;
    res.write(JSON.stringify({
        success: false,
        status: status,
        message: error.message
    }));
    res.end();
});

app.listen(8080);
console.log('Server is running on http://127.0.0.1:8080');
