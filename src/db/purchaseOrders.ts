import { chargeCustomerForPO } from "./customers";
import { connect } from "./db";

import { PID } from "./customers";
import { type } from "os";

export type Order = {
  bid: number;
  cid: number;
};

export type Purchase = {
  price: number;
  cid: number;
  pid: number;
};

export const createPurchaseOrder = async (
  purchaseOrder: Order
): Promise<PID> => {
  const db = await connect();
  await db.run(
    `INSERT INTO PurchaseOrders (bookId, customerId, shipped, paid) VALUES (?, ?, ?, ?)`,
    [purchaseOrder.bid, purchaseOrder.cid, 0, 0]
  );
  return getPOIdByContents({ bid: purchaseOrder.bid, cid: purchaseOrder.cid });
};

export const getPOIdByContents = async (poid: Order): Promise<PID> => {
  const db = await connect();
  const result = await db.get(
    `SELECT id FROM PurchaseOrders WHERE bookId = ? AND customerId = ?`,
    [poid.bid, poid.cid]
  );
  return result.id;
};

export const isPoShipped = async (pid: PID): Promise<boolean> => {
  const db = await connect();
  const result = await db.get(
    `SELECT shipped FROM PurchaseOrders WHERE id = ?`,
    [pid]
  );
  return result.shipped === 1;
};

export const isPoPaid = async (pid: PID): Promise<boolean> => {
  const db = await connect();
  const result = await db.get(`SELECT paid FROM PurchaseOrders WHERE id = ?`, [
    pid,
  ]);
  return result.paid === 1;
};

export const shipPo = async (pid: PID): Promise<void> => {
  const db = await connect();
  await db.run(`UPDATE PurchaseOrders SET shipped = 1 WHERE id = ?`, [pid]);
};

export const checkout = async (purchase: Purchase): Promise<void> => {
  const db = await connect();
  await chargeCustomerForPO({ price: purchase.price, cid: purchase.cid });
  await db.run(`UPDATE PurchaseOrders SET paid = 1 WHERE id = ?`, [
    purchase.pid,
  ]);
};
