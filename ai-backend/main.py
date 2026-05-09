from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re

app = FastAPI(title="ApexCare Production AI Triage")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SymptomRequest(BaseModel):
    symptoms: str

class ConditionProbability(BaseModel):
    name: str
    confidence: int

class SymptomResponse(BaseModel):
    condition: str
    confidence: int
    primaryCondition: ConditionProbability
    secondaryConditions: list[ConditionProbability]
    cannotRuleOut: list[str]
    reasoning: str
    warningSigns: list[str]
    recoveryTimeline: str
    recommendedTests: list[str]
    urgency: str
    severity: str
    extractedSymptoms: list[str]
    recommendedActions: list[str]
    emergency: bool
    specialist: str
    summary: str

KNOWN_SYMPTOMS = [
    "headache", "migraine", "nausea", "vomiting", "diarrhea", "fever", "chills", "sweating",
    "cough", "sore throat", "runny nose", "congestion", "fatigue", "tiredness", "weakness",
    "dizziness", "fainting", "chest pain", "palpitations", "shortness of breath", "breathing difficulty",
    "wheezing", "stomach pain", "abdominal pain", "bloating", "heartburn", "acid reflux",
    "rash", "hives", "itching", "swelling", "redness", "joint pain", "muscle ache", "spasm",
    "stiffness", "numbness", "tingling", "bleeding", "bruising", "confusion", "memory loss",
    "anxiety", "panic", "depression", "insomnia", "light sensitivity", "sound sensitivity"
]

BODY_PARTS = [
    "head", "neck", "shoulder", "arm", "elbow", "wrist", "hand", "finger", "thumb",
    "chest", "back", "lower back", "spine", "stomach", "abdomen", "pelvis", "hip",
    "leg", "thigh", "knee", "calf", "ankle", "foot", "toe", "eye", "ear", "nose", "throat", "skin"
]

EMERGENCY_GLOBAL_KEYWORDS = [
    "unconscious", "seizure", "severe bleeding", "stroke", "heart attack", "cannot breathe", "gasping"
]

CATEGORIES = {
    "Cardiac Condition": {
        "keywords": ["heart", "palpitations", "left arm", "chest tightness", "chest pressure"],
        "escalation_keywords": ["chest pain", "shortness of breath", "fainting", "sweating"],
        "specialist": "Cardiologist",
        "base_severity": "High Risk",
        "base_urgency": "Urgent consultation recommended",
        "actions": [
            "Sit down and rest immediately.",
            "Take prescribed heart medication if applicable.",
            "Seek immediate medical evaluation.",
            "Do not drive yourself to the hospital."
        ],
        "tests": ["ECG / EKG", "Troponin Blood Test", "Stress Test"],
        "recovery": "Varies by diagnosis",
        "warnings": ["Pain spreads to jaw or neck", "Nausea or cold sweat", "Sudden weakness"],
        "cannot_rule_out_base": ["Angina", "Myocardial Ischemia"]
    },
    "Orthopedic Injury": {
        "keywords": ["twisted", "sprain", "swelling", "pain", "fell", "hit", "injury", "ankle", "knee", "wrist", "shoulder"],
        "escalation_keywords": ["broken", "fracture", "heard a crack", "bone sticking out", "cannot walk", "deformity", "snap", "unable to walk"],
        "specialist": "Orthopedic Surgeon",
        "base_severity": "Moderate",
        "base_urgency": "Visit doctor in 24 hours",
        "actions": [
            "Immobilize the affected limb.",
            "Apply ice for 15-20 minutes every hour.",
            "Elevate the injury above heart level.",
            "Avoid putting weight on the area."
        ],
        "tests": ["X-ray", "MRI for ligament assessment", "CT Scan if complex"],
        "recovery": "2-6 weeks depending on severity",
        "warnings": ["Numbness or tingling develops", "Severe bruising spreads", "Limb becomes cold or pale", "Unable to stand"],
        "cannot_rule_out_base": ["Ligament Tear", "Stress Fracture"]
    },
    "Neurological / Migraine": {
        "keywords": ["headache", "migraine", "aura", "throbbing head", "pounding"],
        "escalation_keywords": ["light sensitivity", "vomiting", "sound sensitivity", "confusion", "slurred speech"],
        "specialist": "Neurologist",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "actions": [
            "Rest in a quiet, dark room.",
            "Apply a cold compress to the forehead.",
            "Hydrate and avoid bright screens.",
            "Take over-the-counter pain relievers."
        ],
        "tests": ["MRI / CT Brain", "Neurological Exam"],
        "recovery": "12-48 hours per episode",
        "warnings": ["Sudden vision changes", "Severe stiff neck", "Weakness on one side of body"],
        "cannot_rule_out_base": ["Tension Headache", "Cluster Headache"]
    },
    "Respiratory Condition": {
        "keywords": ["cough", "congestion", "runny nose", "phlegm", "wheezing"],
        "escalation_keywords": ["difficulty breathing", "shortness of breath", "blue lips", "high fever"],
        "specialist": "Pulmonologist",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "actions": [
            "Sit upright to ease breathing.",
            "Use a humidifier or steam.",
            "Monitor oxygen levels if possible.",
            "Rest and increase fluids."
        ],
        "tests": ["Chest X-ray", "Pulmonary Function Test", "Blood Oxygen Test"],
        "recovery": "1-3 weeks",
        "warnings": ["Breathing worsens significantly", "High fever persists", "Coughing up blood"],
        "cannot_rule_out_base": ["Bronchitis", "Pneumonia"]
    },
    "Dermatological Issue": {
        "keywords": ["rash", "itching", "redness", "skin", "dryness"],
        "escalation_keywords": ["hives", "swelling face", "swollen lips", "anaphylaxis", "blistering"],
        "specialist": "Dermatologist",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "actions": [
            "Apply soothing lotion or hydrocortisone.",
            "Avoid scratching the area.",
            "Identify and remove potential allergens.",
            "Take oral antihistamines."
        ],
        "tests": ["Skin Biopsy", "Allergy Patch Test"],
        "recovery": "3-10 days",
        "warnings": ["Rash spreads rapidly", "Difficulty swallowing", "Blisters start oozing"],
        "cannot_rule_out_base": ["Contact Dermatitis", "Eczema Flare-up"]
    }
}

