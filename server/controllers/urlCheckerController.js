const { checkUrlSafety, submitUrlForScanning } = require('../services/virusTotalService');
const Blacklist = require('../models/Blacklist');

// @desc    Check URL safety using VirusTotal
// @route   POST /api/url-checker/check
// @access  Public
const checkUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      const error = new Error('Please provide a URL');
      error.statusCode = 400;
      return next(error);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      const error = new Error('Invalid URL format');
      error.statusCode = 400;
      return next(error);
    }

    // Check if URL is in blacklist first
    const blacklisted = await Blacklist.findOne({ url: url });
    
    if (blacklisted) {
      return res.json({
        success: true,
        source: 'blacklist',
        data: {
          safe: false,
          message: 'CẢNH BÁO: URL này đã bị đưa vào danh sách đen!',
          details: {
            reason: blacklisted.reason,
            severity: blacklisted.severity,
            approvedAt: blacklisted.approvedAt,
            blacklisted: true
          },
          url: url
        }
      });
    }

    // Check with VirusTotal
    const result = await checkUrlSafety(url);

    res.json({
      success: true,
      source: 'virustotal',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Submit URL for scanning
// @route   POST /api/url-checker/submit
// @access  Public
const submitUrl = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      const error = new Error('Please provide a URL');
      error.statusCode = 400;
      return next(error);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      const error = new Error('Invalid URL format');
      error.statusCode = 400;
      return next(error);
    }

    const result = await submitUrlForScanning(url);

    res.json({
      success: true,
      message: 'URL submitted for analysis. Please check back in a few minutes.',
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get blacklist URLs
// @route   GET /api/url-checker/blacklist
// @access  Public
const getPublicBlacklist = async (req, res, next) => {
  try {
    const blacklist = await Blacklist.find()
      .select('url reason severity approvedAt')
      .sort({ approvedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: blacklist.length,
      data: blacklist
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkUrl,
  submitUrl,
  getPublicBlacklist
};
