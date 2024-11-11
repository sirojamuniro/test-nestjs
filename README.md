Getting Started
This project requires Node.js and npm (or yarn) to be installed. It is designed to work with Fastify, a high-performance alternative to Express, and includes features such as database interactions, rate limiting, validation, and more.

Installation
Clone the repository:

git clone <repository-url>
Navigate to the project directory:

cd nest-fastify
Install dependencies:

npm install
Copy the .env.example file to .env and configure it with your environment settings:

cp .env.example .env
Run database migrations using  DB_SYNC=true

nest start
Running nest (default port 3000)

API Documentation
This project uses Swagger for API documentation. Once the application is running, visit /api to view the interactive API documentation.

localhost:PORT/api (documentation and test swagger)

To customize the documentation, modify the Swagger options in the main application file (main.ts).

Project Structure
The project structure follows standard NestJS conventions:

src/
├── common/                # Shared utilities and classes
├── config/                # Application configuration
├── modules/               # Main feature modules
│   ├── customer/          # Customer module
│   │   ├── dto/           # Data Transfer Objects (DTOs) for customer
│   │   ├── entities/      # Database entities for customer
│   │   ├── customer.controller.ts  # Customer controller
│   │   └── customer.service.ts     # Customer service
│   ├── booking/           # Booking module
│   │   ├── dto/           # Data Transfer Objects (DTOs) for booking
│   │   ├── entities/      # Database entities for booking
│   │   ├── booking.controller.ts   # Booking controller
│   │   └── booking.service.ts      # Booking service
│   └── reservation/       # Reservation module
│       ├── dto/           # Data Transfer Objects (DTOs) for reservation
│       ├── entities/      # Database entities for reservation
│       ├── reservation.controller.ts # Reservation controller
│       └── reservation.service.ts    # Reservation service
├── main.ts                # Application entry point
└── app.module.ts          # Root application module
