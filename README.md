```markdown
# Group Savings App

A web application that allows users to create savings groups, contribute money, track savings, and withdraw funds. This platform helps friends, family, or colleagues pool funds together for shared financial goals.

## 🌟 Features

### User Authentication
- Sign up, log in, and log out functionality
- User profile management

### Group Management
- Create savings groups with name, description, target amount, and members
- Join and leave groups
- View all groups you belong to

### Contribution System
- Contribute money to your savings groups
- Track contributions with timestamps
- View savings progress (amount saved vs. target amount)

### Withdrawal Requests
- Request to withdraw money (requires admin approval)
- Approved withdrawals update the total savings amount

### Transaction History
- Detailed transaction history for each group
- Track all deposits and withdrawals


## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Formik & Yup for form handling and validation
- Chakra UI for styling components

### Backend
- Python Flask
- JWT-based authentication
- SQLAlchemy ORM

### Database
- PostgreSQL for storing users, groups, and transactions

## 📁 Project Structure

```
group-savings-app/
├── frontend/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Main application pages
│       ├── contexts/       # React contexts for state management
│       ├── services/       # API service functions
│       ├── utils/          # Helper functions
│       └── assets/         # Images, icons, etc.
├── backend/                # Flask backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── migrations/         # Database migrations
│   └── tests/              # Backend tests
└── docs/                   # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Git

### Backend Setup

1. Create and activate virtual environment
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following content:
```
FLASK_APP=run.py
FLASK_ENV=development
DATABASE_URI=postgresql://username:password@localhost/group_savings_db
JWT_SECRET_KEY=your_secret_key_here
```

4. Set up the database:
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE group_savings_db;
\q

# Run migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

5. Start the backend server:
```bash
flask run
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application should now be running with the frontend on http://localhost:5173 and backend on http://localhost:5000.

## 🔄 How It Works

### Authentication Flow
1. User enters credentials in the login page
2. Frontend sends request to `/api/auth/login` endpoint
3. Backend validates credentials and generates a JWT token
4. Frontend stores the token and uses it for subsequent requests

### Group Creation Flow
1. User fills out the group creation form
2. Request is sent to `/api/groups` endpoint
3. Backend creates the group and updates the database
4. Frontend displays the new group in the user's dashboard

### Transaction Flow
1. User submits a contribution via the contribution form
2. Request is sent to `/api/transactions` endpoint
3. Backend processes the transaction and updates the database
4. Frontend displays the new transaction and updated savings progress

### Withdrawal Flow
1. User requests a withdrawal
2. Group admin receives notification
3. Admin approves or rejects the request
4. If approved, the group's balance is updated

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Groups
- `GET /api/groups` - List all groups user belongs to
- `POST /api/groups` - Create a new group
- `GET /api/groups/<id>` - Get group details
- `PUT /api/groups/<id>` - Update group
- `DELETE /api/groups/<id>` - Delete group
- `POST /api/groups/<id>/join` - Join a group
- `POST /api/groups/<id>/leave` - Leave a group

### Transactions
- `GET /api/groups/<id>/transactions` - Get transactions for a group
- `POST /api/transactions` - Create a transaction (contribution)
- `POST /api/withdrawals` - Request a withdrawal
- `PUT /api/withdrawals/<id>` - Approve/reject withdrawal

## 🗄️ Database Schema

### Users Table
- id (primary key)
- username
- email
- password_hash
- created_at

### Groups Table
- id (primary key)
- name
- description
- target_amount
- current_amount
- created_by (foreign key to Users)
- created_at

### Memberships Table
- id (primary key)
- user_id (foreign key to Users)
- group_id (foreign key to Groups)
- is_admin (boolean)
- joined_at

### Transactions Table
- id (primary key)
- user_id (foreign key to Users)
- group_id (foreign key to Groups)
- amount
- type (deposit/withdrawal)
- status (pending/approved/rejected)
- created_at

## 🔒 Security Considerations

- Passwords are hashed before being stored in the database
- JWT tokens are used for secure authentication
- API endpoints are protected with proper authorization
- Input validation is performed on all user inputs


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature/amazing-feature)
5. Open a Pull Request
