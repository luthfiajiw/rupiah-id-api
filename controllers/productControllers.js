const Sequelize = require('sequelize');

const Product = require('../models/Product');
const Category = require('../models/Category');
const checkAuth = require('../config/check-auth');

module.exports = function (app) {
  // All Products
  app.get('/api/v1/products', checkAuth, (req, res, next) => {
    const { userUuid } = req.userData;

    Product.findAll({
      where: {userUuid},
      attributes: { exclude: ['userUuid', 'categoryUuid']},
      include: [{
        model: Category,
        as: 'category',
        attributes: ['uuid', 'category_name'],
      }]
    })
      .then(products => {
        res.status(200).json({
          statusCode: 200,
          message: 'successful',
          data: products,
        });
      })
      .catch(err => {
        res.status(500).json({
          error: {
            statusCode: 500,
            message: 'Internal Server Error',
          },
        });
      });
  });

  // Detail Product
  app.get('/api/v1/product/:productUuid', checkAuth, (req, res, next) => {
    const { productUuid } = req.params;

    Product.findByPk(productUuid)
      .then(product => {
        if (product === null) {
          res.status(404).json({
            error: {
              statusCode: 404,
              message: 'Product not found'
            },
          });
        }

        res.status(200).json({
          statusCode: 200,
          message: 'successful',
          data: product
        });
      })
      .catch(err => {
        res.status(404).json({
          error: {
            statusCode: 404,
            message: 'Product not found'
          }
        });
      });
  })

  // Create Product
  app.post('/api/v1/products', checkAuth, (req, res, next) => {
    const { userUuid } = req.userData;
    const {
      product_name, refcode, base_price, price,
      categoryUuid, stock
    } = req.body;

    const newProduct = Product.build({
      product_name,
      refcode: refcode.replace(/\s/g, ""), // remove all spaces
      base_price,
      price,
      stock,
      current_stock: stock,
      userUuid,
      categoryUuid,
    });

    newProduct.save()
      .then(product => {
        res.status(200).json({
          statusCode: 200,
          message: 'Product created.',
          data: product,
        });
      })
      .catch(err => {
        res.status(500).json({
          error: {
            statusCode: 500,
            message: 'Internal Server Error'
          },
        });
      });
  });

  // Patch Product
  app.patch('/api/v1/product/:productUuid', checkAuth, (req, res, next) => {
    const { productUuid } = req.params;
    const {
      product_name, refcode, base_price, price,
      categoryUuid, stock
    } = req.body;

    const updatedProduct = {
      product_name,
      refcode: refcode.replace(/\s/g, ""), // remove all spaces
      base_price,
      price,
      stock,
      current_stock: stock,
      categoryUuid,
    }

    Product.update(updatedProduct, { where: { uuid: productUuid } })
      .then(() => {
        res.status(200).json({
          statusCode: 200,
          message: 'Product updated.'
        });
      })
      .catch(err => {
        res.status(500).json({
          statusCode: 500,
          message: 'Internal Server Error',
        });
      });
  });
};
