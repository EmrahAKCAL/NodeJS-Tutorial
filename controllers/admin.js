const {Op} = require('sequelize');
const Course = require('../models/course');
const Category = require('../models/category');
const fs = require("fs");
const slugify = require('../helpers/slugify');
//courses
const get_course_create = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render('admin/courses/create', {
            title: "Admin Courses",
            categories,
        });
    } catch (err) {
        console.log(err);
    }
}
const post_course_create = async (req, res) => {
    try {
        const categoryIds = req.body.categories;
        const data = {
            ...req.body,
            slug: slugify(req.body.title),
            img: req.file.filename,
            isPopular: req.body.isPopular === 'on',
            // categoryId: parseInt(req.body.categoryId),
            categories: []
        }
        const course = await Course.create(data);
        if (categoryIds !== undefined) {
            await course.setCategories(categoryIds.map(cat => parseInt(cat)));
        }
        res.redirect('/admin/courses?action=create&title=' + data.title);
    } catch (err) {
        console.log(err);
    }
}
const get_course_edit = async (req, res) => {
    const id = req.params['courseId'];
    try {
        const course = await Course.findByPk(id, {
            include: {
                model: Category,
                attributes: ['id']
            }
        }, {raw: true});
        const categories = await Category.findAll({raw: true});
        if (course) {
            return res.render('admin/courses/edit', {
                title: 'Course: '+ course.title + " - Edit",
                course: course,
                categories,
            });
        }
        res.render('errors/404');
    } catch (err) {
        console.log(err);
    }
}
const post_course_edit = async (req, res) => {
    const id = req.body.id;
    const categoryIds = req.body.categories;
    try {
        const course = await Course.findByPk(id, {
            include: {
                model: Category,
                attributes: ['id']
            }
        }, {raw: true});
        if (!course) {
            return res.render('errors/404');
        }
        course.title = req.body.title;
        course.slug = slugify(req.body.title);
        course.description = req.body.description;
        course.img = req.body['oldImg'];
        course.isPopular = req.body.isPopular === 'on';
        // course.categoryId = parseInt(req.body.categoryId);
        if (req.file) {
            course.img = req.file.filename
            fs.unlink('public/images/' + req.body['oldImg'], (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        await course.setCategories([]);
        if (categoryIds !== undefined) {
            const selectedCategories = await Category.findAll({
                where: {
                    id: {
                        [Op.in]: categoryIds
                    }
                },
                raw: true
            });
            await course.setCategories(selectedCategories.map(cat => cat.id));
        }
        await course.save();
        // await Course.update(course, {where: {id}});
        res.redirect('/admin/courses?action=edit&id=' + id);
    } catch (err) {
        console.log(err);
    }
}
const get_course_delete = async (req, res) => {
    try {
        const id = req.params['courseId'];
        const courses = await Course.findByPk(id,{raw: true});
        if (courses) {
            return res.render('admin/courses/delete', {
                title: "Course: " + courses.title + " - Delete",
                course: courses
            })
        }
        res.render('errors/404');
    } catch (err) {
        console.log(err);
    }
}
const post_course_delete = async (req, res) => {
    const id = req.body.id;
    try {
        await Course.destroy({where: {id}});
        res.redirect('/admin/courses?action=delete&id=' + id);
    } catch (err) {
        console.log(err);
    }
}
const get_course_list = async (req, res) => {
    const size = 5;
    const {page = 1} = req.query;
    try {
        const {rows, count} = await Course.findAndCountAll({
            attributes: ['id', 'title', 'description', 'isPopular', 'img'],
            include: { // ilişkili tabloyu getirir
                model: Category,
                attributes: ['name']
            },
            order: [['id', 'ASC']],
            limit: size,
            offset: (page -1) * size,
            distinct: true // ilişkili tablodan gelen verileri tekrarsız getirir
        }) // eager loading (tek sorguda ilişkili tabloyu getirir)
        res.render('admin/courses/index', {
            title: "Admin Courses",
            courses: rows,
            action: req.query.action,
            totalPages: Math.ceil(count / size),
            totalItems: count,
            currentPage: parseInt(page),
            currentSize: size,
            courseTitle: req.query.title,
            id: req.query.id,
        });
    } catch (err) {
        console.log(err);
    }
}
//categories
const get_remove_course_from_category = async (req, res) => {
    const categoryId = req.body.categoryId;
    const courseId = req.body.courseId;
    const category = await Category.findByPk(categoryId);
    const course = await Course.findByPk(courseId);
    await category.removeCourse(course);
    res.redirect('/admin/categories/edit/' + categoryId);
}
const get_category_create = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.render('admin/categories/create', {
            title: "Create Category",
            categories
        });
    } catch (err) {
        console.log(err);
    }
}
const post_category_create = async (req, res) => {
    const name = req.body.name;
    try {
        await Category.create({
            name: name,
            slug: slugify(name)
        });
        res.redirect('/admin/categories?action=create&name=' + name);
    } catch (err) {
        console.log(err);
    }
}
const get_category_edit = async (req, res) => {
    const id = req.params.categoryId;
    try {
        const category = await Category.findByPk(id);
        const courses = await category.getCourses(); // ilgili kategorideki kurslar getirir // lazy loading
        const countCourses = await category.countCourses(); // ilgili kategorideki course sayısını getirir // lazy loading
        if (category) {
            return res.render('admin/categories/edit', {
                title: 'Category: '+ category.name + " - Edit",
                category: category.dataValues,
                courses,
                countCourses
            });
        }
        res.render('errors/404');
    } catch (err) {
        console.log(err);
    }
}
const post_category_edit = async (req, res) => {
    try {
        const id = req.params.categoryId;
        const category = await Category.findByPk(id);
        category.name = req.body.name;
        await category.save();
        if (category) {
            return res.redirect('/admin/categories?action=edit&id=' + id);
        }
    } catch (err) {
        console.log(err);
    }
}
const get_category_delete = async (req, res) => {
    const id = req.params.categoryId;
    try {
        const category = await Category.findByPk(id);
        if (category) {
            return res.render('admin/categories/delete', {
                title: "Category: " + category.name + " - Delete",
                category: category.dataValues
            });
        }
        res.render('errors/404');
    } catch (err) {
        console.log(err);
    }
}
const post_category_delete = async (req, res) => {
    const id = req.params.categoryId;
    try {
        await Category.destroy({where: {id}});
        res.redirect('/admin/categories?action=delete&id=' + id);
    } catch (err) {
        console.log(err);
    }
}
const get_category_delete_all = async (req, res) => {
    try {
        res.render('admin/categories/deleteAll', {
            title: "Delete All Categories",
        });
    } catch (err) {
        console.log(err);
    }

}
const post_category_delete_all = async (req, res) => {
    try {
        await Category.destroy({where: {}});
        res.redirect('/admin/categories?action=delete-all');
    } catch (err) {
        console.log(err);
    }
}
const get_category_list = async (req, res) => {
    const action = req.query.action;
    const id = req.query.id;
    const name = req.query.name;
    const size = 5;
    const {page = 1} = req.query;
    try {
        const {rows, count} = await Category.findAndCountAll({
            order: [['id', 'ASC']],
            limit: size,
            offset: (page -1) * size,
            distinct: true
        });
        res.render('admin/categories/index', {
            title: "Categories",
            categories: rows,
            action,
            id,
            name,
            totalPages: Math.ceil(count / size) || 0,
            totalItems: count,
            currentPage: parseInt(page),
            currentSize: size,
        });
    } catch (err) {
        console.log(err);
    }
}
module.exports = {
    get_course_create,
    post_course_create,
    get_course_edit,
    post_course_edit,
    get_course_delete,
    post_course_delete,
    get_course_list,
    get_remove_course_from_category,
    get_category_create,
    post_category_create,
    get_category_edit,
    post_category_edit,
    get_category_delete,
    post_category_delete,
    get_category_delete_all,
    post_category_delete_all,
    get_category_list
}
