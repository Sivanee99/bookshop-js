import express, { Express } from 'express';
import * as handlers from './handlers';
import bodyParser from 'body-parser';


const app: Express = express();
const port = 8080;

app.use(bodyParser.json());

app.post('/books/new', handlers.validate_createBook, handlers.createBook);
app.get('/books/price', handlers.validate, handlers.getPrice);

app.post('/customers/new', handlers.validate_createCustomer, handlers.createCustomer);
app.put('/customers/address', handlers.validate_updateCustAdd, handlers.updateCustomerAddress);
app.get('/customers/balance', handlers.validate_getCustBal, handlers.getCustomerBalance);


app.post('/orders/new', handlers.validationData, handlers.createOrder);
app.get('/orders/shipped', handlers.validationData, handlers.getShipmentStatus);
app.put('/orders/ship', handlers.validate_shipOrder, handlers.shipOrder);
app.get('/orders/status', handlers.validate_getOrderStatus, handlers.getOrderStatus);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});