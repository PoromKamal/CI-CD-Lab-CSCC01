const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const productTable = `CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

class ProductDB {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.NODE_ENV === "production" ? process.env.DB_HOST : process.env.DB_HOST_DEV,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on("error", (err, client) => {
    });

    this.pool.on("connect", (client) => {
      client.on("error", (err) => {
        this.#connectWithRetry();
      });
    });

    this.status = false;
    this.#setup();
  }

  async #connectWithRetry(retryInterval = 5000) {
    try {
      await this.pool.connect();
      console.log("Database connected");
      this.status = true;
      await this.#createTable();
    } catch (err) {
      console.log("Database connection error:", err.message);
      this.status = false;
      setTimeout(() => {
        console.log("Retrying database connection...");
        this.#connectWithRetry(retryInterval);
      }, retryInterval);
    }
  }

  async #setup(){
    await this.#connectWithRetry();
  }

  async close() {
    await this.pool.end();
    this.status = false;
    console.log("Database connection closed");
  }

  async #createTable(){
    const client = await this.pool.connect();
    try{
      await client.query(productTable);
    } catch {
      console.log("Error creating table");
    } finally {
      client.release();
    }
  }

  async addProduct(name, description, price){
    const client = await this.pool.connect();
    try{
      const result = await client.query("INSERT INTO products (name, description, price) VALUES ($1, $2, $3)", [name, description, price]);
      return result.rows[0];
    } catch {
      return null;
    } finally {
      client.release();
    }
  }

  async deleteProduct(id){
    const client = await this.pool.connect();
    try{
      const result = await client.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
      return result.rows[0];
    } catch {
      return null;
    } finally {
      client.release();
    }
  }

  async getProducts(){
    const client = await this.pool.connect();
    try{
      const result = await client.query("SELECT * FROM products");
      if(result.rows.length === 0){
        return [];
      }
      for(let i = 0; i < result.rows.length; i++){
        result.rows[i].price = parseFloat(result.rows[i].price);
      }
      return result.rows;
    } catch {
      return [];
    } finally {
      client.release();
    }
  }
}

const productDB = new ProductDB();
module.exports = productDB;