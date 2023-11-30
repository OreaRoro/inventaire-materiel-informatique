const axios = require('axios');
const Materiel = require('../models/Materiel');

exports.CategoryIndex = (req, res) => {
    axios.get('http://localhost:8000/api/category')
        .then(async response => {
            const categories = response.data;
            let materiels = [];
            let qty = [];
            for (let i = 0; i < categories.length; i++) {
                let materiel = await Materiel.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "category",
                            foreignField: "_id",
                            as: "category_details"
                        }
                    },
                    {
                        $match: {
                            'category_details.title': categories[i].title
                        }
                    }
                ]);
                materiels.push(materiel)
            }
            materiels.forEach((item) => {
               qty.push(item);
            });

            res.render('category/category', {title: 'Category', categories: categories, quantity: qty});
        })
}