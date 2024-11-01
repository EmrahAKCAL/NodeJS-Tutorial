sequelize => SQL sorgularını model kullanılarak veritabanına sorgu yazmamızı sağlayan kütüphane.
uygulama ile veritabanı arasında bir köprü görevi görür.(ORM)
ORM => Object Relational Mapping

``` 
npm i sequilze
```

## Sequelize

```
const {DataTypes} = require('sequelize');
const sequelize = require('../data/db');
const { Op } = require("sequelize");

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,  // veri tipi
        primaryKey: true, //  benzersiz bir değer olmalı
        autoIncrement: true, // otomatik artan
        allowNull: false // boş geçilemez
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false // tabloya tarih alanı eklememek için
});

```

* Course.sync({force: true}); **tabloyu oluşturur(force: true => tabloyu her seferinde silip oluşturur, alter:true =>
  tabloyu günceller)**
* await Category.count();  **tablodaki kayıt sayısını döner**
* await Category.bulkCreate(categories); **çoklu kayıt ekleme**
* const categories = await Categories.findAll();  **tüm kayıtları döner**
* const courses = await Course.findAll({where: {isPopular: true}, raw: true}); **isPopular true olan kayıtları döner(raw:
  true => sadece verileri döner)**
* const courses await Course.findAll({ where: { isPopular: true, categoryId: req.query.categoryId}}); **isPopular true olan
  ve categoryId'si req.query.categoryId olan kayıtları döner**
* const courses = await Course.findAll({where: {[Op.and]: [{isPopular: true}, {categoryId: req.query.categoryId}]}}); *
  *isPopular true olan ve categoryId'si req.query.categoryId olan kayıtları döner**
* const courses = await Course.findAndCountAll({where: {isPopular: true}, raw: true, limit: 2, offset: 0}); **isPopular true
  olan kayıtların 2 tanesini döner(limit => kaç kayıt döneceğini belirler, offset => kaçıncı kayıttan başlayacağını
  belirler)**
* const category = await Categories.findByPk(1); **id'si 1 olan kaydı döner**
* const category = await Categories.findOne({where: {name: 'category1'}}); **name'i category1 olan kaydı döner**
* const category = await Categories.findOne({where: {name: 'category1'}, attributes: ['name']}); **name'i category1 olan
  kaydın sadece name alanını döner**
* const category = await Categories.findOne({where: {name: 'category1'}, attributes: {exclude: ['name']}}); **name'i
  category1 olan kaydın name alanını dışındaki tüm alanları döner**
* const category = await Categories.findOne({where: {name: 'category1'}, attributes: {include: ['name']}}); **name'i
  category1 olan kaydın name alanını döner**
* await Categories.create({name}); **yeni kayıt ekleme**
* await Categories.update({name}, {where: {id}}); **id'si 1 olan kaydın name alanını günceller**
* await Categories.destroy({where: {id}}); **id'si 1 olan kaydı siler**
* await Categories.destroy({truncate: true}); **tabloyu siler**
* await Categories.destroy({where: {id: {[Op.gt]: 1}}}); **id'si 1 den büyük olan kayıtları siler**
* await Categories.destroy({where: {id: {[Op.gt]: 1}, name: {[Op.like]: '%category%'}}}); **id'si 1 den büyük ve name'i
  category içeren kayıtları siler**
* await Categories.destroy({where: {id: {[Op.lt]: 10}}}); **id 10 dan küçük olan kayıtları döner**

*Many to Many ilişki*

```
const Movie = sequelize.define('Movie', { name: DataTypes.STRING });
const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
Movie.belongsToMany(Actor, { through: 'MovieActor' });
Actor.belongsToMany(Movie, { through: 'MovieActor' });
```

PostgreSQL karşılığı

```
CREATE TABLE IF NOT EXISTS "ActorMovie" (
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "MovieId" INTEGER REFERENCES "Movies" ("id") ON DELETE CASCADE ON UPDATE CASCADE, // MovieId Movies tablosundaki id alanına referans verir. DELETE CASCADE => Movies tablosundaki id silinirse ActorMovie tablosundaki ilgili kayıtları siler. UPDATE CASCADE => Movies tablosundaki id güncellenirse ActorMovie tablosundaki ilgili kayıtları günceller.
    "ActorId" INTEGER REFERENCES "Actors" (id) ON DELETE CASCADE ON UPDATE CASCADE, // ActorId Actors tablosundaki id alanına referans verir. DELETE CASCADE => Actors tablosundaki id silinirse ActorMovie tablosundaki ilgili kayıtları siler. UPDATE CASCADE => Actors tablosundaki id güncellenirse ActorMovie tablosundaki ilgili kayıtları günceller.
    PRIMARY KEY ("MovieId", "ActorId") // İki alanın birleşimi birincil anahtar oluşturur.
);
```

migration => veritabanı tablolarını oluşturmak için kullanılan bir kütüphane.

