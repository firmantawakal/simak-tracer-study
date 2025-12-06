# Simak Tracer Study - Survey System Tutorial

This tutorial explains how to use the survey system for both survey administrators and respondents.

## 📋 Table of Contents

1. [Overview](#overview)
2. [For Survey Administrators](#for-survey-administrators)
3. [For Survey Respondents](#for-survey-respondents)
4. [Survey Question Types](#survey-question-types)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Simak Tracer Study Survey System allows:
- **Administrators**: Create, manage, and analyze surveys
- **Respondents**: Fill out surveys without requiring tokens or authentication
- **Public Access**: Anyone with the survey link can participate

## 👨‍💼 For Survey Administrators

### Creating a New Survey

1. **Access Admin Panel**
   - Go to `http://localhost:3001/login`
   - Login with your administrator credentials

2. **Navigate to Survey Management**
   - Click on "Survei" in the admin menu
   - Click the "Buat Survei" button

3. **Fill in Survey Details**
   ```
   Judul*: Required field - The survey title
   Deskripsi: Optional - Brief explanation of the survey purpose
   Batas Waktu: Optional - Set a deadline for survey completion
   Status Survei: Toggle to enable/disable the survey
   ```

4. **Add Questions**
   - Click "Tambah Pertanyaan" to add new questions
   - For each question, specify:
     - Question text (required)
     - Question type (see [Question Types](#survey-question-types))
     - Required/optional status
     - Options (for multiple choice questions)

5. **Save the Survey**
   - Click "Buat Survei" to publish
   - The survey will be immediately available at `/surveys/[survey-id]`

### Managing Existing Surveys

1. **Edit Survey**
   - Click the pencil icon next to any survey in the list
   - Modify title, description, questions, or settings
   - Click "Perbarui Survei" to save changes

2. **Delete Survey**
   - Click the trash icon next to any survey
   - Confirm the deletion (this also removes all responses)
   - ⚠️ **Warning**: This action cannot be undone

3. **Generate Tokens (Optional)**
   - Click the users icon to generate tokens for alumni
   - This sends email invitations to all alumni
   - Each token expires after 7 days

### Viewing Survey Responses

1. **Access Responses**
   - Navigate to "Responses" in the admin menu
   - View all submitted survey responses
   - Filter by survey, date range, or respondent

## 👤 For Survey Respondents

### Accessing Surveys

1. **Visit Survey List**
   - Go to `http://localhost:3001/surveys`
   - Browse all available active surveys

2. **Or Direct Access**
   - If you have a specific survey link, visit it directly
   - Format: `http://localhost:3001/surveys/[survey-id]`

### Filling Out a Survey

1. **Survey Information**
   - Read the survey title and description
   - Note any deadline information
   - Check the number of questions

2. **Provide Personal Information**
   ```
   Nama Lengkap*: Your full name
   Email*: Your email address (used to prevent duplicates)
   Tahun Lulus*: Your graduation year
   Jurusan*: Your major/program of study
   ```

3. **Answer Questions**
   - Complete all required questions (marked with *)
   - Optional questions can be left blank
   - Different question types have different input methods

4. **Submit Survey**
   - Click "Kirim Jawaban" to submit
   - Wait for the confirmation message
   - You'll receive a success confirmation

### Important Notes

- **One Submission Per Email**: You can only submit each survey once per email address
- **Save Progress**: There's no auto-save, complete the survey in one session
- **Deadline Awareness**: Some surveys have deadlines, check before starting

## 📝 Survey Question Types

### 1. Text Input (Teks Pendek)
- **Purpose**: Short text answers
- **Examples**: Name, Company, Position
- **Character Limit**: Single line text input
- **Validation**: Required/optional based on survey settings

### 2. Text Area (Teks Panjang)
- **Purpose**: Long-form text responses
- **Examples**: Comments, Suggestions, Detailed Feedback
- **Character Limit**: Multi-line text input
- **Features**: Scrollable area for longer responses

### 3. Multiple Choice (Pilihan Ganda)
- **Purpose**: Single answer from predefined options
- **Examples**: Employment Status, Satisfaction Level
- **Format**: Radio buttons, single selection only
- **Configuration**: Add as many options as needed

### 4. Rating Scale (Rating)
- **Purpose**: Numeric evaluation (1-5 scale)
- **Examples**: Satisfaction, Relevance, Quality
- **Format**: Visual numbered buttons (1, 2, 3, 4, 5)
- **Labels**:
  - 1 = Very Poor/Lowest
  - 5 = Excellent/Highest

## 🎯 Best Practices

### For Administrators

1. **Survey Design**
   - Keep surveys concise (max 15-20 questions)
   - Use clear, simple language
   - Group related questions together
   - Test your survey before publishing

2. **Question Writing**
   - Be specific and unambiguous
   - Avoid double-barreled questions
   - Use consistent rating scales
   - Include "Other" options when appropriate

3. **Survey Management**
   - Set appropriate deadlines
   - Monitor response rates
   - Send reminders if needed
   - Analyze results regularly

### For Respondents

1. **Before Starting**
   - Ensure you have enough time (10-15 minutes typically)
   - Read all instructions carefully
   - Use a reliable internet connection

2. **During Survey**
   - Answer honestly and thoughtfully
   - Don't rush through questions
   - If unsure, provide your best estimate
   - Use the comments section for additional feedback

3. **After Submission**
   - Keep a record of your submission date
   - Note any confirmation numbers
   - Contact admin if you encounter issues

## 🔧 Troubleshooting

### Common Issues

1. **Survey Not Loading**
   - **Solution**: Check your internet connection, refresh the page
   - **Alternative**: Try a different browser

2. **Form Validation Errors**
   - **Solution**: Complete all required fields (marked with *)
   - **Check**: Email format, graduation year (valid numbers)

3. **Duplicate Submission Error**
   - **Cause**: Same email already submitted this survey
   - **Solution**: Use a different email or contact administrator

4. **Survey Deadline Passed**
   - **Solution**: Contact survey administrator
   - **Alternative**: Wait for survey extension (if planned)

5. **Page Not Found**
   - **Cause**: Survey may be inactive or link is incorrect
   - **Solution**: Go to `/surveys` to find available surveys

### Getting Help

If you encounter persistent issues:

1. **For Respondents**:
   - Contact your survey administrator
   - Provide details: error message, browser type, survey link

2. **For Administrators**:
   - Check server logs
   - Verify survey is active
   - Test with a different browser
   - Review API endpoints if technical issues

### System Requirements

**For Optimal Experience:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled
- Minimum screen resolution: 768px width

**Mobile Compatibility:**
- Responsive design works on smartphones and tablets
- Recommended: Use landscape orientation for complex forms
- Touch-friendly interface elements

## 📊 Data Privacy

- **Email Protection**: Email addresses are used only for duplicate prevention
- **Data Security**: All responses are stored securely
- **Anonymity**: Survey responses can be analyzed anonymously
- **Data Usage**: Responses used only for institutional improvement

## 🔄 Updates and Maintenance

The survey system is regularly updated. Check for:
- New question types
- Enhanced user interface
- Additional security features
- Performance improvements

For the latest features and documentation, visit the system admin panel or contact the development team.

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Support**: Contact your system administrator for technical assistance