import { useState } from 'react'
import { Container, Typography, Button, Card, CardContent, Chip, Box, Radio, RadioGroup, FormControlLabel, FormControl, Alert } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { generateCyberQuestion } from '../services/geminiApi'

const CyberQuiz = () => {
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)

  const handleGenerateQuestion = async () => {
    setLoading(true)
    setSelectedAnswer('')
    setShowResult(false)
    setQuestion(null)

    const result = await generateCyberQuestion()

    if (result) {
      setQuestion(result)
    } else {
      alert('Có lỗi khi gọi AI, vui lòng thử lại sau!')
    }
    setLoading(false)
  }

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert('Vui lòng chọn một đáp án!')
      return
    }
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === question?.correctAnswer

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
          <SmartToyIcon sx={{ fontSize: 48, color: '#a855f7' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
            Luyện tập với AI
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleGenerateQuestion}
          disabled={loading}
          sx={{
            bgcolor: '#a855f7',
            py: 1.5,
            px: 4,
            fontSize: '1rem',
            fontWeight: 700,
            mb: 5,
            '&:hover': { bgcolor: '#9333ea' }
          }}
        >
          {loading ? '🤖 AI đang suy nghĩ...' : '✨ Tạo tình huống mới'}
        </Button>

        {question && (
          <Card 
            sx={{ 
              bgcolor: '#1e293b',
              borderTop: '4px solid #a855f7',
              boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Chip 
                label={question.type} 
                sx={{ 
                  bgcolor: '#f59e0b',
                  color: '#fff',
                  fontWeight: 700,
                  mb: 3
                }} 
              />
              
              <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 2, lineHeight: 1.8 }}>
                {question.scenario}
              </Typography>

              <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 4, fontWeight: 600 }}>
                {question.question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                  {Object.entries(question.options).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      value={key}
                      control={<Radio sx={{ color: '#a855f7', '&.Mui-checked': { color: '#a855f7' } }} />}
                      label={`${key}. ${value}`}
                      disabled={showResult}
                      sx={{
                        bgcolor: showResult && key === question.correctAnswer 
                          ? 'rgba(16, 185, 129, 0.1)' 
                          : showResult && key === selectedAnswer && !isCorrect
                          ? 'rgba(239, 68, 68, 0.1)'
                          : 'transparent',
                        color: '#e2e8f0',
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        border: showResult && key === question.correctAnswer
                          ? '2px solid #10b981'
                          : showResult && key === selectedAnswer && !isCorrect
                          ? '2px solid #ef4444'
                          : '1px solid rgba(148, 163, 184, 0.2)',
                        '& .MuiFormControlLabel-label': {
                          fontSize: '1rem'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Box sx={{ pt: 2 }}>
                {!showResult ? (
                  <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    sx={{
                      bgcolor: '#a855f7',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#9333ea'
                      },
                      '&:disabled': {
                        bgcolor: '#475569'
                      }
                    }}
                  >
                    ✅ Kiểm tra đáp án
                  </Button>
                ) : (
                  <Box>
                    <Alert 
                      severity={isCorrect ? 'success' : 'error'}
                      sx={{ mb: 3 }}
                    >
                      {isCorrect 
                        ? '🎉 Chính xác! Bạn đã trả lời đúng!' 
                        : `❌ Sai rồi! Đáp án đúng là: ${question.correctAnswer}`
                      }
                    </Alert>
                    
                    <Box 
                      sx={{ 
                        bgcolor: 'rgba(168, 85, 247, 0.1)',
                        p: 3,
                        borderRadius: 2,
                        border: '1px solid rgba(168, 85, 247, 0.3)'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#a855f7', mb: 2 }}>
                        💡 Giải thích:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                        {question.explanation}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  )
}

export default CyberQuiz