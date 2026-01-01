const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api'

export const checkUrlSafety = async (urlToCheck) => {
  try {
    const response = await fetch(`${API_URL}/url-checker/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: urlToCheck })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error?.message || 'Lỗi kiểm tra URL')
    }

    const data = result.data

    if (result.source === 'trusted') {
      return {
        safe: true,
        trusted: true,
        message: data.message,
        details: data.details || { malicious: 0, suspicious: 0, harmless: 0 },
        analysis: data.details || { malicious: 0, suspicious: 0 },
        aiAnalysis: data.aiAnalysis || null
      }
    }

    if (result.source === 'blacklist') {
      return {
        safe: false,
        message: data.message,
        details: `Lý do: ${data.details.reason} | Mức độ: ${data.details.severity} | Đã bị chặn: ${new Date(data.details.approvedAt).toLocaleDateString('vi-VN')}`,
        aiAnalysis: data.aiAnalysis || null
      }
    }

    if (result.source === 'virustotal') {
      if (data.safe === null) {
        return {
          safe: null,
          message: data.message,
          details: data.details.info || data.details.error || 'Chưa có thông tin về URL này',
          aiAnalysis: data.aiAnalysis || null
        }
      }

      if (data.details.malicious !== undefined) {
        const malicious = data.details.malicious + data.details.suspicious
        return {
          safe: data.safe,
          message: data.message,
          details: data.details,
          analysis: {
            malicious: data.details.malicious,
            suspicious: data.details.suspicious,
            harmless: data.details.harmless
          },
          aiAnalysis: data.aiAnalysis || null
        }
      }

      return {
        safe: data.safe,
        message: data.message,
        details: typeof data.details === 'string' ? data.details : JSON.stringify(data.details),
        aiAnalysis: data.aiAnalysis || null
      }
    }

    return {
      safe: false,
      message: 'Lỗi kiểm tra',
      details: 'Không thể xác định nguồn dữ liệu'
    }

  } catch (error) {
    console.error('Lỗi kết nối backend:', error)
    return {
      safe: false,
      message: 'Lỗi kết nối',
      details: `Không thể kết nối đến server. Hãy chắc chắn backend đang chạy tại ${API_URL}`
    }
  }
}
