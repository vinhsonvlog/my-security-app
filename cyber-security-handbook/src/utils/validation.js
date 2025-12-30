// Validation helpers for frontend

export const scamTypes = [
  { value: 'phishing', label: 'Lừa đảo thông tin (Phishing)' },
  { value: 'fake-shop', label: 'Website bán hàng giả' },
  { value: 'investment-scam', label: 'Lừa đảo đầu tư' },
  { value: 'tech-support', label: 'Giả mạo hỗ trợ kỹ thuật' },
  { value: 'lottery-scam', label: 'Lừa đảo trúng thưởng' },
  { value: 'romance-scam', label: 'Lừa đảo tình cảm' },
  { value: 'malware', label: 'Phần mềm độc hại' },
  { value: 'crypto-scam', label: 'Lừa đảo tiền ảo' },
  { value: 'job-scam', label: 'Lừa đảo việc làm' },
  { value: 'other', label: 'Khác' }
];

export const dangerLevels = [
  { value: 'low', label: 'Thấp', color: '#fbbf24' },
  { value: 'medium', label: 'Trung bình', color: '#f59e0b' },
  { value: 'high', label: 'Cao', color: '#ef4444' },
  { value: 'critical', label: 'Nghiêm trọng', color: '#dc2626' }
];

export const reportStatuses = [
  { value: 'pending', label: 'Đang chờ xử lý', color: '#06b6d4' },
  { value: 'processing', label: 'Đang xác minh', color: '#f59e0b' },
  { value: 'approved', label: 'Đã phê duyệt', color: '#10b981' },
  { value: 'rejected', label: 'Đã từ chối', color: '#ef4444' }
];

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlPattern.test(url.trim());
};

export const validateEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailPattern.test(email);
};

export const validateReportData = (data) => {
  const errors = [];
  
  if (!data.url || !data.url.trim()) {
    errors.push('URL là bắt buộc');
  } else if (!validateUrl(data.url)) {
    errors.push('URL không hợp lệ');
  }
  
  if (!data.reason || !data.reason.trim()) {
    errors.push('Lý do báo cáo là bắt buộc');
  } else if (data.reason.trim().length < 10) {
    errors.push('Lý do phải có ít nhất 10 ký tự');
  } else if (data.reason.trim().length > 2000) {
    errors.push('Lý do không được vượt quá 2000 ký tự');
  }
  
  if (!data.scamType) {
    errors.push('Loại lừa đảo là bắt buộc');
  } else if (!scamTypes.find(t => t.value === data.scamType)) {
    errors.push('Loại lừa đảo không hợp lệ');
  }
  
  if (data.reporterInfo) {
    if (data.reporterInfo.name && data.reporterInfo.name.length > 100) {
      errors.push('Tên không được vượt quá 100 ký tự');
    }
    
    if (data.reporterInfo.email && !validateEmail(data.reporterInfo.email)) {
      errors.push('Email không hợp lệ');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getScamTypeLabel = (value) => {
  const type = scamTypes.find(t => t.value === value);
  return type ? type.label : value;
};

export const getDangerLevelLabel = (value) => {
  const level = dangerLevels.find(l => l.value === value);
  return level ? level.label : value;
};

export const getDangerLevelColor = (value) => {
  const level = dangerLevels.find(l => l.value === value);
  return level ? level.color : '#64748b';
};

export const getReportStatusLabel = (value) => {
  const status = reportStatuses.find(s => s.value === value);
  return status ? status.label : value;
};

export const getReportStatusColor = (value) => {
  const status = reportStatuses.find(s => s.value === value);
  return status ? status.color : '#64748b';
};
