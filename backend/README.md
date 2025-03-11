# Backend API Service

This backend service is built using Hono.js, implementing a Clean Architecture approach for a maintainable and testable codebase.

## 🏗️ Architecture

The backend implements a simplified Clean Architecture with the following layers:

- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and business rules
- **Infrastructure Layer**: External concerns like database access
- **Presentation Layer**: HTTP request handling and response formatting

## 📁 Directory Structure

```txt
src/
├── domain/         # Domain entities, repository interfaces, use case interfaces
│   └── todo/       # Todo domain with entity, repository and usecase interfaces
├── application/    # Use cases implementation, business logic
│   └── services/   # Services implementing use case interfaces
├── infrastructure/ # External adapters, database access
│   ├── db/         # Database connection and schemas
│   └── repositories/ # Repository implementations
└── presentation/   # Controllers and routes
    ├── controllers/ # Request handlers
    └── routes/      # API route definitions
```

## 🔍 Layer Responsibilities

### Domain Layer

- Defines core business entities (e.g., `Todo`)
- Contains repository interfaces that define data access contracts
- Contains use case interfaces that define business operations
- Has no dependencies on other layers

### Application Layer

- Implements use cases defined in the domain layer
- Contains business logic
- Depends only on the domain layer

### Infrastructure Layer

- Implements repository interfaces from the domain layer
- Manages database connections and interactions
- Contains database schemas and query logic
- Depends on the domain layer

### Presentation Layer

- Handles HTTP requests and formats responses
- Contains controllers that use application layer services
- Provides API routes and validation
- Depends on the application layer and domain layer

## 🔌 API Endpoints

### Todo API

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo by ID
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## 🛠️ Technologies

- **Runtime**: Bun
- **Framework**: Hono.js
- **Database**: Turso (LibSQL)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Linting**: Biome

## 📊 Database Implementation

### Connection Setup

The database connection is configured in `src/infrastructure/db/client.ts`:

```typescript
// Load environment variables from the project root
const envPath = resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath });

// Initialize the database connection
let client;
let db: LibSQLDatabase<typeof schema>;

try {
  // Get connection info from environment variables
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  
  // Create connection config
  let connectionConfig: any = { url };
  
  // Add auth token for Turso
  if (url.startsWith('libsql://') && authToken) {
    connectionConfig.authToken = authToken;
  }
  
  // Create LibSQL client
  client = createClient(connectionConfig);
  
  // Create Drizzle ORM instance
  db = drizzle(client, { schema });
} catch (error) {
  console.error("Database connection error:", error);
}
```

### Repository Pattern Implementation

The application implements the Repository pattern for data access. Two repository implementations are provided:

1. **TodoTursoRepository**: Uses Turso/LibSQL database for persistent storage
2. **TodoMemoryRepository**: Uses in-memory storage as a fallback

The service layer intelligently chooses the appropriate repository:

```typescript
constructor() {
  // Try to use Turso repository first
  try {
    this.todoRepository = new TodoTursoRepository();
    console.log("Using TodoTursoRepository");
  } catch (error) {
    // Fall back to memory repository if Turso is unavailable
    console.error("Failed to initialize Turso repository. Falling back to memory repository:", error);
    try {
      this.todoRepository = new TodoMemoryRepository();
      console.log("Using TodoMemoryRepository (fallback)");
    } catch (fallbackError) {
      console.error("Failed to initialize memory repository:", fallbackError);
      throw fallbackError;
    }
  }
}
```

This implementation provides resilience - if the database is temporarily unavailable, the application can still function using in-memory storage.

## 🚀 Development

### Prerequisites

- Bun v1.0.0+
- Turso database or SQLite

### Setup

1. Install dependencies:

    ```bash
    bun install
    ```

2. The application uses the `.env` file in the project root directory with the following variables:

    ```.env
    PORT=3000
    FRONTEND_URL=http://localhost:5173
    DATABASE_URL=libsql://your-database-url
    DATABASE_AUTH_TOKEN=your-database-token
    ```

3. Run development server:

    ```bash
    bun run dev
    ```

### API Testing with PowerShell

You can test the API using PowerShell commands:

```powershell
# Get all todos
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/todos"

# Create a todo
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/todos" -ContentType "application/json" -Body '{"title":"New task"}'

# Update a todo
Invoke-RestMethod -Method PUT -Uri "http://localhost:3000/api/todos/{id}" -ContentType "application/json" -Body '{"completed":true}'

# Delete a todo
Invoke-RestMethod -Method DELETE -Uri "http://localhost:3000/api/todos/{id}"
```

## 🧪 Testing

Run tests:

```bash
bun test
```

Watch mode:

```bash
bun test:watch
```

## 🏭 Design Principles

- **Dependency Inversion**: Dependencies point inward, with outer layers depending on inner layers
- **Single Responsibility**: Each class has a single reason to change
- **Interface Segregation**: Clients depend only on the interfaces they use
- **Dependency Injection**: Dependencies are provided from outside (currently manual, future improvement)
- **Error Handling**: Consistent error handling with appropriate HTTP status codes
- **Validation**: Input validation using Zod schemas
- **Fallback Mechanisms**: The application implements fallback mechanisms for critical services
