const express = require('express');
const path = require('path');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { upload, handleUploadError, deleteFile } = require('../middleware/upload');

const router = express.Router();

// Get photos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM photos WHERE is_active = true';
    let params = [];
    
    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY category, created_at DESC';
    
    const result = await db.query(query, params);

    // Group photos by category
    const photosByCategory = {};
    result.rows.forEach(photo => {
      if (!photosByCategory[photo.category]) {
        photosByCategory[photo.category] = [];
      }
      photosByCategory[photo.category].push(photo);
    });

    res.json({
      photos: photosByCategory,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload photos (Admin only)
router.post('/upload', [
  authMiddleware,
  requireAdmin,
  upload.array('photos', 10) // Allow up to 10 photos at once
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { category } = req.body;

    if (!category) {
      // Clean up uploaded files if validation fails
      req.files.forEach(file => deleteFile(file.path));
      return res.status(400).json({ error: 'Category is required' });
    }

    const uploadedPhotos = [];

    for (const file of req.files) {
      const imageUrl = `/uploads/photos/${file.filename}`;
      
      const insertQuery = `
        INSERT INTO photos (title, description, category, image_url, file_name, file_size, created_by, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *
      `;
      const result = await db.query(insertQuery, [
        file.originalname.split('.')[0], // Use filename without extension as title
        '',
        category,
        imageUrl,
        file.originalname,
        file.size,
        req.user.id
      ]);

      uploadedPhotos.push(result.rows[0]);
    }

    res.json({
      message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
      photos: uploadedPhotos
    });

  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => deleteFile(file.path));
    }
    console.error('Upload photos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}, handleUploadError);

// Update photo metadata (Admin only)
router.put('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    const updateQuery = `
      UPDATE photos 
      SET title = $1, description = $2, category = $3, updated_at = NOW()
      WHERE id = $4 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [title || '', description || '', category, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json({
      message: 'Photo updated successfully',
      photo: result.rows[0]
    });

  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete photo (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Get photo info first to delete the file
    const getQuery = 'SELECT image_url FROM photos WHERE id = $1 AND is_active = true';
    const getResult = await db.query(getQuery, [id]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Mark as inactive in database
    const deleteQuery = 'UPDATE photos SET is_active = false WHERE id = $1 RETURNING *';
    const deleteResult = await db.query(deleteQuery, [id]);

    // Delete the actual file
    const filePath = path.join('uploads', getResult.rows[0].image_url.replace('/uploads/', ''));
    deleteFile(filePath);

    res.json({ message: 'Photo deleted successfully' });

  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get photo by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM photos WHERE id = $1 AND is_active = true';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.json({ photo: result.rows[0] });

  } catch (error) {
    console.error('Get photo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
