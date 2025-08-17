from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import os
import google.generativeai as genai
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')  # Your Gmail
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')  # App password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

# Initialize extensions
mail = Mail(app)

# Configure Gemini
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.5-flash-lite')

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/generate-summary', methods=['POST'])
def generate_summary():
    try:
        data = request.get_json()
        
        if not data or 'transcript' not in data:
            return jsonify({'error': 'Transcript is required'}), 400
        
        transcript = data['transcript']
        custom_prompt = data.get('custom_prompt', 'Summarize the meeting notes in a clear and structured format')
        
        if not transcript.strip():
            return jsonify({'error': 'Transcript cannot be empty'}), 400
        
        # Prepare the prompt for Gemini
        prompt = f"""You are an AI assistant that specializes in summarizing meeting transcripts. 
        Your task is to analyze the provided transcript and create a summary based on the user's specific instructions.
        
        User's instruction: {custom_prompt}
        
        Please provide a well-structured, clear, and concise summary that follows the user's requirements.
        
        Meeting transcript to summarize:
        {transcript}"""
        
        # Call Gemini API
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=2000,
            )
        )
        
        summary = response.text
        
        logger.info(f"Summary generated successfully for transcript of length {len(transcript)}")
        
        return jsonify({
            'summary': summary,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error generating summary: {str(e)}")
        return jsonify({'error': f'Failed to generate summary: {str(e)}'}), 500

@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        
        if not data or 'recipients' not in data or 'summary' not in data:
            return jsonify({'error': 'Recipients and summary are required'}), 400
        
        recipients = data['recipients']
        summary = data['summary']
        
        if not recipients or not isinstance(recipients, list):
            return jsonify({'error': 'Recipients must be a non-empty list'}), 400
        
        if not summary.strip():
            return jsonify({'error': 'Summary cannot be empty'}), 400
        
        # Validate email addresses (basic validation)
        for email in recipients:
            if '@' not in email or '.' not in email:
                return jsonify({'error': f'Invalid email address: {email}'}), 400
        
        # Create email message
        msg = Message(
            subject='Meeting Summary - AI Generated',
            recipients=recipients,
            body=f"""Hi,

Please find the meeting summary below:

{summary}

---
This summary was generated using AI and may have been edited.

Best regards,
Meeting Summarizer App""",
            html=f"""
            <html>
                <body>
                    <h2>Meeting Summary</h2>
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">{summary}</pre>
                    </div>
                    <hr>
                    <p><small>This summary was generated using AI and may have been edited.</small></p>
                    <p><small>Best regards,<br>Meeting Summarizer App</small></p>
                </body>
            </html>
            """
        )
        
        # Send email
        mail.send(msg)
        
        logger.info(f"Email sent successfully to {len(recipients)} recipients")
        
        return jsonify({
            'message': f'Email sent successfully to {len(recipients)} recipient(s)',
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return jsonify({'error': f'Failed to send email: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Meeting Summarizer API is running'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check for required environment variables
    required_env_vars = ['GEMINI_API_KEY', 'MAIL_USERNAME', 'MAIL_PASSWORD']
    missing_vars = [var for var in required_env_vars if not os.environ.get(var)]
    
    if missing_vars:
        logger.warning(f"Missing environment variables: {', '.join(missing_vars)}")
        logger.warning("Some features may not work properly")
    
    app.run(debug=True, host='0.0.0.0', port=5000)