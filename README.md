# Vietnam Finance App

A comprehensive financial management solution tailored for Small and Medium-sized Enterprises (SMEs) operating in Vietnam.

## Features

- **User Management**: Role-based access control with predefined roles (Employee, Manager, Finance, Admin)
- **Expense Request Management**: Create, edit, and track expense requests with receipt attachments
- **Approval Workflows**: Configurable multi-level approval chains with auto-routing based on criteria
- **Invoice Processing**: Integration with Vietnam E-invoice system with data extraction and validation
- **Payment Process**: Manage payment requests and bank submissions
- **Notifications**: Multi-channel notification system (In-app, Email, Zalo)
- **Export**: Export data to accounting systems and for bank transfers

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with DaisyUI
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Google OAuth
- **File Storage**: Cloud storage for receipts and documents
- **API Layer**: RESTful API with Express.js
- **Deployment**: Docker containers

## Project Structure

```
vietnam-finance-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API and external service integrations
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── context/          # React context providers
│   ├── db/               # Database related code
│   │   ├── schema/       # Drizzle ORM schema definitions
│   │   └── migrations/   # Database migrations
│   ├── assets/           # Static assets
│   └── styles/           # Global styles
├── public/               # Public assets
└── ...                   # Configuration files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Firebase project (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vietnam-finance-app.git
   cd vietnam-finance-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vietnam_finance
   
   # Firebase configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. Generate and run database migrations:
   ```bash
   npm run generate
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses a comprehensive database schema that includes:

- Users and roles (RBAC)
- Departments and team hierarchy
- Expense categories and requests
- Approval workflows and steps
- Invoices and line items
- Suppliers
- Bank accounts and payment requests
- Notifications

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)

