# E-Commerce & Logistics Backend REST API

A REST API built with TypeScript, Express, and the `node-postgres` (`pg`) driver,
backed by PostgreSQL. All database access uses raw parameterized SQL — no ORM or
query builder.

## Requirements

- Node.js
- PostgreSQL

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create the database**

Create a PostgreSQL database, then run the setup script to create and populate
the six tables:

```bash
psql -U postgres -d postgres -f schema.sql
```

**3. Create a `.env` file** in the project root:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/postgres
PORT=3000
```

**4. Start the server**

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

## API Endpoints

All routes are prefixed with `/api/v1`.

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List all customers |
| GET | `/customers/:id` | Get one customer |
| POST | `/customers` | Create a customer |
| PUT | `/customers/:id` | Update city / membership level |
| DELETE | `/customers/:id` | Delete a customer |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (optional `?category=`) |
| GET | `/products/:id` | Get one product |
| POST | `/products` | Create a product |
| PATCH | `/products/:id/price` | Update a product's price |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List all orders |
| GET | `/orders/customer/:customerId` | Orders for one customer |
| POST | `/orders` | Create an order |
| DELETE | `/orders/:id` | Delete an order |

### Order Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/order-items/:orderId` | Line items for an order |
| POST | `/order-items` | Add a line item |

### Vendors & Supplies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendors` | List all vendors |
| GET | `/supplies/vendor/:vendorId` | Stock entries for a vendor |
| PUT | `/supplies/:vendorId/:productId` | Update stock quantity |

## Testing with Thunder Client

Thunder Client is a VS Code extension for sending HTTP requests. Install it from
the Extensions panel, then click the lightning bolt icon in the sidebar.

Make sure the server is running (`npm run dev`) before sending anything.

### Sending a GET request

1. Click **New Request**
2. Leave the method dropdown on **GET**
3. Paste the URL — the URL only, without the method name:

```
http://localhost:3000/api/v1/vendors
```

4. Click **Send**

The status code and JSON response appear in the right-hand pane.

### Sending a POST or PUT request

1. Click **New Request**
2. Change the method dropdown to **POST** or **PUT**
3. Paste the URL:

```
http://localhost:3000/api/v1/order-items
```

4. Click the **Body** tab and select **JSON**
5. Type the request body:

```json
{
  "order_id": "O502",
  "product_id": "P002",
  "quantity": 2,
  "discount": 0.1
}
```

6. Click **Send**

Thunder Client sets the `Content-Type: application/json` header automatically
when the body format is set to JSON.

### Example requests

| Method | URL | Body | Expected |
|--------|-----|------|----------|
| GET | `/api/v1/customers` | — | 200, 5 customers |
| GET | `/api/v1/customers/C101` | — | 200, Alice Johnson |
| GET | `/api/v1/customers/C999` | — | 404 |
| GET | `/api/v1/vendors` | — | 200, 4 vendors |
| GET | `/api/v1/order-items/O500` | — | 200, 2 line items |
| GET | `/api/v1/supplies/vendor/V101` | — | 200, 3 stock rows |
| POST | `/api/v1/order-items` | see above | 201 |
| PUT | `/api/v1/supplies/V101/P001` | `{"stock_quantity": 450}` | 200 |
| PUT | `/api/v1/supplies/V999/P001` | `{"stock_quantity": 450}` | 404 |

Prefix every URL with `http://localhost:3000`.

### Troubleshooting

| Problem | Cause |
|---------|-------|
| `Invalid URL` | The method name was pasted into the URL field. Use the URL only |
| `ECONNREFUSED` | The server is not running. Run `npm run dev` |
| `500 Internal server error` | Database connection failed. Check `.env`, then restart the server |
| `400` on a valid POST | The Body tab is not set to **JSON** |

Environment variables are read once at startup, so restart the server after any
change to `.env`.

## Notes

- All queries use parameterized values (`$1`, `$2`, ...). No string interpolation
  is used in SQL.
- No multi-table JOINs are used. Related data is fetched with sequential
  single-table queries.
- `NUMERIC` columns such as `quantity`, `discount`, `unit_price`, and
  `stock_quantity` are returned as strings by `pg` to preserve precision.
