import { getCustomerBalance } from "../handlers";
import { connect } from "./db";

export type Customer = {
  name: string;
  address: string;
};

export type updateCustomer = {
  cid: number;
  address: string;
};

export type Charge = {
  cid: CustID;
  price: number;
};

export type CustID = number;
export type PID = number;

export const createCustomer = async (customer: Customer): Promise<CustID> => {
  const db = await connect();
  await db.run(`INSERT INTO Customers (name, shippingAddress) VALUES (?, ?)`, [
    customer.name,
    customer.address,
  ]);
  return getCustomerId({ name: customer.name, address: customer.address });
};

export const getCustomerId = async (customer: Customer): Promise<CustID> => {
  const db = await connect();
  const result = await db.get(
    `SELECT id FROM Customers WHERE name = ? AND shippingAddress = ?`,
    [customer.name, customer.address]
  );
  return result.id;
};

export const getCustomerAddress = async (cid: CustID): Promise<string> => {
  const db = await connect();
  const result = await db.get(
    `SELECT shippingAddress FROM Customers WHERE id = ?`,
    [cid]
  );
  return result.shippingAddress;
};

export const updateCustomerAddress = async (
  updatecust: updateCustomer
): Promise<void> => {
  const db = await connect();
  await db.run(`UPDATE Customers SET shippingAddress = ? WHERE id = ?`, [
    updatecust.address,
    updatecust.cid,
  ]);
};

export const customerBalance = async (cid: CustID): Promise<number> => {
  const db = await connect();
  const result = await db.get(
    `SELECT accountBalance FROM Customers WHERE id = ?`,
    [cid]
  );
  return result.accountBalance;
};

export const chargeCustomerForPO = async (charge: Charge) => {
  const db = await connect();
  const balance = await customerBalance(charge.cid);
  const newBalance = balance - charge.price;
  await db.run(`UPDATE Customers SET accountBalance = ? WHERE id = ?`, [
    newBalance,
    charge.cid,
  ]);
  // todo
  return;
};

export const isEnoughBalance = async (charge: Charge): Promise<boolean> => {
  const balance = await customerBalance(charge.cid);
  return balance >= charge.price;
};
