const axios = require('axios');

/**
 * Check URL safety using VirusTotal API
 * @param {string} urlToCheck - URL to check
 * @returns {Object} Safety analysis result
 */
const checkUrlSafety = async (urlToCheck) => {
  const API_KEY = process.env.VIRUSTOTAL_API_KEY;

  if (!API_KEY || API_KEY === 'your_virustotal_api_key_here') {
    return {
      safe: null,
      message: 'VirusTotal API key not configured',
      details: 'Please add VIRUSTOTAL_API_KEY to .env file'
    };
  }

  try {
    // Step 1: Encode URL to Base64 (VirusTotal standard)
    // Remove padding '=' as required by VirusTotal
    const urlId = Buffer.from(urlToCheck)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Step 2: Call VirusTotal API
    const targetUrl = `https://www.virustotal.com/api/v3/urls/${urlId}`;

    const response = await axios.get(targetUrl, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    const stats = response.data.data.attributes.last_analysis_stats;

    // Count threats
    const malicious = (stats.malicious || 0) + (stats.suspicious || 0);
    const total = malicious + (stats.harmless || 0) + (stats.undetected || 0);

    return {
      safe: malicious === 0,
      message: malicious > 0
        ? `CẢNH BÁO: Phát hiện ${malicious} mối đe dọa!`
        : 'AN TOÀN: Các công cụ bảo mật đánh giá tốt.',
      details: {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
        total: total,
        percentage: total > 0 ? Math.round((malicious / total) * 100) : 0
      },
      lastAnalysisDate: response.data.data.attributes.last_analysis_date,
      url: urlToCheck
    };

  } catch (error) {
    // Handle 404 - URL not scanned yet
    if (error.response && error.response.status === 404) {
      return {
        safe: null,
        message: 'Chưa có dữ liệu về trang này',
        details: {
          info: 'Hệ thống chưa từng quét trang này. Hãy cực kỳ cẩn thận trước khi truy cập!'
        },
        url: urlToCheck
      };
    }

    // Handle other errors
    console.error('VirusTotal API Error:', error.message);
    return {
      safe: null,
      message: 'Lỗi kiểm tra',
      details: {
        error: error.response?.data?.error?.message || error.message || 'Không thể kết nối đến server'
      },
      url: urlToCheck
    };
  }
};

/**
 * Submit URL for scanning
 * @param {string} url - URL to scan
 * @returns {Object} Scan submission result
 */
const submitUrlForScanning = async (url) => {
  const API_KEY = process.env.VIRUSTOTAL_API_KEY;

  if (!API_KEY || API_KEY === 'your_virustotal_api_key_here') {
    throw new Error('VirusTotal API key not configured');
  }

  try {
    const response = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      `url=${encodeURIComponent(url)}`,
      {
        headers: {
          'x-apikey': API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return {
      success: true,
      analysisId: response.data.data.id,
      message: 'URL submitted for analysis'
    };
  } catch (error) {
    console.error('VirusTotal Submit Error:', error.message);
    throw error;
  }
};

module.exports = {
  checkUrlSafety,
  submitUrlForScanning
};
