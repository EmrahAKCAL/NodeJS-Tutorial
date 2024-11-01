const Category = require('../models/category');
const Course = require('../models/course');
const slugify = require('../helpers/slugify');

const populate = async () => {
    // await Category.sync({force: true}); // force: true tabloyu her seferinde yeniden oluşturur ve verileri siler
    // await Category.sync({alter: true}); // alter: true tabloyu günceller ve verileri silmez
    const count = await Category.count(); // tablodaki veri sayısını döner
    // const count = await Course.count();
    if (count === 0) {
        const categories = await Category.bulkCreate([
            {
                name: 'Web Development',
                slug: slugify('Web Development')
            },
            {
                name: 'Mobile Development',
                slug: slugify('Mobile Development')
            },
            {
                name: 'Desktop Development',
                slug: slugify('Desktop Development')
            },
        ]);
        const courses = await Course.bulkCreate([
            {
                title: 'Python',
                slug: slugify('Python'),
                description: 'Python is a high-level, interpreted, interactive and object-oriented scripting language. Python is designed to be highly readable. It uses English keywords frequently where as other languages use punctuation, and it has fewer syntactical constructions than other languages.',
                img: 'python.png',
                isPopular: true,
                // categoryId: 1,2,3
            },
            {
                title: 'JavaScript',
                slug: slugify('JavaScript'),
                description: 'JavaScript is a lightweight, interpreted programming language. It is designed for creating network-centric applications. It is complimentary to and integrated with Java. JavaScript is very easy to implement because it is integrated with HTML. It is open and cross-platform.',
                img: 'javaScript.png',
                isPopular: true,
                // categoryId: 1,2,3
            },
            {
                title: 'React',
                slug: slugify('React'),
                description: 'React is a front-end library developed by Facebook. It is used for handling the view layer for web and mobile apps. ReactJS allows us to create reusable UI components. It is currently one of the most popular JavaScript libraries and has a strong foundation and large community behind it.',
                img: 'react.png',
                isPopular: true,
                // categoryId: 1
            }, {
                title: 'React Native',
                slug: slugify('React Native'),
                description: 'React Native is a JavaScript framework for writing real, natively rendering mobile applications for iOS and Android. It’s based on React, Facebook’s JavaScript library for building user interfaces, but instead of targeting the browser, it targets mobile platforms.',
                img: 'react-native.png',
                isPopular: true,
                // categoryId: 2
            },
            {
                title: 'PHP',
                slug: slugify('PHP'),
                description: 'PHP is a server scripting language, and a powerful tool for making dynamic and interactive Web pages. PHP is a widely-used, free, and efficient alternative to competitors such as Microsoft’s ASP.',
                img: 'php.png',
                isPopular: false,
                // categoryId: 1
            },
            {
                title: 'Flutter',
                slug: slugify('Flutter'),
                description: 'Flutter is an open-source UI software development kit created by Google. It is used to develop applications for Android, iOS, Linux, Mac, Windows, Google Fuchsia, and the web from a single codebase.',
                img: 'flutter.png',
                isPopular: true,
                // categoryId: 2
            },
            {
                title: 'Swift',
                slug: slugify('Swift'),
                description: 'Shift is a powerful and intuitive programming language for macOS, iOS, watchOS, and tvOS. Writing Swift code is interactive and fun, the syntax is concise yet expressive, and Swift includes modern features developers love. Swift code is safe by design, yet also produces software that runs lightning-fast.',
                img: 'swift.png',
                isPopular: false,
                // categoryId: 2
            }, {
                title: 'Electron',
                slug: slugify('Electron'),
                description: 'Electron is an open-source framework developed and maintained by GitHub. Electron allows for the development of desktop GUI applications using web technologies: It combines the Chromium rendering engine and the Node.js runtime.',
                img: 'electron.png',
                isPopular: true,
                // categoryId: 3
            }
        ]);

        //many to many ilişkisi için
        await categories[0].addCourse(courses[0]); // 1. kategoriye ait 1. kurs
        await courses[0].addCategory(categories[1]); // 1. kursa ait 2. kategori
        await courses[0].addCategory(categories[2]); // 1. kursa ait 3. kategori
        await categories[0].createCourse({
            title: 'Vue',
            slug: slugify('Vue'),
            description: 'Vue.js is an open-source model–view–viewmodel front end JavaScript framework for building user interfaces and single-page applications.',
            img: 'vue.png',
            isPopular: true
        });
        await courses[1].addCategories([categories[0], categories[1], categories[2]]);
        await courses[2].addCategories([categories[0]]);
        await courses[3].addCategories([categories[1]]);
        await courses[4].addCategories([categories[0]]);
        await courses[5].addCategories([categories[1]]);
        await courses[6].addCategories([categories[1]]);
        await courses[7].addCategories([categories[2]]);
    }
}

module.exports = populate;
