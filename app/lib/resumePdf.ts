import { jsPDF } from 'jspdf';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
    achievements?: string[];
  }[];
  education: {
    degree: string;
    field: string;
    institution: string;
    graduationYear: string;
    gpa?: string;
    honors?: string;
  }[];
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications?: {
    name: string;
    issuer: string;
    date: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
}

export function generateResumePDF(data: ResumeData): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add section header with underline
  const addSectionHeader = (text: string) => {
    checkPageBreak(12);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(text, margin, yPosition);
    
    // Add underline
    const textWidth = doc.getTextWidth(text);
    doc.setLineWidth(0.5);
    doc.setDrawColor(78, 107, 235);
    doc.line(margin, yPosition + 1, margin + textWidth, yPosition + 1);
    
    yPosition += 8;
  };

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [40, 40, 40], lineHeight: number = 1.2) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    if (isBold) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }
    
    const lines = doc.splitTextToSize(text, contentWidth);
    const lineSpacing = fontSize * 0.35 * lineHeight; // Convert to mm properly
    
    lines.forEach((line: string, index: number) => {
      checkPageBreak(lineSpacing + 2);
      doc.text(line, margin, yPosition);
      if (index < lines.length - 1) {
        yPosition += lineSpacing;
      }
    });
    yPosition += lineSpacing + 1; // Final spacing after last line
  };

  // Header Section - Name
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(30, 30, 30);
  const nameWidth = doc.getTextWidth(data.personalInfo.name);
  doc.text(data.personalInfo.name, margin, yPosition);
  yPosition += 10;

  // Contact Information - formatted nicely in rows
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(60, 60, 60);
  
  const contactRows: string[][] = [];
  let currentRow: string[] = [];
  let currentRowWidth = 0;
  const maxRowWidth = contentWidth;
  
  const addContactItem = (text: string) => {
    const textWidth = doc.getTextWidth(text);
    if (currentRowWidth + textWidth + 10 > maxRowWidth && currentRow.length > 0) {
      contactRows.push([...currentRow]);
      currentRow = [];
      currentRowWidth = 0;
    }
    currentRow.push(text);
    currentRowWidth += textWidth + 10;
  };
  
  addContactItem(data.personalInfo.email);
  addContactItem(`Phone: ${data.personalInfo.phone}`);
  addContactItem(`Location: ${data.personalInfo.location}`);
  if (data.personalInfo.linkedin) addContactItem(`LinkedIn: ${data.personalInfo.linkedin}`);
  if (data.personalInfo.github) addContactItem(`GitHub: ${data.personalInfo.github}`);
  if (data.personalInfo.portfolio) addContactItem(`Portfolio: ${data.personalInfo.portfolio}`);
  
  if (currentRow.length > 0) {
    contactRows.push(currentRow);
  }
  
  // Render contact rows
  contactRows.forEach((row, rowIndex) => {
    let xPos = margin;
    row.forEach((item) => {
      doc.text(item, xPos, yPosition);
      xPos += doc.getTextWidth(item) + 8;
    });
    yPosition += 5; // Consistent spacing between rows
  });
  
  yPosition += 5; // Space after contact section

  // Professional Summary
  if (data.summary) {
    addSectionHeader('PROFESSIONAL SUMMARY');
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(50, 50, 50);
    addText(data.summary, 10, false, [50, 50, 50], 1.4);
    // yPosition already updated by addText
  }

  // Experience Section
  if (data.experience && data.experience.length > 0) {
    addSectionHeader('PROFESSIONAL EXPERIENCE');

    data.experience.forEach((exp, expIndex) => {
      checkPageBreak(30);
      
      if (expIndex > 0) {
        yPosition += 2; // Space between experiences
      }
      
      // Position Title
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(exp.position, margin, yPosition);
      yPosition += 5;
      
      // Company and Date - right aligned
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(80, 80, 80);
      const companyText = exp.company;
      const dateText = `${exp.startDate} - ${exp.endDate}`;
      const dateWidth = doc.getTextWidth(dateText);
      
      doc.text(companyText, margin, yPosition);
      doc.text(dateText, pageWidth - margin - dateWidth, yPosition);
      yPosition += 5; // Consistent spacing

      // Responsibilities
      exp.responsibilities.forEach((responsibility) => {
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        
        // Bullet point
        doc.setFont(undefined, 'bold');
        doc.text('•', margin + 1, yPosition);
        doc.setFont(undefined, 'normal');
        
        // Text with proper indentation
        const lines = doc.splitTextToSize(responsibility, contentWidth - 6);
        const lineSpacing = 4.2; // Consistent line spacing in mm
        
        lines.forEach((line: string, index: number) => {
          if (index === 0) {
            // First line already at yPosition
            doc.text(line, margin + 4, yPosition);
          } else {
            yPosition += lineSpacing;
            checkPageBreak(lineSpacing);
            doc.text(line, margin + 4, yPosition);
          }
        });
        yPosition += 4; // Space after bullet point
      });

      // Achievements (if any)
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          checkPageBreak(10);
          doc.setFontSize(10);
          doc.setTextColor(78, 107, 235);
          doc.setFont(undefined, 'bold');
          doc.text('✓', margin + 1, yPosition);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(50, 50, 50);
          const lines = doc.splitTextToSize(achievement, contentWidth - 6);
          const lineSpacing = 4.2; // Consistent line spacing in mm
          
          lines.forEach((line: string, index: number) => {
            if (index === 0) {
              // First line already at yPosition
              doc.text(line, margin + 4, yPosition);
            } else {
              yPosition += lineSpacing;
              checkPageBreak(lineSpacing);
              doc.text(line, margin + 4, yPosition);
            }
          });
          yPosition += 4; // Space after achievement
        });
      }

      yPosition += 2;
    });
  }

  // Education Section
  if (data.education && data.education.length > 0) {
    addSectionHeader('EDUCATION');

    data.education.forEach((edu) => {
      checkPageBreak(12);
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
      yPosition += 5;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(80, 80, 80);
      
      const eduDetails = [
        edu.institution,
        edu.graduationYear,
        ...(edu.gpa ? [`GPA: ${edu.gpa}`] : []),
        ...(edu.honors ? [edu.honors] : [])
      ];
      
      doc.text(eduDetails.join(' | '), margin, yPosition);
      yPosition += 7;
    });
  }

  // Skills Section
  if (data.skills) {
    addSectionHeader('SKILLS');

    if (data.skills.technical && data.skills.technical.length > 0) {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text('Technical Skills:', margin, yPosition);
      yPosition += 5;
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      const techSkills = data.skills.technical.join(' • ');
      addText(techSkills, 10, false, [60, 60, 60], 1.3);
    }

    if (data.skills.soft && data.skills.soft.length > 0) {
      if (data.skills.technical && data.skills.technical.length > 0) {
        yPosition += 3; // Space between skill types
      }
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text('Soft Skills:', margin, yPosition);
      yPosition += 5;
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      const softSkills = data.skills.soft.join(' • ');
      addText(softSkills, 10, false, [60, 60, 60], 1.3);
    }
    // yPosition already updated by addText
  }

  // Certifications Section
  if (data.certifications && data.certifications.length > 0) {
    addSectionHeader('CERTIFICATIONS');

    data.certifications.forEach((cert) => {
      checkPageBreak(8);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`${cert.name}`, margin, yPosition);
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`${cert.issuer} | ${cert.date}`, margin, yPosition + 4);
      yPosition += 7;
    });
  }

  // Projects Section
  if (data.projects && data.projects.length > 0) {
    addSectionHeader('PROJECTS');

    data.projects.forEach((project, projIndex) => {
      checkPageBreak(20);
      
      if (projIndex > 0) {
        yPosition += 2;
      }
      
      // Project Name
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(project.name, margin, yPosition);
      yPosition += 5;
      
      // Project URL if available
      if (project.url) {
        doc.setFontSize(9);
        doc.setTextColor(78, 107, 235);
        doc.setFont(undefined, 'normal');
        doc.text(project.url, margin, yPosition);
        yPosition += 5;
      }
      
      // Project Description
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50, 50, 50);
      addText(project.description, 10, false, [50, 50, 50], 1.4);
      
      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        checkPageBreak(5);
        doc.text(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition);
        yPosition += 5;
      }
      yPosition += 1; // Small space after project
    });
  }

  return doc.output('blob');
}

