// api.js
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors'; 
import path from 'path';
import mongoose from 'mongoose';
// import __dirname from './__dirname.js';

import categoriesSchema from './schemasMongoose/categoriesSchema.js';
import productsSchema from './schemasMongoose/productsSchema.js';
import characteristicsSchema from './schemasMongoose/characteristicsSchema.js';

import { pagination } from './helpers/pagination.js';
import { getAmountPages } from './helpers/helpers.js';

function connect() {
  mongoose.connect('mongodb+srv://awastzero:awastzero@cluster0.mooavpb.mongodb.net/?retryWrites=true&w=majority');
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Ошибка соединения'));
  db.once('open', () => console.log('Connection is successful'));
  return mongoose;
}

const mongooseInstance = connect();
const app = express();
const router = express.Router();

app.use(cors({
  origin: ['https://lordlzero.github.io/kaspi-frontend/', 'https://lordlzero.github.io/kaspi/'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Max-Age': '2592000', // 30 days
        'Access-Control-Allow-Headers': '*',
      };
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const CategoriesModel = mongoose.model('Categories', categoriesSchema)
const ProductsModel = mongoose.model('Products', productsSchema)
const CharacteristicsModel = mongoose.model('Characteristics', characteristicsSchema)

// router.get('/', async function(req, res) {
 
//      const response = await CategoriesModel.find({})
//         .exec()
//         .then(result => res.json(result))
//         .catch(err => console.error('Error:', err))
  
// });
router.get('/', async function(req, res) {
        // Добавляем заголовки CORS
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
        res.header('Access-Control-Max-Age', '2592000'); // 30 days
        res.header('Access-Control-Allow-Headers', '*');
    
        try {
            // Ваш код для получения данных
            const result = await CategoriesModel.find({}).exec();
            
            // Отправляем ответ с данными
            res.json(result);
        } catch (err) {
            console.error('Error:', err);
            // Отправляем ошибку, если что-то пошло не так
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
router.get('/get/products/', async function(req, res) {
  try {   
          let currentPageNumber = parseInt(req.query.page)
          const object = {}
          const limit = 9;
          let skipAmount = 0
    
          if (currentPageNumber > 1) {
                  skipAmount = (currentPageNumber-1)*limit
          }
          
          if (req.query.id) {
                  object.category_id = req.query.id
                  console.log(object);
          }
          if (req.query.minPrice) {
                  object.price = {$gte: parseInt(req.query.minPrice)};
                  console.log(object, '===============');
                }
          if (req.query.maxPrice) {
                  
                  if (!object.price) {
                  object.price = {};
                  }
                  object.price.$lte = parseInt(req.query.maxPrice);
          }
                
          const result = await ProductsModel.find(object)
                  .select('_id name price photo')
                  .limit(limit)
                  .skip(skipAmount)
                  .lean()
                  .exec();

          const amountPages = await getAmountPages(ProductsModel, object, limit)
          const paginationPageNumbers = pagination(currentPageNumber, amountPages)

          const updatedResults = result.map(product => {
                  return {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        photo: `/assets/img/products/${product.photo[0]}`,
                        path: __dirname
                };
          });
          
          const formattedJson = JSON.stringify({
                  products: updatedResults,
                  paginationPageNumbers: paginationPageNumbers,
                  amountPaginationPages: amountPages,
                }, null, 1);
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
                res.header('Access-Control-Max-Age', '2592000'); // 30 days
                res.header('Access-Control-Allow-Headers', '*');
                res.set('Content-Type', 'application/json');
                res.send(formattedJson);
  } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error'});
  }
});

 
router.get('/get/product/details/', async function(req, res) {
        try {
                const _id = req.query.id
                const productDetails = await ProductsModel.findOne({ _id: _id })
                .select('name price photo characteristics category_id description')
                .lean()
                .exec();
                
        
                for (const elem of productDetails.characteristics) {
        
                        const itemId = Object.keys(elem)[0]
                        const item = await CharacteristicsModel.findOne({_id: itemId})
                                .lean()
                                .exec();
                        elem.name = item.name
                        elem.specifitacions = Object.values(elem)[0]
                        delete elem[itemId]
                }
               
                if (productDetails) {
                              
                      const formattedJson = JSON.stringify({
                        ...productDetails,
                        photo: productDetails.photo.map(photo => '/assets/img/products/' + photo),
                        category_id: productDetails.category_id, 
                      }, null, 1);
                    res.header('Access-Control-Allow-Origin', '*');
                    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
                    res.header('Access-Control-Max-Age', '2592000'); // 30 days
                    res.header('Access-Control-Allow-Headers', '*');
                    res.set('Content-Type', 'application/json');
                    res.send(formattedJson);
        
                } else {
                        res.status(404).json({ error: 'Product not found' });
                }
    
        } catch (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
        

app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
