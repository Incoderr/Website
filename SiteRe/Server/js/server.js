const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Подключение к MongoDB
mongoose.connect("mongodb://localhost:27017/myapp", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Модель пользователя
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://i.imgur.com/hepj9ZS.png" }
});

const User = mongoose.model("User", UserSchema);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Для обслуживания статических файлов

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Папка, куда будем сохранять аватары
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Создаем уникальное имя для файла
  },
});

const upload = multer({ storage: storage });

// Маршрут регистрации
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed", details: error.message });
  }
});

// Маршрут авторизации
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// Получение данных профиля
app.get("/api/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Маршрут для загрузки аватара
app.post("/api/upload-avatar", upload.single("avatar"), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(decoded.id, { avatar: avatarUrl }, { new: true });

    res.json({ avatar: avatarUrl });
  } catch (error) {
    res.status(500).json({ error: "Error uploading avatar", details: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
