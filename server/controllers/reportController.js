const Report = require('../models/Report');
const { checkUrlSafety } = require('../services/virusTotalService');
const { normalizeUrl, isValidUrl } = require('../utils/urlNormalizer');
const { validationResult } = require('express-validator');

// @desc    Submit a new report
// @route   POST /api/reports
// @access  Private
const submitReport = async (req, res, next) => {
  try {
    const { url, reason } = req.body;

    if (!url || !reason) {
      const error = new Error('Please provide URL and reason');
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

    // Optional: Auto-check with VirusTotal
    let virusTotalResult = null;
    try {
      virusTotalResult = await checkUrlSafety(url);
    } catch (error) {
      console.log('VirusTotal check failed, continuing with report submission');
    }

    const report = await Report.create({
      url,
      reason,
      reporterUserId: req.user._id,
      reporterInfo: {
        email: req.user.email,
        isAnonymous: false
      }
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        report,
        virusTotalCheck: virusTotalResult
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's own reports
// @route   GET /api/reports/my-reports
// @access  Private
const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporterUserId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports/admin/all
// @access  Private/Admin
const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporterUserId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      return next(error);
    }

    report.status = status || report.status;
    report.adminNote = adminNote || report.adminNote;
    report.reviewedBy = req.user._id;
    report.reviewedAt = Date.now();

    await report.save();

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete report (Admin only)
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      return next(error);
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Additional functions from backend

// @desc    Create a new report (public or authenticated)
// @route   POST /api/reports/create
// @access  Public
const createReport = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array(),
      });
    }

    const { url, reason, scamType, reporterInfo = {}, evidenceImages = [] } = req.body;

    if (!url || !reason || !scamType) {
      return res.status(400).json({
        success: false,
        message: 'URL, reason và scamType là bắt buộc',
      });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'URL không hợp lệ',
      });
    }

    const normalizedUrl = normalizeUrl(url);

    const duplicate = await Report.checkDuplicate(normalizedUrl);

    const reportData = {
      url,
      normalizedUrl,
      reason,
      scamType,
      evidenceImages: Array.isArray(evidenceImages) ? evidenceImages.slice(0, 5) : [],
      reporterInfo: {
        name: reporterInfo.name || null,
        email: reporterInfo.email || null,
        phone: reporterInfo.phone || null,
        isAnonymous: reporterInfo.isAnonymous || false,
      },
      reporterUserId: req.user ? req.user._id : null,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
    };

    const report = await Report.create(reportData);

    return res.status(201).json({
      success: true,
      message: duplicate
        ? 'Báo cáo đã được ghi nhận. URL này đã được báo cáo trước đó.'
        : 'Báo cáo đã được gửi thành công',
      data: {
        reportId: report._id,
        status: report.status,
        isDuplicate: report.isDuplicate,
      },
    });
  } catch (error) {
    console.error('Create Report Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo báo cáo',
      error: error.message,
    });
  }
};

// @desc    Get report status by ID
// @route   GET /api/reports/status/:reportId
// @access  Public
const getReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId).select(
      'status createdAt reviewedAt adminNotes'
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy báo cáo',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: report.status,
        submittedAt: report.createdAt,
        reviewedAt: report.reviewedAt,
        adminNotes: report.status === 'rejected' ? report.adminNotes : null,
      },
    });
  } catch (error) {
    console.error('Get Report Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

// @desc    Get user reports by email
// @route   GET /api/reports/user?email=xxx
// @access  Public
const getUserReports = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc',
      });
    }

    const reports = await Report.find({
      'reporterInfo.email': email.toLowerCase(),
    })
      .select('url scamType status createdAt reviewedAt')
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      total: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error('Get User Reports Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

module.exports = {
  submitReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  deleteReport,
  createReport,
  getReportStatus,
  getUserReports
};
