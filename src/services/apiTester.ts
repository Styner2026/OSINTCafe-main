interface APITestResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

interface APITest {
  name: string;
  test: () => Promise<APITestResult>;
}

export class APITester {
  private tests: APITest[] = [
    {
      name: 'Google Gemini AI',
      test: async () => {
        try {
          const response = await fetch('/api/gemini/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Test connection' })
          });
          
          if (response.ok) {
            return { success: true, message: 'AI service operational' };
          } else {
            // Try direct API test
            const testPrompt = "Respond with exactly: 'API test successful'";
            const result = await this.testGeminiDirect(testPrompt);
            return result;
          }
        } catch (error) {
          return { success: false, message: `Connection failed: ${error}` };
        }
      }
    },
    {
      name: 'ElevenLabs Voice',
      test: async () => {
        try {
          const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
          if (!apiKey) {
            return { success: false, message: 'API key not configured' };
          }

          // Test voice list endpoint
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return { 
              success: true, 
              message: `Found ${data.voices?.length || 0} voices`,
              data: data.voices?.slice(0, 3) // First 3 voices
            };
          } else {
            const error = await response.text();
            return { success: false, message: `API error: ${error}` };
          }
        } catch (error) {
          return { success: false, message: `Connection failed: ${error}` };
        }
      }
    },
    {
      name: 'Tavus AI Avatar',
      test: async () => {
        try {
          const apiKey = import.meta.env.NEXT_PUBLIC_TAVUS_API_KEY;
          if (!apiKey) {
            return { success: false, message: 'API key not configured' };
          }

          // Test replica list endpoint
          const response = await fetch('https://tavusapi.com/v2/replicas', {
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return { 
              success: true, 
              message: `Found ${data.data?.length || 0} replicas`,
              data: data.data?.slice(0, 2) // First 2 replicas
            };
          } else {
            const error = await response.text();
            return { success: false, message: `API error: ${error}` };
          }
        } catch (error) {
          return { success: false, message: `Connection failed: ${error}` };
        }
      }
    },
    {
      name: 'Pica Image Analysis',
      test: async () => {
        try {
          const apiKey = import.meta.env.NEXT_PUBLIC_PICAOS_API_KEY;
          if (!apiKey) {
            return { success: false, message: 'API key not configured' };
          }

          // Test account info endpoint
          const response = await fetch('https://api.picaos.com/v1/account', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return { 
              success: true, 
              message: `Account verified: ${data.email || 'Active'}`,
              data: { credits: data.credits, plan: data.plan }
            };
          } else {
            const error = await response.text();
            return { success: false, message: `API error: ${error}` };
          }
        } catch (error) {
          return { success: false, message: `Connection failed: ${error}` };
        }
      }
    },
    {
      name: 'Dappier Web Scraping',
      test: async () => {
        try {
          const apiKey = import.meta.env.NEXT_PUBLIC_DAPPIER;
          if (!apiKey) {
            return { success: false, message: 'API key not configured' };
          }

          // Test simple search endpoint
          const response = await fetch('https://api.dappier.com/app/dataapi/v1/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: 'cybersecurity news',
              limit: 1
            })
          });

          if (response.ok) {
            const data = await response.json();
            return { 
              success: true, 
              message: `Search working: ${data.results?.length || 0} results`,
              data: { resultsCount: data.results?.length }
            };
          } else {
            const error = await response.text();
            return { success: false, message: `API error: ${error}` };
          }
        } catch (error) {
          return { success: false, message: `Connection failed: ${error}` };
        }
      }
    },
    {
      name: 'Algorand Blockchain',
      test: async () => {
        try {
          const endpoint = import.meta.env.ALGOD_MAINNET_API;
          if (!endpoint) {
            return { success: false, message: 'Endpoint not configured' };
          }

          // Test algod status
          const response = await fetch(`${endpoint}/v2/status`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            return { 
              success: true, 
              message: `Network: Round ${data.lastRound}`,
              data: { lastRound: data.lastRound, timeSinceLastRound: data.timeSinceLastRound }
            };
          } else {
            const error = await response.text();
            return { success: false, message: `API error: ${error}` };
          }
        } catch (error) {
          return { success: false, message: `Connection failed: ${error}` };
        }
      }
    }
  ];

  private async testGeminiDirect(prompt: string) {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        return { success: false, message: 'API key not configured' };
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return { 
          success: true, 
          message: 'AI responding correctly',
          data: { response: responseText?.substring(0, 100) + '...' }
        };
      } else {
        const error = await response.text();
        return { success: false, message: `Gemini API error: ${error}` };
      }
    } catch (error) {
      return { success: false, message: `Gemini connection failed: ${error}` };
    }
  }

  async runAllTests(): Promise<{ name: string; result: APITestResult }[]> {
    const results = [];
    
    for (const test of this.tests) {
      try {
        console.log(`Testing ${test.name}...`);
        const result = await test.test();
        results.push({ name: test.name, result });
        
        // Add small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.push({ 
          name: test.name, 
          result: { success: false, message: `Test failed: ${error}` }
        });
      }
    }
    
    return results;
  }

  async runSingleTest(testName: string) {
    const test = this.tests.find(t => t.name === testName);
    if (!test) {
      throw new Error(`Test "${testName}" not found`);
    }
    
    return await test.test();
  }
}

export const apiTester = new APITester();
