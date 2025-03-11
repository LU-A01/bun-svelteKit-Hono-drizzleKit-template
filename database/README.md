# Database Layer

The database layer for this application uses Turso (LibSQL) with Drizzle ORM for schema definition and migrations.

## 🏗️ Architecture

This database implementation follows a schema-first approach with the following components:

- **Schema Definition**: TypeScript-based schema definitions using Drizzle ORM
- **Migrations**: Automated SQL migrations generated from schema changes
- **Client**: LibSQL client for connecting to Turso or SQLite databases

## 📁 Directory Structure

```txt
database/
├── schema/           # Database schema definitions
│   ├── index.ts      # Main schema export file
│   └── todos.ts      # Todo table schema
├── migrations/       # Generated SQL migration files
│   ├── meta/         # Metadata for migrations
│   └── *.sql         # SQL migration files
├── client.ts         # Database client setup
├── migrate.ts        # Migration execution script
├── drizzle.config.ts # Drizzle ORM configuration
└── README.md         # Documentation
```

## 🔍 Schema Definition

The application uses Drizzle ORM to define database tables in TypeScript. This provides type safety and seamless integration with the application code.

### Current Tables

#### Todos Table

```typescript
sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
})
```

## 🔄 Migrations

Migrations are handled automatically by Drizzle Kit, which generates SQL migration files based on schema changes.

### Generating Migrations

To generate new migrations after schema changes:

```bash
bun run drizzle-kit generate
```

This command:

1. Compares the current schema with the previous schema snapshot
2. Generates SQL migration files in the `migrations` directory
3. Updates the schema snapshot

### Running Migrations

To apply pending migrations to the database:

```bash
bun run migrate
```

This script:

1. Connects to the database using the configured URL and auth token from the project root's `.env` file
2. Applies all pending migration files in the correct order
3. Updates the migration metadata

## 🔌 Database Connection

The database layer uses the root directory's `.env` file to configure the connection settings. The database can be configured to connect to either a Turso cloud database or a local SQLite file.

### Environment Variables

The following environment variables are used:

```env
# Turso Cloud Database
DATABASE_URL=libsql://your-database-url
DATABASE_AUTH_TOKEN=your-auth-token
```

### Connection Configuration

The migration script in `migrate.ts` uses the following approach to configure the connection:

```typescript
// Load environment variables from the project root
dotenv.config({ path: resolve(__dirname, "../.env") });

// Get connection info from environment variables
let url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

// Detect database type
const isTurso = url && url.startsWith('libsql://');
const isSQLite = url && (url.startsWith('file:') || url.startsWith('sqlite:'));

// Create connection config
let connectionConfig: any = { url: url as string };

// Add auth token for Turso
if (isTurso && authToken) {
  connectionConfig.authToken = authToken;
}

// Create LibSQL client
const client = createClient(connectionConfig);
```

## 🛠️ Configuration

The database configuration is managed in `drizzle.config.ts`:

```typescript
export default defineConfig({
  schema: './schema',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
```

## 🔧 Development Setup

### Prerequisites

- Turso account and CLI for cloud database setup
- Bun runtime

### Initial Setup

1. The application uses the `.env` file in the project root with database connection details:

   ```.env
   DATABASE_URL=libsql://your-database-url
   DATABASE_AUTH_TOKEN=your-auth-token
   ```
2. Generate and apply initial migrations:

   ```bash
   bun run drizzle-kit generate
   bun run migrate
   ```

### Setting Up Turso Database

1. Install Turso CLI:

   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
2. Login to Turso:

   ```bash
   turso auth login
   ```
3. Create a database:

   ```bash
   turso db create my-app-db
   ```
4. Get the database URL and token:

   ```bash
   turso db show my-app-db --url
   turso db tokens create my-app-db
   ```
5. Update the `.env` file with the values.

## 🚨 Troubleshooting

### Common Issues

- **Connection Errors**: Verify the `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in your `.env` file.
- **Migration Failures**: Check that the migration files are properly generated and not corrupted.
- **Authentication Issues**: Ensure your Turso token has the correct permissions and hasn't expired.

### Verifying Connection

You can verify the database connection by:

1. Running the migrate script with debugging:

   ```bash
   bun run migrate
   ```
2. Checking the connection output to verify that:

   - The correct database URL is detected
   - Authentication token is properly configured
   - Connection test passes successfully

### Fallback to SQLite

If you're having issues with Turso, you can temporarily switch to a local SQLite database by updating the `.env` file:

```env
DATABASE_URL=file:./dev.db
# Comment out the DATABASE_AUTH_TOKEN
# DATABASE_AUTH_TOKEN=your-auth-token
```
