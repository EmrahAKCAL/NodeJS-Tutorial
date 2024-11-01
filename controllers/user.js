const Category = require('../models/category');
const Course = require('../models/course');
const {Op} = require("sequelize");

const get_courses_by_category = async (req, res) => {
    const slug = req.params.slug;
    try {
        const courses = await Course.findAll({
            include: {
                model: Category,
                where: {slug: slug}
            },
            raw: true
        });
        const categories = await Category.findAll();
        res.render('users/courses/courses', {
            title: "Category: " + slug + " courses",
            categories,
            courses: courses,
            categorySlug: slug
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
    try {
        const courses = await Course.findAll({raw: true});
        const categories = await Category.findAll();
        res.render('users/courses/courses', {
            title: "All courses",
            categories,
            courses: courses,
            categorySlug: 'all',
        });
    } catch (err) {
        console.log(err);
    }
};

const get_popular_courses = async (req, res) => {
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
        const courses = await Course.findAll({
            where: {
                // isPopular: true, // her ikisini de kullanabiliriz.
                isPopular: {
                    [Op.eq]: true // eğer isPopular true eşitse
                }
            }, raw: true // raw: true ile sadece verileri alırız.
        });
        const categories = await Category.findAll();
        res.render('users/courses/index', {
            title: "Popular Courses",
            categories,
            courses: courses,
            categorySlug: null,
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