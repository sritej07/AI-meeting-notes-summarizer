# AI-Powered Meeting Notes Summarizer

## Project Overview
A full-stack web application that uses AI to summarize meeting transcripts and share them via email. Users can upload text files or paste transcripts, provide custom instructions for summarization, edit the generated summaries, and share them with team members.

## Tech Stack

### Frontend
- **React.js** - Component-based UI framework
- **JavaScript/ES6** - Core programming language
- **Lucide React** - Icon library for UI elements
- **Basic CSS** - Minimal styling for functionality focus

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Mail** - Email functionality
- **Google Gemini 2.0 Flash** - AI summarization service
- **Python 3.8+** - Backend programming language

### Deployment Options
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku

## Architecture & Approach

### System Design
```
[React Frontend] ←→ [Flask API Backend] ←→ [Google Gemini API]
                                     ←→ [Email Service (Gmail)]
```

### Key Features Implementation

#### 1. File Upload & Text Input
- Supports .txt file uploads using HTML5 FileReader API
- Alternative textarea input for direct transcript pasting
- Client-side file validation

#### 2. AI Summarization
- Integration with Google Gemini 2.0 Flash model
- Custom prompt handling for different summary styles
- Error handling and loading states

#### 3. Editable Summaries
- Toggle between view/edit modes
- Real-time text editing with save/cancel functionality
- State management for edited content

#### 4. Email Sharing
- Flask-Mail integration with Gmail SMTP
- Multiple recipient support
- HTML and plain text email formats
- Input validation for email addresses

## Setup Instructions

### Backend Setup

1. **Create project directory and navigate to it:**
```bash
mkdir meeting-summarizer
cd meeting-summarizer
mkdir backend
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Environment Configuration:**
   - Create `.env` file in backend directory
   - Add required environment variables:
     - `GEMINI_API_KEY`: Get from https://aistudio.google.com/app/apikey
     - `MAIL_USERNAME`: Your Gmail address
     - `MAIL_PASSWORD`: Gmail App Password (not regular password)

5. **Gmail App Password Setup:**
   - Enable 2-factor authentication on Gmail
   - Generate App Password: Google Account → Security → App Passwords
   - Use the generated password in `.env` file

6. **Run the backend:**
```bash
python app.py
```

### Frontend Setup

1. **Create React application:**
```bash
cd ..  # Back to project root
npx create-react-app frontend
cd frontend
```

2. **Install additional dependencies:**
```bash
npm install lucide-react
```

3. **Replace src/App.js with the provided React component**

4. **Update API_BASE_URL in App.js:**
   - Development: `http://localhost:5000/api`
   - Production: Your deployed backend URL

5. **Run the frontend:**
```bash
npm start
```

## API Endpoints

### POST /api/generate-summary
**Purpose**: Generate AI summary from transcript
**Request Body**:
```json
{
  "transcript": "meeting transcript text",
  "custom_prompt": "optional instruction"
}
```
**Response**:
```json
{
  "summary": "generated summary text",
  "status": "success"
}
```

### POST /api/send-email
**Purpose**: Send summary via email
**Request Body**:
```json
{
  "recipients": ["email1@example.com", "email2@example.com"],
  "summary": "summary text to send"
}
```
**Response**:
```json
{
  "message": "Email sent successfully to X recipient(s)",
  "status": "success"
}
```

### GET /api/health
**Purpose**: Health check endpoint
**Response**:
```json
{
  "status": "healthy",
  "message": "Meeting Summarizer API is running"
}
```

## User Flow

1. **Upload/Input**: User uploads .txt file or pastes transcript
2. **Customize**: Optional custom instruction for summary style
3. **Generate**: Click "Generate Summary" to process with AI
4. **Review**: View generated summary
5. **Edit**: Make modifications if needed using edit mode
6. **Share**: Enter recipient emails and send summary

## Error Handling

### Frontend
- File type validation for uploads
- Network error handling for API calls
- User feedback through alerts and status messages
- Loading states during API operations

### Backend
- Input validation for all endpoints
- Comprehensive error logging
- Graceful API error responses
- Environment variable validation

## Security Considerations

- CORS properly configured for cross-origin requests
- Input sanitization for all user inputs
- Environment variables for sensitive data
- Email validation before sending

## Deployment Guide

### Backend Deployment (Render)

1. **Create requirements.txt** (provided above)

2. **Create Procfile**:
```
web: gunicorn app:app
```

3. **Set environment variables** on platform dashboard

4. **Deploy from GitHub repository**

### Frontend Deployment (Vercel)

1. **Build optimization**:
```bash
npm run build
```

2. **Update API_BASE_URL** to production backend URL

3. **Deploy to Vercel**:
```bash
npx vercel
```

## Testing Strategy

### Manual Testing Checklist
- [ ] File upload functionality
- [ ] Text area input
- [ ] AI summary generation
- [ ] Custom prompt variations
- [ ] Summary editing features
- [ ] Email sending with multiple recipients
- [ ] Error handling scenarios

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test summary generation
curl -X POST http://localhost:5000/api/generate-summary \
  -H "Content-Type: application/json" \
  -d '{"transcript": "test meeting notes", "custom_prompt": "bullet points"}'
```

## Future Enhancements

1. **User Authentication**: Login/signup functionality
2. **Summary History**: Store and retrieve past summaries
3. **Multiple AI Models**: Support for different AI providers
4. **Advanced Formatting**: Rich text editor for summaries
5. **Team Collaboration**: Share summaries within teams
6. **File Format Support**: Support for audio/video transcription
7. **Templates**: Pre-built summary templates
8. **Analytics**: Usage statistics and insights

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Flask-CORS is properly configured
2. **Email Not Sending**: Verify Gmail app password and SMTP settings
3. **Gemini API Errors**: Check API key validity and rate limits
4. **File Upload Issues**: Ensure proper MIME type validation

### Debug Steps

1. Check browser console for frontend errors
2. Review Flask logs for backend issues
3. Verify environment variables are set
4. Test API endpoints independently
5. Check network connectivity between services

## Performance Considerations

- **Frontend**: Implement debouncing for text inputs
- **Backend**: Add request rate limiting
- **AI API**: Handle rate limits and implement retry logic
- **Email**: Queue system for bulk emails
- **Caching**: Cache common summary patterns

## Conclusion

This application demonstrates a complete full-stack development cycle with modern technologies, AI integration, and practical business functionality. The modular architecture allows for easy scaling and feature additions while maintaining code quality and user experience.

The focus on functionality over design, as requested, ensures the application serves its core purpose effectively while remaining simple to deploy and maintain.