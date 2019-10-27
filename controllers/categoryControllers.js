const Category = require('../models/Category');
const checkAuth = require('../config/check-auth');

module.exports = function(app) {
  // All Categories
  app.get('/api/v1/categories', checkAuth, (req, res, next) => {
    const { userUuid } = req.userData;

    Category.findAll({
      where: { userUuid },
      attributes: { exclude: ['userUuid'] },
    })
      .then(categories => {
        res.status(200).json({
          statusCode: 200,
          message: 'successful',
          data: categories,
        });
      })
      .catch(err => {
        res.status(200).json({
          error: {
            statusCode: 500,
            message: 'Internal Server Error'
          }
        });
      });
  })

  // Create Category
  app.post('/api/v1/categories', checkAuth, (req, res, next) => {
    const { userUuid } = req.userData;
    const { category_name } = req.body;

    const newCategory = Category.build({
      category_name,
      userUuid
    });

    console.log(newCategory);

    newCategory.save()
      .then(category => {
        res.status(200).json({
          statusCode: 200,
          message: 'successful',
          data: {
            category: category,
          },
        });
      })
      .catch(err => {
        res.status(409).json({
          statusCode: 409,
          ...err
        });
      });
  })
};
