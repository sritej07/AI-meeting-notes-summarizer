import React, { useState } from 'react';
import { Upload, Send, Edit3, Mail } from 'lucide-react';

const API_BASE_URL = 'https://ai-meeting-notes-summarizer-wn7r.onrender.com/api'; // Update this for production

function App() {
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a text file (.txt)');
    }
  };

  const generateSummary = async () => {
    if (!transcript.trim()) {
      alert('Please provide a transcript');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript,
          custom_prompt: customPrompt || 'Summarize the meeting notes in a clear and structured format'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
      setEditedSummary(data.summary);
    } catch (error) {
      alert('Error generating summary: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    setSummary(editedSummary);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditedSummary(summary);
    setIsEditing(false);
  };

  const shareViaEmail = async () => {
    if (!emailRecipients.trim()) {
      alert('Please enter recipient email addresses');
      return;
    }

    if (!summary.trim()) {
      alert('No summary to share');
      return;
    }
    setIsSendingEmail(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: emailRecipients.split(',').map(email => email.trim()),
          summary: summary
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setEmailStatus('Email sent successfully!');
      setEmailRecipients('');
      setTimeout(() => setEmailStatus(''), 3000);
    } catch (error) {
      setEmailStatus('Error sending email: ' + error.message);
      setTimeout(() => setEmailStatus(''), 5000);
    }finally{
      setIsSendingEmail(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        AI-Powered Meeting Notes Summarizer
      </h1>

      {/* Upload Section */}
      <div style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <Upload size={48} style={{ color: '#666', marginBottom: '10px' }} />
        <p>Upload Meeting Transcript (.txt file)</p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          style={{ marginBottom: '10px' }}
        />

        <p style={{ margin: '10px 0', fontWeight: 'bold' }}>OR</p>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          style={{
            width: '100%',
            height: '150px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Custom Prompt Section */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Custom Instruction/Prompt (Optional):
        </label>
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Generate Summary Button */}
      <button
        onClick={generateSummary}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <Send size={20} />
        {isLoading ? 'Generating Summary...' : 'Generate Summary'}
      </button>

      {/* Summary Section */}
      {summary && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h3 style={{ margin: 0 }}>Generated Summary</h3>
            {!isEditing && (
              <button
                onClick={handleEdit}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={saveEdit}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              whiteSpace: 'pre-wrap',
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              {summary}
            </div>
          )}
        </div>
      )}

      {/* Email Sharing Section */}
      {summary && (
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f0f8ff'
        }}>
          <h3 style={{ marginTop: 0 }}>Share Summary via Email</h3>
          <input
            type="text"
            value={emailRecipients}
            onChange={(e) => setEmailRecipients(e.target.value)}
            placeholder="Enter recipient emails separated by commas"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          />
          <button
            onClick={shareViaEmail}
            disabled={isSendingEmail}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isSendingEmail ? (
              <div>
                <Mail size={16}  />
                <span>Sending...</span>
              </div>
            ) : (
              <div>
                <Mail size={16} />
                <span>Send Email</span>
              </div>
            )}
          </button>
          {emailStatus && (
            <p style={{
              marginTop: '10px',
              color: emailStatus.includes('Error') ? 'red' : 'green',
              fontWeight: 'bold'
            }}>
              {emailStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;