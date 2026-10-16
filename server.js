/**
 * server.js - Backend server for AI Symptom Checker
 * Built with Express.js for Node.js
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Reviewed Educational Sample Content Database
 */
const symptomDatabase = {
  headache: {
    title: "Headache / Tension",
    summary: "Common causes include tension, dehydration, stress, lack of sleep, or prolonged screen time.",
    guidance: "Rest in a quiet, dark room, stay hydrated, and practice relaxation. If headache is sudden, severe, or accompanied by confusion or fever, seek emergency medical care immediately.",
    urgent: false
  },
  sore_throat: {
    title: "Sore Throat",
    summary: "Often associated with viral infections like the commoncold, pharyngitis, or environmental irritants.",
    guidance: "Gargle with warm salt water, stay hydrated with warm liquids, and rest your voice. Consult a doctor if symptoms persist past 5 days.",
    urgent: false
  },
  runny_nose: {
    title: "Runny Nose / Nasal Congestion",
    summary: "Typically caused by allergic rhinitis, viral upper respiratory infections, or changes in weather.",
    guidance: "Use saline nasal sprays, stay hydrated, and get adequate rest.",
    urgent: false
  },
  cough: {
    title: "Cough / Mild Respiratory Irritation",
    summary: "Often associated with common colds, allergies, or viral bronchitis.",
    guidance: "Stay hydrated with warm liquids and rest. Seek medical attention if you experience difficulty breathing or chest pain.",
    urgent: false
  },
  fever: {
    title: "Elevated Temperature / Fever",
    summary: "Fever is typically the body's natural defense mechanism fighting off an infection.",
    guidance: "Rest, drink plenty of fluids to avoid dehydration, and monitor your temperature. Consult a doctor if fever persists for more than 3 days or exceeds 103°F (39.4°C).",
    urgent: false
  },
  tiredness: {
    title: "Fatigue / General Tiredness",
    summary: "Can result from inadequate sleep, stress, poor nutrition, or minor viral illnesses.",
    guidance: "Prioritize consistent sleep schedules and balanced nutrition. If chronic, speak with a healthcare professional.",
    urgent: false
  },
  nausea: {
    title: "Nausea / Stomach Discomfort",
    summary: "May be triggered by dietary indiscretion, mild gastroenteritis, stress, or motion sickness.",
    guidance: "Sip clear fluids, avoid heavy or greasy foods, and rest.",
    urgent: false
  },
  stomach_pain: {
    title: "Stomach Discomfort / Pain",
    summary: "Often related to indigestion, gas, or mild dietary irritation.",
    guidance: "Eat bland foods and stay hydrated. Seek medical care if pain is sharp, localized, or persistent.",
    urgent: false
  },
  chest_pain: {
    title: "Chest Discomfort / Pain (URGENT WARNING SIGN)",
    summary: "Chest discomfort can be related to muscular strain, acid reflux, or potentially serious cardiac conditions.",
    guidance: "CRITICAL: Chest pain must always be evaluated promptly. Seek emergency medical services or go to the nearest emergency room immediately.",
    urgent: true
  }
};

/**
 * Health-Check Endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'AI Symptom Checker backend is running normally.' });
});

/**
 * Symptom Information Endpoint
 */
app.post('/api/check-symptoms', (req, res) => {
  const { symptom, duration, severity, description } = req.body;

  if (!symptom || !duration || !severity) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide at least a symptom, duration, and severity level.'
    });
  }

  // Fallback if symptom key doesn't match directly
  const normalizedKey = symptom.replace(/-/g, '_');
  const symptomRecord = symptomDatabase[normalizedKey] || {
    title: symptom,
    summary: "General symptom reported for educational review.",
    guidance: "Monitor your symptoms closely and consult a healthcare professional if they worsen.",
    urgent: severity === 'severe'
  };

  const responsePayload = {
    status: 'success',
    timestamp: new Date().toISOString(),
    inputSummary: {
      symptom: symptomRecord.title,
      duration: duration,
      severity: severity,
      description: description ? description.substring(0, 250) : 'None provided'
    },
    educationalInfo: {
      summary: symptomRecord.summary,
      guidance: symptomRecord.guidance,
      urgent: symptomRecord.urgent
    },
    disclaimer: "Educational prototype only. This information does not constitute medical diagnosis, treatment, or professional advice."
  };

  return res.json(responsePayload);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running successfully at http://localhost:${PORT}`);
});