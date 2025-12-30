const Volunteer = require('../models/Volunteer');

// @desc    Create new volunteer registration
// @route   POST /api/volunteers
// @access  Public
exports.createVolunteer = async (req, res) => {
  try {
    const { fullName, email, phone, specialty, experience } = req.body;

    // Check if email already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được đăng ký'
      });
    }

    const volunteer = await Volunteer.create({
      fullName,
      email,
      phone,
      specialty,
      experience
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
      data: volunteer
    });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi đăng ký',
      error: error.message
    });
  }
};

// @desc    Get all volunteers (Admin only)
// @route   GET /api/volunteers
// @access  Private/Admin
exports.getAllVolunteers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Volunteer.countDocuments(query);
    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: volunteers,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting volunteers:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách',
      error: error.message
    });
  }
};

// @desc    Get single volunteer
// @route   GET /api/volunteers/:id
// @access  Private/Admin
exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tình nguyện viên'
      });
    }

    res.json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    console.error('Error getting volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra',
      error: error.message
    });
  }
};

// @desc    Update volunteer status
// @route   PUT /api/volunteers/:id
// @access  Private/Admin
exports.updateVolunteer = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tình nguyện viên'
      });
    }

    if (status) volunteer.status = status;
    if (notes !== undefined) volunteer.notes = notes;

    await volunteer.save();

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: volunteer
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật',
      error: error.message
    });
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private/Admin
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tình nguyện viên'
      });
    }

    await volunteer.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa tình nguyện viên'
    });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa',
      error: error.message
    });
  }
};
