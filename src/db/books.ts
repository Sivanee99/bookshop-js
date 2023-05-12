import { connect } from "./db";

export type Book = {
  title: string;
  author: string;
  price: number;
};

export type Book1 = {
  title: string;
  author: string;
};
export type BookID = number;
export type BookPrice = number;

export const createBook = async (book: Book): Promise<BookID> => {
  const db = await connect();
  await db.run(`INSERT INTO Books (title, author, price) VALUES (?, ?, ?)`, [
    book.title,
    book.author,
    book.price,
  ]);
  return getBookId({ title: book.title, author: book.author });
};

export const getBookId = async (book1: Book1): Promise<BookID> => {
  const db = await connect();
  const result = await db.get(
    `SELECT id FROM Books WHERE title = ? AND author = ?`,
    [book1.title, book1.author]
  );
  return result.id;
};

export const getBookPrice = async (bid: BookID): Promise<BookPrice> => {
  const db = await connect();
  const result = await db.get(`SELECT price FROM Books WHERE id = ?`, [bid]);
  return result.price;
};
