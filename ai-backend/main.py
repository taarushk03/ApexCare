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
    riskJustification: str  # New field
    bodyRegion: str        # New field (head, chest, abdomen, legs, arms, etc)
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
    possibleCauses: list[str]  # New field

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
        "escalation_keywords": ["chest pain", "shortness of breath", "fainting", "sweating", "radiating pain"],
        "specialist": "Cardiologist",
        "base_severity": "High Risk",
        "base_urgency": "Urgent consultation recommended",
        "body_region": "chest",
        "causes": ["Myocardial strain", "Ischemic event", "Arrhythmia", "Chest wall inflammation"],
        "specific_conditions": [
            {"name": "Acute Coronary Syndrome", "trigger": ["chest pain", "sweating"], "conf": 85},
            {"name": "Paroxysmal Tachycardia", "trigger": ["palpitations", "dizziness"], "conf": 70},
            {"name": "Anginal Presentation", "trigger": ["chest tightness"], "conf": 65}
        ],
        "actions": [
            "Sit down and rest in a comfortable position immediately.",
            "Take aspirin if prescribed and not allergic.",
            "Monitor for pain spreading to jaw or left arm.",
            "Contact emergency services if pain persists beyond 5 minutes."
        ],
        "tests": ["12-Lead ECG (Electrocardiogram)", "Cardiac Troponin T-Test", "Echocardiogram"],
        "recovery": "Requires specialized clinical monitoring",
        "warnings": ["Pain spreading to jaw or left arm", "Sudden cold sweat and nausea", "Fainting or severe lightheadedness"],
        "cannot_rule_out_base": ["Myocardial Infarction", "Angina Pectoris", "Pericarditis"]
    },
    "Orthopedic Injury": {
        "keywords": ["twisted", "sprain", "swelling", "pain", "fell", "hit", "injury", "ankle", "knee", "wrist", "shoulder"],
        "escalation_keywords": ["broken", "fracture", "heard a crack", "bone sticking out", "cannot walk", "deformity", "snap", "unable to walk", "pop"],
        "specialist": "Orthopedic Surgeon",
        "base_severity": "Moderate",
        "base_urgency": "Visit doctor in 24 hours",
        "body_region": "extremities",
        "causes": ["Ligament strain", "Joint sprain", "Soft tissue trauma", "Possible fracture pattern"],
        "specific_conditions": [
            {"name": "Possible Ankle Sprain", "trigger": ["ankle", "twisted"], "conf": 82},
            {"name": "Suspected Ligament Strain", "trigger": ["pop", "instability", "swelling"], "conf": 75},
            {"name": "Possible Fracture Pattern", "trigger": ["crack", "snap", "deformity"], "conf": 85},
            {"name": "Acute Trauma-Related Injury", "trigger": ["fell", "hit"], "conf": 65}
        ],
        "actions": [
            "Implement R.I.C.E: Rest, Ice, Compression, Elevation.",
            "Avoid all weight-bearing on the affected limb.",
            "Apply a temporary splint or compression wrap.",
            "Elevate the limb above the level of the heart."
        ],
        "tests": ["Digital X-Ray", "MRI if ligament damage suspected", "Physical Examination"],
        "recovery": "Mild: 1-3 weeks | Moderate: 4-8 weeks",
        "warnings": ["Inability to bear weight", "Visible deformity or misalignment", "Numbness in the extremity", "Rapidly increasing swelling"],
        "cannot_rule_out_base": ["Complex Fracture", "High Ankle Sprain", "Tendon Rupture"]
    },
    "Neurological / Migraine": {
        "keywords": ["headache", "migraine", "aura", "throbbing head", "pounding"],
        "escalation_keywords": ["light sensitivity", "vomiting", "sound sensitivity", "confusion", "slurred speech", "vision loss"],
        "specialist": "Neurologist",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "body_region": "head",
        "causes": ["Migraine trigger", "Vascular changes", "Tension", "Neuralgic pain"],
        "specific_conditions": [
            {"name": "Migraine Episode", "trigger": ["vision", "light", "throbbing"], "conf": 88},
            {"name": "Acute Tension Headache", "trigger": ["pounding", "stress"], "conf": 70},
            {"name": "Cluster Headache Presentation", "trigger": ["eye", "sharp"], "conf": 60}
        ],
        "actions": [
            "Rest in a quiet, dark, and cool environment.",
            "Prioritize hydration with water and electrolytes.",
            "Apply a cool compress to the forehead or neck.",
            "Avoid bright screens and loud noises."
        ],
        "tests": ["Neurological Evaluation", "Vision Assessment", "Brain MRI (if persistent)"],
        "recovery": "Several hours to 48 hours",
        "warnings": ["Sudden 'thunderclap' headache", "Confusion or speech difficulty", "Weakness on one side", "Vision loss"],
        "cannot_rule_out_base": ["Chronic Migraine", "Secondary Headache", "Intracranial Pressure Issue"]
    },
    "Fever / Viral Syndrome": {
        "keywords": ["fever", "chills", "aches", "flu", "virus", "sweating", "tired"],
        "escalation_keywords": ["high fever", "confusion", "stiff neck", "difficulty breathing", "persistent vomiting"],
        "specialist": "General Physician",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "body_region": "systemic",
        "causes": ["Viral infection", "Immune response", "Systemic inflammation", "Seasonal illness"],
        "specific_conditions": [
            {"name": "Viral Syndrome", "trigger": ["fever", "aches"], "conf": 85},
            {"name": "Influenza-Like Illness", "trigger": ["flu", "chills"], "conf": 80},
            {"name": "Acute Febrile Illness", "trigger": ["fever", "sweating"], "conf": 75}
        ],
        "actions": [
            "Maintain strict hydration with plenty of fluids.",
            "Prioritize bed rest and limit physical activity.",
            "Monitor body temperature every 4-6 hours.",
            "Use antipyretics for fever-related discomfort."
        ],
        "tests": ["Rapid Viral Panel", "Complete Blood Count (CBC)", "Temperature Log"],
        "recovery": "3–10 days depending on strain",
        "warnings": ["Fever persistently above 103°F", "Stiff neck and severe headache", "Difficulty breathing", "Extreme lethargy"],
        "cannot_rule_out_base": ["Bacterial Infection", "Common Cold", "Post-Viral Fatigue"]
    },
    "Respiratory Condition": {
        "keywords": ["cough", "congestion", "runny nose", "phlegm", "wheezing"],
        "escalation_keywords": ["difficulty breathing", "shortness of breath", "blue lips", "high fever", "chest pain while breathing"],
        "specialist": "Pulmonologist",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "body_region": "chest",
        "causes": ["Respiratory inflammation", "Viral shedding", "Airway hypersensitivity", "Mucosal congestion"],
        "specific_conditions": [
            {"name": "Acute Bronchitis", "trigger": ["cough", "phlegm"], "conf": 80},
            {"name": "Reactive Airway Flare-up", "trigger": ["wheezing", "tightness"], "conf": 75},
            {"name": "Upper Respiratory Tract Infection", "trigger": ["runny nose", "sore throat"], "conf": 85}
        ],
        "actions": [
            "Stay hydrated to thin mucus secretions.",
            "Use a humidifier or warm steam inhalation.",
            "Maintain an upright position for better airflow.",
            "Monitor oxygen levels if a pulse-ox is available."
        ],
        "tests": ["Chest X-Ray (PA/Lateral)", "Spirometry", "Blood Oxygen Analysis"],
        "recovery": "7–14 days",
        "warnings": ["Blue tint to lips or nails", "Gasping for air (air hunger)", "High fever", "Coughing up blood"],
        "cannot_rule_out_base": ["Pneumonia", "Pleurisy", "Bronchiolitis"]
    },
    "Dermatological Issue": {
        "keywords": ["rash", "itching", "redness", "skin", "dryness"],
        "escalation_keywords": ["hives", "swelling face", "swollen lips", "anaphylaxis", "blistering", "spreading rapidly"],
        "specialist": "Dermatologist",
        "base_severity": "Mild",
        "base_urgency": "Monitor at home",
        "body_region": "skin",
        "causes": ["Allergic reaction", "Contact irritant", "Inflammatory skin response", "Fungal or viral rash"],
        "specific_conditions": [
            {"name": "Contact Dermatitis", "trigger": ["rash", "touch"], "conf": 82},
            {"name": "Acute Urticaria (Hives)", "trigger": ["itching", "bumps"], "conf": 78},
            {"name": "Eczematous Flare", "trigger": ["dryness", "chronic"], "conf": 70}
        ],
        "actions": [
            "Apply soothing calamine or hydrocortisone.",
            "Identify and remove potential allergens or irritants.",
            "Take an antihistamine for persistent itching.",
            "Avoid hot water or harsh soaps on the area."
        ],
        "tests": ["Allergy Patch Testing", "Skin Biopsy (if needed)", "Dermatoscopic Exam"],
        "recovery": "3–10 days",
        "warnings": ["Swelling of face, lips, or tongue", "Difficulty swallowing or speaking", "Rapidly spreading purple or blistering rash"],
        "cannot_rule_out_base": ["Anaphylaxis", "Atopic Dermatitis", "Skin Infection"]
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
            condition="Inconclusive Analysis", confidence=0,
            primaryCondition=ConditionProbability(name="Inconclusive Analysis", confidence=0),
            secondaryConditions=[], cannotRuleOut=[],
            reasoning="Insufficient data for a clinical correlation.",
            riskJustification="Risk cannot be assessed due to lack of descriptive details.",
            bodyRegion="systemic", warningSigns=[], recoveryTimeline="Unknown",
            recommendedTests=["Professional consultation required"], urgency="Indeterminate",
            severity="Indeterminate", extractedSymptoms=[], recommendedActions=["Provide more details on symptoms and onset."],
            emergency=False, specialist="General Practitioner", summary="Detailed report required.",
            possibleCauses=[]
        )

    is_critical_emergency = any(kw in text for kw in EMERGENCY_GLOBAL_KEYWORDS)
    
    category_matches = []
    for name, data in CATEGORIES.items():
        base_hits = sum(1 for kw in data["keywords"] if re.search(r'\b' + re.escape(kw) + r'\b', text))
        escalation_hits = sum(1 for kw in data["escalation_keywords"] if re.search(r'\b' + re.escape(kw) + r'\b', text))
        
        if base_hits > 0 or escalation_hits > 0:
            score = (base_hits * 2) + (escalation_hits * 5)
            category_matches.append({"name": name, "score": score, "data": data, "escalated": escalation_hits > 0})

    category_matches.sort(key=lambda x: x["score"], reverse=True)
    
    if not category_matches:
        return SymptomResponse(
            condition="Non-Specific Presentation", confidence=40,
            primaryCondition=ConditionProbability(name="Non-Specific Presentation", confidence=40),
            secondaryConditions=[], cannotRuleOut=["Unidentified Pathology"],
            reasoning="Symptoms do not align with common diagnostic profiles.",
            riskJustification="Severity remains low pending further specialized review.",
            bodyRegion="systemic", warningSigns=["Worsening symptoms"], recoveryTimeline="Pending review",
            recommendedTests=["Full physical examination"], urgency="Schedule visit",
            severity="Moderate", extractedSymptoms=list(set(extracted_sym + extracted_bp)),
            recommendedActions=["Keep a symptom log."], emergency=False, specialist="General Physician",
            summary="Atypical symptom presentation.", possibleCauses=["Non-clinical stress", "Atypical onset"]
        )

    primary = category_matches[0]
    data = primary["data"]
    is_escalated = primary["escalated"] or is_critical_emergency
    
    condition_name = primary["name"]
    for sc in data["specific_conditions"]:
        if any(kw in text for kw in sc["trigger"]):
            condition_name = sc["name"]
            break
            
    primary_conf = min(75 + (primary["score"] * 5), 98)
    severity = data["base_severity"]
    urgency = data["base_urgency"]
    emergency = is_critical_emergency
    
    # Severity Justification
    if is_escalated:
        severity = "High Risk"
        urgency = "Urgent consultation recommended"
        justification = f"High-risk classification due to {', '.join(extracted_sym[:2])} and escalation markers."
        if primary["name"] == "Orthopedic Injury" and "swelling" in text:
            justification = "High-risk classification due to traumatic swelling and potential mobility impairment."
    else:
        justification = f"Moderate severity based on the reported {primary['name'].lower()} presentation."

    if emergency:
        severity = "Critical"
        urgency = "Emergency care immediately"
        justification = "Critical emergency status declared due to acute clinical distress markers."

    # Clinical Summary
    summary_text = f"Reported {', '.join(extracted_sym[:2])} in the {primary['name'].lower()} context may indicate {condition_name.lower()}."
    if "swelling" in text and "twisted" in text:
        summary_text = f"Swelling after a twisting injury suggests potential ligament damage or soft tissue trauma requiring evaluation."

    return SymptomResponse(
        condition=condition_name,
        confidence=primary_conf,
        primaryCondition=ConditionProbability(name=condition_name, confidence=primary_conf),
        secondaryConditions=[ConditionProbability(name=sec["name"], confidence=primary_conf-15) for sec in data["specific_conditions"] if sec["name"] != condition_name][:2],
        cannotRuleOut=data["cannot_rule_out_base"][:3],
        reasoning=f"Your presentation of {', '.join(extracted_sym[:2])} aligns with {condition_name}.",
        riskJustification=justification,
        bodyRegion=primary["body_region"],
        warningSigns=data["warnings"],
        recoveryTimeline=data["recovery"],
        recommendedTests=data["tests"],
        urgency=urgency,
        severity=severity,
        extractedSymptoms=list(set(extracted_sym + extracted_bp)),
        recommendedActions=data["actions"],
        emergency=emergency,
        specialist=data["specialist"],
        summary=summary_text,
        possibleCauses=data["causes"]
    )
