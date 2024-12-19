# ![favicon](dist/favicon-32x32.png) Auto Chess

PROJECT - Web Application Development (INT3306 8) - UET <br>
Auto Chess is an online chess web application where users can create rooms, join games, and compete with friends or random opponents. The application is built with a user-friendly interface and smooth gameplay experience.
- FE: [auto-chess-fe](https://github.com/quangcaa/auto-chess-fe-2)
  
---

## 🚀 **Main Features**

- 🔥 **Online Chess**: Players can create or join game rooms.
- ⚡ **Quick Pairing**: Instantly find and match with an available opponent based on your skill level and preferences.
- 🧩 **Random Puzzle**: Players can play a randomly selected chess puzzle to test and improve their skills.
- 📥 **Inbox**: A messaging feature where players can send and receive messages, or discuss game strategies.
- ⚡ **Real-time**: Uses Socket.IO to ensure all actions are instantly synchronized between players.
- 🗨️ **Forum**: A dedicated space where players can discuss chess strategies, and connect with the community.
- 📜 **History Saving**: Saves match history and moves for players to review.
- 🎨 **Beautiful Interface**: User-friendly interface optimized for both desktop and mobile.
- ⚠️ **Report System**: Players can report inappropriate behavior, suspicious activities. All reports are reviewed to maintain a fair and respectful community.

---

## 🛠️ **Technologies Used**

- **Frontend**: Vite, React.js, JavaScript

  - **react-chessboard**: Chessboard component.
  - **chess.js**: Chess logic.
  - **Tailwind CSS**: Writing CSS.
  - **Shadcn**: Component.
  - **Zustand**: State Management.
  - **Zod**: Validation.
  - **Axios**: API Calls.

- **Backend**: Node.js, Express.js, `chess.js`.
- **Realtime Communication**: Socket.IO.
- **Database**: MySQL (Sequelize ORM).
- **Authentication**: JWT.

---

## 📥 **Installation and Running the Project**

### **1. Requirements**

- Node.js v16+ and npm.
- MySQL.

### **2. Clone the Project**

```bash
git clone https://github.com/quangcaa/auto-chess-be.git
cd auto-chess-be
```

### **3. Set Up Environment Variables**

Create a .env file and update the necessary environment variables. Example:

```
PORT=9999
NODE_ENV=development

ACCESS_TOKEN_LIFE=8m
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_LIFE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

MYSQL_DB_USER=root
MYSQL_DB_PASSWORD=your_password
MYSQL_DB_DATABASE=autochess
MYSQL_DB_HOST=localhost
MYSQL_DB_PORT=3306

MAILTRAP_TOKEN=your_mailtrap_token
```

### **4. Install Dependencies**

```bash
npm install
```

### **5. Run Sequelize Migrations and Seeders**

Run the following commands to set up the database schema and seed initial data:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### **6. Start the Server**

```bash
npm start
```

---

## 🤝 **Contributors**

- [@quangcaa](https://github.com/quangcaa)
- [@22026541-dxtruong](https://github.com/22026541-dxtruong)
- [@ductantb](https://github.com/ductantb)
- [@QuangVu04](https://github.com/QuangVu04)
- [@AnNgoexe](https://github.com/AnNgoexe)
