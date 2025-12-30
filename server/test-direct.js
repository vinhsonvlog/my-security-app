// Simple test để list models và test Gemini API
require('dotenv').config();

const listAvailableModels = async () => {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Fetching available models...\n');
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const data = await response.json();
    
    if (response.ok && data.models) {
      console.log('✅ Available models:\n');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        if (model.supportedGenerationMethods) {
          console.log(`  Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
      
      // Find models that support generateContent
      console.log('\n🎯 Models supporting generateContent:\n');
      const validModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (validModels.length > 0) {
        validModels.forEach(m => console.log(`- ${m.name}`));
        
        // Test the first valid model
        const testModel = validModels[0].name.replace('models/', '');
        console.log(`\n🧪 Testing ${testModel}...\n`);
        
        const testResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/${testModel}:generateContent?key=${API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: 'Hello! Please respond in Vietnamese.'
                }]
              }]
            })
          }
        );

        const testData = await testResponse.json();
        
        if (testResponse.ok) {
          console.log(`✅ Success! Response:`);
          console.log(testData.candidates[0].content.parts[0].text);
          console.log(`\n✨ Use this model in your code: ${testModel}`);
        } else {
          console.log(`❌ Test failed: ${testData.error?.message}`);
        }
      } else {
        console.log('No models support generateContent');
      }
      
    } else {
      console.log('❌ Error:', data.error?.message || 'Unknown error');
      console.log('\n💡 Possible issues:');
      console.log('1. API key might be invalid');
      console.log('2. API key might not be activated yet');
      console.log('3. Check: https://aistudio.google.com/app/apikey');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

listAvailableModels();
