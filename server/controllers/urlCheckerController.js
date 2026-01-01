const { checkUrlSafety, submitUrlForScanning } = require('../services/virusTotalService');
const { analyzeUrlWithAI } = require('../services/geminiService');
const Blacklist = require('../models/Blacklist');
const { isTrustedDomain } = require('../utils/urlNormalizer');

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

    // Check if it's a trusted domain first - skip blacklist check
    if (isTrustedDomain(url)) {
      // Still check VirusTotal for additional info
      const result = await checkUrlSafety(url);
      
      // AI Analysis for trusted domains
      const aiAnalysis = await analyzeUrlWithAI(url, result, { isSafe: true });
      
      return res.json({
        success: true,
        source: 'trusted',
        data: {
          ...result,
          safe: true,
          message: 'AN TOÀN: Đây là trang web đáng tin cậy từ nhà cung cấp uy tín.',
          trusted: true,
          aiAnalysis: aiAnalysis
        }
      });
    }

    // Check if URL is in blacklist
    const blacklisted = await Blacklist.findOne({ url: url });
    
    if (blacklisted) {
      // AI Analysis for blacklisted URLs
      const aiAnalysis = await analyzeUrlWithAI(url, null, { 
        isSafe: false, 
        data: { scamType: blacklisted.scamType } 
      });
      
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
          url: url,
          aiAnalysis: aiAnalysis
        }
      });
    }

    // Check with VirusTotal
    const result = await checkUrlSafety(url);
    
    // AI Analysis
    const aiAnalysis = await analyzeUrlWithAI(url, result, { isSafe: result.safe });

    res.json({
      success: true,
      source: 'virustotal',
      data: {
        ...result,
        aiAnalysis: aiAnalysis
      }
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