def extract_terms(text: str, term_list: list[str]) -> list[str]:
    extracted = []
    for term in term_list:
        if re.search(r'\b' + re.escape(term) + r'\b', text):
            extracted.append(term)
    return extracted

@app.post("/analyze-symptoms", response_model=SymptomResponse)
async def analyze_symptoms(request: SymptomRequest):
    text = request.symptoms.lower()
    
    extracted_sym = extract_terms(text, KNOWN_SYMPTOMS)
    extracted_bp = extract_terms(text, BODY_PARTS)
    
    if len(text.split()) < 3 and not extracted_sym and not extracted_bp:
        return SymptomResponse(
            condition="Unclear Input", confidence=0,
            primaryCondition=ConditionProbability(name="Unclear Input", confidence=0),
            secondaryConditions=[], cannotRuleOut=["Nonsense Input"],
            reasoning="The provided description is too brief to perform a reliable triage. Please describe your symptoms and any relevant body parts.",
            warningSigns=["Sudden worsening of health", "New acute pain"],
            recoveryTimeline="N/A", recommendedTests=["Initial physician consultation"],
            urgency="Monitor at home", severity="Mild", extractedSymptoms=[],
            recommendedActions=["Submit a more detailed description.", "Mention when symptoms started."],
            emergency=False, specialist="General Physician", summary="Insufficient data for analysis."
        )

    # Global emergency check
    is_critical_emergency = any(kw in text for kw in EMERGENCY_GLOBAL_KEYWORDS)
    
    category_matches = []
    for name, data in CATEGORIES.items():
        base_hits = sum(1 for kw in data["keywords"] if re.search(r'\b' + re.escape(kw) + r'\b', text))
        escalation_hits = sum(1 for kw in data["escalation_keywords"] if re.search(r'\b' + re.escape(kw) + r'\b', text))
        
        if base_hits > 0 or escalation_hits > 0:
            score = (base_hits * 1) + (escalation_hits * 3)
            # Body part boost
            if name == "Orthopedic Injury" and any(bp in ["ankle", "knee", "wrist", "shoulder", "bone"] for bp in extracted_bp):
                score += 2
            if name == "Cardiac Condition" and "chest" in extracted_bp:
                score += 2
            if name == "Neurological / Migraine" and "head" in extracted_bp:
                score += 1
                
            category_matches.append({"name": name, "score": score, "data": data, "escalated": escalation_hits > 0})

    category_matches.sort(key=lambda x: x["score"], reverse=True)
    
    if not category_matches:
        return SymptomResponse(
            condition="Atypical Presentation", confidence=40,
            primaryCondition=ConditionProbability(name="Atypical Presentation", confidence=40),
            secondaryConditions=[], cannotRuleOut=["Various rare conditions"],
            reasoning="Your symptoms do not match our standard diagnostic categories. A professional evaluation is necessary.",
            warningSigns=["New symptoms emerge", "Existing symptoms worsen"],
            recoveryTimeline="Requires diagnosis", recommendedTests=["Full medical exam"],
            urgency="Visit doctor in 24 hours", severity="Moderate",
            extractedSymptoms=list(set(extracted_sym + extracted_bp)),
            recommendedActions=["Keep a log of symptoms.", "Avoid heavy activity."],
            emergency=False, specialist="General Physician", summary="Professional consultation recommended."
        )

    primary = category_matches[0]
    data = primary["data"]
    is_escalated = primary["escalated"] or is_critical_emergency
    
    primary_conf = min(60 + (primary["score"] * 10), 96)
    secondary_list = []
    for sec in category_matches[1:3]:
        sec_conf = min(40 + (sec["score"] * 8), primary_conf - 5)
        secondary_list.append(ConditionProbability(name=sec["name"], confidence=sec_conf))
        
    severity = data["base_severity"]
    urgency = data["base_urgency"]
    emergency = is_critical_emergency
    
    cannot_rule_out = data["cannot_rule_out_base"].copy()
    if is_escalated:
        severity = "High Risk"
        urgency = "Urgent consultation recommended"
        if primary["name"] == "Orthopedic Injury":
            cannot_rule_out.insert(0, "Fracture")
            if any(kw in text for kw in ["bone sticking out", "deformity"]):
                severity = "Critical"
                urgency = "Emergency care immediately"
                emergency = True
        if primary["name"] == "Cardiac Condition" or "chest pain" in text:
            severity = "Critical"
            urgency = "Emergency care immediately"
            emergency = True
            
    # Natural Reasoning
    sym_desc = f"the {', '.join(extracted_sym[:3])}" if extracted_sym else "these symptoms"
    bp_desc = f" in your {', '.join(extracted_bp[:2])}" if extracted_bp else ""
    
    if primary["name"] == "Orthopedic Injury":
        reasoning = f"Swelling or pain{bp_desc} after a potential trauma or twisting motion suggests a sprain or ligament injury. "
        if is_escalated:
            reasoning += "However, your report of severe pain or inability to bear weight indicates a high likelihood of a fracture that requires imaging."
    elif primary["name"] == "Cardiac Condition":
        reasoning = f"The discomfort you're feeling{bp_desc} matches patterns associated with cardiac strain. "
        if is_escalated:
            reasoning += "Reported shortness of breath or radiating pain significantly increases the clinical urgency for evaluation."
    else:
        reasoning = f"Your report of {sym_desc}{bp_desc} aligns with common presentations of {primary['name']}. "
        if is_escalated:
            reasoning += "The presence of secondary symptoms suggests a more acute episode requiring professional monitoring."

    all_ext = list(set(extracted_sym + extracted_bp))
    
    return SymptomResponse(
        condition=primary["name"],
        confidence=primary_conf,
        primaryCondition=ConditionProbability(name=primary["name"], confidence=primary_conf),
        secondaryConditions=secondary_list,
        cannotRuleOut=cannot_rule_out[:3],
        reasoning=reasoning,
        warningSigns=data["warnings"],
        recoveryTimeline=data["recovery"],
        recommendedTests=data["tests"],
        urgency=urgency,
        severity=severity,
        extractedSymptoms=all_ext,
        recommendedActions=data["actions"],
        emergency=emergency,
        specialist=data["specialist"],
        summary=f"Analysis suggests {primary['name']}. Please follow the triage guidance provided."
    )
