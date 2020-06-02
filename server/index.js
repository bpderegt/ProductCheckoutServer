const newrelic = require('newrelic');

/* eslint-disable no-console */
const express = require('express');

const { getProductData,
  getStoreData,
  postProductData,
  putProductData,
  deleteProductData,
} = require('./model.js');

const app = express();
const PORT = 8673;

app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
// app.use((req, res, next) => {
//   console.log(`Incoming ${req.method} request to ${req.path}`);
//   next();
// });

app.get('/products/:id', (req, res) => {
  if (req.params.id < 1 || req.params.id > 10000000) {
    console.log('invalid product id')
    res.status(404).send('Oops! Not a valid productId');
  }
  getProductData(req.params.id, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/products/:id/stores/:zip', (req, res) => {
  getStoresData(req.params.id, req.params.zip , (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (!results.length) {
      res.status(404).send('Store not found');
    } else {
      res.status(200).send(results);
    }
  });
});

// app.post('/products', (req, res) => {
//   // console.log(req.query)
//   postProductData(req.query, (err, succ) => {
//     if (err) {
//       res.status(400).send('could not post query')
//     } else {
//       res.status(201).end()
//     }
//   })
// });

// app.put('/products/:id', (req, res) => {
//   putProductData(req.query, req.params.id, (err, succ) => {
//     if (err) {
//       res.status(400).send('could not update entry')
//     } else {
//       res.status(204).send(succ)
//     }
//   })
// });

// app.delete('products/:id', (req, res) => {
//   deleteProductData(req.params.id, (err, succ) => {
//     if (err) {
//       res.status(400).send('could not delete')
//     } else {
//       res.status(200).send(succ);
//     }
//   })
// });

// app.get('/LEGACY/product/:id/find-store/', (req, res) => {
//   getLEGACYStores(req.params.id, req.query.q, (err, results) => {
//     if (err) {
//       res.status(500).send(err);
//     } else if (!results.length) {
//       res.status(404).send('Store not found');
//     } else {
//       res.status(200).send(results);
//     }
//   });
// });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = app;
