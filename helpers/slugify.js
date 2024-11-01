const slugify = require('slugify');
const options = {
    replacement: '-',// karakterler arasına ne koyacağımızı belirler
    remove: undefined, //  kaldırılacak karakterleri belirler
    lower: true, // küçük harfe çevirir
    strict: true, // yalnızca url için geçerli karakterleri kullanır
    locale: 'tr', // dil seçeneği
    trim: true // boşlukları kaldırır
};

module.exports = (value) => {
    return slugify(value, options);
}
