const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);


// Static folders
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Sync Database & Start Server
// Sync Database & Start Server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    sequelize.sync()
        .then(() => {
            console.log('Database synced');
            app.listen(PORT, () => {
                console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error('Error syncing database:', err);
        });
}

module.exports = app;
