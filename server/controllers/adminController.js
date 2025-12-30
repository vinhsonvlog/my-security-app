const Report = require('../models/Report');
const Blacklist = require('../models/Blacklist');

// @desc    Get all pending reports
// @route   GET /api/admin/reports/pending
// @access  Private/Admin
const getPendingReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ status: 'pending' })
      .populate('reporterUserId', 'username email')
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

// @desc    Approve report (move to blacklist)
// @route   POST /api/admin/reports/:id/approve
// @access  Private/Admin
const approveReport = async (req, res, next) => {
  try {
    const { adminNote, severity } = req.body;
    
    const report = await Report.findById(req.params.id);

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      return next(error);
    }

    if (report.status !== 'pending') {
      const error = new Error('Report has already been reviewed');
      error.statusCode = 400;
      return next(error);
    }

    // Check if URL already exists in blacklist
    const existingBlacklist = await Blacklist.findOne({ url: report.url });
    if (existingBlacklist) {
      const error = new Error('URL already exists in blacklist');
      error.statusCode = 400;
      return next(error);
    }

    // Create blacklist entry
    const blacklistEntry = await Blacklist.create({
      url: report.url,
      reportId: report._id,
      reportedBy: report.reportedBy,
      reason: report.reason,
      approvedBy: req.user._id,
      severity: severity || 'medium'
    });

    // Update report status
    report.status = 'approved';
    report.reviewedBy = req.user._id;
    report.reviewedAt = Date.now();
    report.adminNote = adminNote;
    await report.save();

    res.json({
      success: true,
      message: 'Report approved and added to blacklist',
      data: {
        report,
        blacklistEntry
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject report
// @route   POST /api/admin/reports/:id/reject
// @access  Private/Admin
const rejectReport = async (req, res, next) => {
  try {
    const { adminNote } = req.body;
    
    const report = await Report.findById(req.params.id);

    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      return next(error);
    }

    if (report.status !== 'pending') {
      const error = new Error('Report has already been reviewed');
      error.statusCode = 400;
      return next(error);
    }

    // Update report status
    report.status = 'rejected';
    report.reviewedBy = req.user._id;
    report.reviewedAt = Date.now();
    report.adminNote = adminNote;
    await report.save();

    res.json({
      success: true,
      message: 'Report rejected',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports (with filters)
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAllReports = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate('reportedBy', 'username email')
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

// @desc    Get blacklist
// @route   GET /api/admin/blacklist
// @access  Private/Admin
const getBlacklist = async (req, res, next) => {
  try {
    const blacklist = await Blacklist.find()
      .populate('reportedBy', 'username email')
      .populate('approvedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: blacklist.length,
      data: blacklist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from blacklist
// @route   DELETE /api/admin/blacklist/:id
// @access  Private/Admin
const removeFromBlacklist = async (req, res, next) => {
  try {
    const blacklistEntry = await Blacklist.findById(req.params.id);

    if (!blacklistEntry) {
      const error = new Error('Blacklist entry not found');
      error.statusCode = 404;
      return next(error);
    }

    await blacklistEntry.deleteOne();

    res.json({
      success: true,
      message: 'Removed from blacklist',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingReports,
  approveReport,
  rejectReport,
  getAllReports,
  getBlacklist,
  removeFromBlacklist
};
