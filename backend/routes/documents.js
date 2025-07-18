const express = require('express');
const path = require('path');
const db = require('../config/database');
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { upload, handleUploadError, deleteFile } = require('../middleware/upload');

const router = express.Router();

// Get documents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM documents WHERE is_active = true';
    let params = [];
    
    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY category, created_at DESC';
    
    const result = await db.query(query, params);

    // Group documents by category
    const documentsByCategory = {};
    result.rows.forEach(doc => {
      if (!documentsByCategory[doc.category]) {
        documentsByCategory[doc.category] = [];
      }
      documentsByCategory[doc.category].push(doc);
    });

    res.json({
      documents: documentsByCategory,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload document (Admin only)
router.post('/upload', [
  authMiddleware,
  requireAdmin,
  upload.single('documents')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, category } = req.body;

    if (!title || !category) {
      // Clean up uploaded file if validation fails
      deleteFile(req.file.path);
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;

    const insertQuery = `
      INSERT INTO documents (title, description, category, file_url, file_name, file_size, mime_type, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    const result = await db.query(insertQuery, [
      title,
      description || '',
      category,
      fileUrl,
      req.file.originalname,
      req.file.size,
      req.file.mimetype,
      req.user.id
    ]);

    res.json({
      message: 'Document uploaded successfully',
      document: result.rows[0]
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      deleteFile(req.file.path);
    }
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}, handleUploadError);

// Update document metadata (Admin only)
router.put('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const updateQuery = `
      UPDATE documents 
      SET title = $1, description = $2, category = $3, updated_at = NOW()
      WHERE id = $4 AND is_active = true
      RETURNING *
    `;
    const result = await db.query(updateQuery, [title, description || '', category, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      message: 'Document updated successfully',
      document: result.rows[0]
    });

  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete document (Admin only)
router.delete('/:id', [authMiddleware, requireAdmin], async (req, res) => {
  try {
    const { id } = req.params;

    // Get document info first to delete the file
    const getQuery = 'SELECT file_url FROM documents WHERE id = $1 AND is_active = true';
    const getResult = await db.query(getQuery, [id]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Mark as inactive in database
    const deleteQuery = 'UPDATE documents SET is_active = false WHERE id = $1 RETURNING *';
    const deleteResult = await db.query(deleteQuery, [id]);

    // Delete the actual file
    const filePath = path.join('uploads', getResult.rows[0].file_url.replace('/uploads/', ''));
    deleteFile(filePath);

    res.json({ message: 'Document deleted successfully' });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Download document
router.get('/download/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM documents WHERE id = $1 AND is_active = true';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = result.rows[0];
    const filePath = path.join(__dirname, '..', 'uploads', document.file_url.replace('/uploads/', ''));

    res.download(filePath, document.file_name, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Error downloading file' });
      }
    });

  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
