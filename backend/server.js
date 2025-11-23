const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit'); // Add rate limiting
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Additional security headers
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger code inputs
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import execution modules
const { executePythonCode, executePythonStep } = require('./python-execution');
const { executeJavaCode, executeJavaStep } = require('./java-execution');

// Input validation functions
function validateCodeInput(code, language) {
  // Check code length
  if (!code || typeof code !== 'string') {
    throw new Error('Code must be a non-empty string');
  }

  if (code.length > 50000) { // Limit code size to 50KB
    throw new Error('Code is too large. Maximum size is 50KB.');
  }

  // Validate language
  if (!language || !['python', 'java'].includes(language)) {
    throw new Error('Invalid language. Only python and java are supported.');
  }

  // Check for dangerous patterns in code
  const dangerousPatterns = [
    /import\s+os/,
    /import\s+sys/,
    /exec\(/,
    /eval\(/,
    /__import__/,
    /subprocess/,
    /importlib/,
    /open\(/, // Basic file open (would be more restrictive in production)
    /shutil/,
    /socket/,
    /requests/,
    /urllib/
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      throw new Error(`Potentially dangerous code detected: ${pattern}`);
    }
  }
}

// API endpoint for code execution
app.post('/api/execute', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Validate inputs
    try {
      validateCodeInput(code, language);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    let result;
    if (language === 'python') {
      result = await executePythonCode(code);
    } else if (language === 'java') {
      result = await executeJavaCode(code);
    } else {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for stepping through code
app.post('/api/step', async (req, res) => {
  try {
    const { code, language, currentStep } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Validate inputs
    try {
      validateCodeInput(code, language);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Validate currentStep
    if (typeof currentStep !== 'number' || currentStep < 0) {
      return res.status(400).json({ error: 'Current step must be a non-negative number' });
    }

    let result;
    if (language === 'python') {
      result = await executePythonStep(code, currentStep);
    } else if (language === 'java') {
      result = await executeJavaStep(code, currentStep);
    } else {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for resetting execution
app.post('/api/reset', (req, res) => {
  // Reset execution state
  res.json({ message: 'Execution reset' });
});

// Serve static files from frontend build directory (for production)
app.use(express.static(path.join(__dirname, '../frontend/ds_visualizer/build')));

// Handle React routing (only if we're serving the built frontend)
// For development, we'll skip this and just serve API routes
// Only add this route if the frontend build exists
try {
  const indexPath = path.join(__dirname, '../frontend/ds_visualizer/build', 'index.html');
  fs.accessSync(indexPath, fs.constants.F_OK);

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
} catch (e) {
  // If build directory doesn't exist, just log a message
  console.log('Frontend build directory not found. Serving API only.');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});