# 🤖 AI Usage Guide

## Which AI is Being Used?

This project uses **Claude 3.7 Sonnet** (Anthropic's AI model) through the **Puter.js SDK**.

### AI Model Details:
- **Model**: `claude-3-7-sonnet`
- **Provider**: Anthropic (via Puter.com)
- **Access**: Through Puter.js SDK (no direct API keys needed)
- **Usage**: 
  - Resume analysis and feedback
  - Career details parsing and structuring
  - ATS scoring and recommendations

### Where It's Used:
1. **Resume Analyzer** (`/upload` route)
   - Analyzes uploaded PDF resumes
   - Provides ATS scores and feedback
   - Compares skills with job requirements

2. **Resume Builder** (`/builder` route)
   - Parses career details from paragraph text
   - Structures data into resume format
   - Extracts all relevant information

---

## ⚠️ What to Do If You've Reached the AI Limit

### Understanding the Limit

The AI usage limit is set by **Puter.com**, not by this application. Puter.com provides free and paid tiers with different usage limits.

### Immediate Steps:

#### 1. **Wait and Retry** ⏰
   - Usage limits are often **time-based** (daily/monthly)
   - Wait a few minutes or hours and try again
   - Limits typically reset at the start of a new billing period

#### 2. **Check Your Puter.com Account** 🔍
   - Visit [Puter.com](https://puter.com) and sign in
   - Go to your account settings/dashboard
   - Check your current usage and limits
   - See when your limit will reset

#### 3. **Upgrade Your Account** 💳
   - If you need more AI requests, consider upgrading
   - Puter.com offers different tiers:
     - **Free Tier**: Limited requests per day/month
     - **Paid Tiers**: Higher limits and more features
   - Check Puter.com pricing for current plans

#### 4. **Use Alternative Methods** 🔄
   - **Resume Builder**: You can manually structure your resume data
   - **Resume Analyzer**: Review resumes manually or use other tools
   - Save AI requests for when you really need them

---

## 📊 How to Check Your Usage

### Method 1: Puter.com Dashboard
1. Go to [puter.com](https://puter.com)
2. Sign in with your account
3. Navigate to **Account Settings** or **Usage Dashboard**
4. View:
   - Current usage count
   - Remaining requests
   - Reset date/time
   - Plan details

### Method 2: Check Error Messages
- The application will show clear error messages when limits are reached
- Error messages include:
  - "AI Usage Limit Reached"
  - Suggestions on what to do next

---

## 🔧 Troubleshooting

### Common Issues:

#### Issue: "You have reached your AI usage limit"
**Solution:**
- Wait for the limit to reset (usually daily or monthly)
- Check your Puter.com account for exact reset time
- Consider upgrading if you need more requests

#### Issue: Error persists after waiting
**Solution:**
- Clear browser cache and cookies
- Sign out and sign back into Puter.com
- Check Puter.com status page for service issues
- Contact Puter.com support if problem continues

#### Issue: Need more AI requests immediately
**Solution:**
- Upgrade your Puter.com account plan
- Use the application during off-peak hours
- Optimize usage by combining multiple tasks

---

## 💡 Tips to Optimize AI Usage

### 1. **Batch Your Requests**
   - Prepare multiple resumes at once
   - Analyze them in one session
   - Reduces overhead

### 2. **Use Resume Builder Efficiently**
   - Provide complete, detailed career information
   - Include all relevant details in one submission
   - Reduces need for multiple parsing attempts

### 3. **Review Before Re-submitting**
   - Check your input before submitting
   - Ensure PDFs are readable and complete
   - Avoid unnecessary re-analyses

### 4. **Save Results**
   - Download and save analysis results
   - Keep resume previews
   - Reduces need to re-analyze the same resume

---

## 🔄 Alternative Solutions

### If You Can't Use AI Right Now:

#### For Resume Analysis:
1. **Manual Review**: Review your resume yourself
2. **ATS Checkers**: Use free online ATS checkers
3. **Peer Review**: Ask colleagues or mentors
4. **Professional Services**: Consider paid resume review services

#### For Resume Building:
1. **Manual Entry**: Use the preview/edit feature to manually structure data
2. **Templates**: Use resume templates from other sources
3. **Resume Builders**: Use other free resume builder tools
4. **Word Processors**: Create resumes in Word/Google Docs

---

## 📞 Getting Help

### Puter.com Support:
- **Website**: [puter.com](https://puter.com)
- **Documentation**: Check Puter.com docs for usage limits
- **Support**: Contact Puter.com support for account issues

### Application Issues:
- Check the error message displayed in the app
- Review this guide for common solutions
- Ensure you're signed into Puter.com correctly

---

## 🎯 Summary

**AI Model**: Claude 3.7 Sonnet (via Puter.js)

**When Limit Reached**:
1. ✅ Wait for reset (usually daily/monthly)
2. ✅ Check Puter.com account dashboard
3. ✅ Consider upgrading account
4. ✅ Use alternative methods temporarily

**Best Practice**: Monitor your usage and plan accordingly to avoid hitting limits during important tasks.

---

*Last Updated: Based on current Puter.js implementation*

