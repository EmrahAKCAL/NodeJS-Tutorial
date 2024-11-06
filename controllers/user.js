const Category = require('../models/category');
const Course = require('../models/course');
const {Op} = require("sequelize");

const get_courses_by_category = async (req, res) => {
    const slug = req.params.slug;
    const size = 5;
    const {page = 1} = req.query
    try {
        const {rows, count} = await Course.findAndCountAll({
            include: {
                model: Category,
                where: {slug: slug}
            },
            order: [['id', 'ASC']],
            limit: size,
            offset: (page - 1) * size,
            raw: true
        });
        const categories = await Category.findAll();
        res.render('users/courses/courses', {
            title: "Category: " + slug + " courses",
            categories,
            courses: rows,
            categorySlug: slug,
            totalPages: Math.ceil(count / size),
            totalItems: count,
            currentPage: parseInt(page),
            currentSize: size,
        });
    } catch (error) {
        res.render('errors/500');
    }
};

const get_course_details = async (req, res) => {
    const slug = req.params.slug;
    try {
        const course = await Course.findOne({where: {slug: slug}, raw: true});
        if (course) {
            return res.render('users/courses/details', {
                title: 'Course: ' + course.title,
                course: course,
            });
        }
        res.render('errors/404');
    } catch (error) {
        res.render('errors/500');
    }
};

const get_course_list = async (req, res) => {
    const size = 5;
    const {page = 1} = req.query;
    try {
        const {rows, count} = await Course.findAndCountAll({
            raw: true,
            order: [['id', 'ASC']],
            limit: size,
            offset: (page - 1) * size,
        });
        const categories = await Category.findAll();
        res.render('users/courses/courses', {
            title: "All courses",
            categories,
            courses: rows,
            categorySlug: 'all',
            totalPages: Math.ceil(count / size),
            totalItems: count,
            currentPage: parseInt(page),
            currentSize: size,
        });
    } catch (err) {
        console.log(err);
    }
};

const get_popular_courses = async (req, res) => {
    const size = 5;
    const {page = 1} = req.query;
    try {
        // const courses = await Course.findAll({ where: {
        //     isPopular: true,
        //     categoryId: req.query.categoryId
        // }});

        // const courses = await Course.findAll({where: {
        //     [Op.and]: [{isPopular: true}, {categoryId: req.query.categoryId}]
        //     }});

        // const courses = await Course.findAll({where: {
        //     [Op.or]: [{isPopular: true}, {categoryId: req.query.categoryId}]
        //     }});
        // const courses = await Course.findAndCountAll({where: {isPopular: true}, raw: true, limit: 2, offset: 0});
        const {rows, count} = await Course.findAndCountAll({
            where: {
                // isPopular: true, // her ikisini de kullanabiliriz.
                isPopular: {
                    [Op.eq]: true // eğer isPopular true eşitse
                }
            },
            raw: true, // raw: true ile sadece verileri alırız.
            order: [['id', 'ASC']],
            limit: size,
            offset: (page - 1) * size,
        });
        const categories = await Category.findAll({order: [['id', 'ASC']]});
        res.render('users/courses/index', {
            title: "Popular Courses",
            categories,
            courses: rows,
            categorySlug: null,
            totalPages: Math.ceil(count / size),
            totalItems: count,
            currentPage: parseInt(page),
            currentSize: size,
            // isAuthenticated: req.cookies.isAuthenticated
            // isAuthenticated: req.session.isAuthenticated
        });
    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    get_courses_by_category,
    get_course_details,
    get_course_list,
    get_popular_courses
}
