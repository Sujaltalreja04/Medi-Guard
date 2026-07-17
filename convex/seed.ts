import { mutation } from './_generated/server'

export const seed = mutation({
  handler: async (ctx) => {
    const now = Date.now()
    const DAY = 86400000
    const HOUR = 3600000
    const MINUTE = 60000

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
    const randf = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100
    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

    const departments = ['Emergency', 'ICU', 'Surgery', 'Pathology Lab', 'General Ward', 'Radiology', 'Pharmacy', 'Outpatient Department']

    const facilityNames = [
      { name: 'City General Hospital', code: 'CGH', location: '123 Healthcare Ave, Downtown', beds: 1200 },
      { name: "St. Mary's Medical Center", code: 'SMM', location: '456 Mercy Blvd, Midtown', beds: 850 },
      { name: 'Northside Health Institute', code: 'NHI', location: '789 Wellness Pkwy, Uptown', beds: 600 },
    ]

    const binPatterns = [
      { type: 'GENERAL_WASTE', dept: 'Emergency', waste: 'General non-hazardous waste' },
      { type: 'GENERAL_WASTE', dept: 'ICU', waste: 'General non-hazardous waste' },
      { type: 'GENERAL_WASTE', dept: 'Surgery', waste: 'General non-hazardous waste' },
      { type: 'SHARPS', dept: 'Surgery', waste: 'Sharps and needle waste' },
      { type: 'SHARPS', dept: 'ICU', waste: 'Sharps and needle waste' },
      { type: 'INFECTIOUS', dept: 'Pathology Lab', waste: 'Infectious and biohazard waste' },
      { type: 'INFECTIOUS', dept: 'Emergency', waste: 'Infectious and biohazard waste' },
      { type: 'PHARMACEUTICAL', dept: 'Pharmacy', waste: 'Pharmaceutical and medicine waste' },
      { type: 'PHARMACEUTICAL', dept: 'ICU', waste: 'Pharmaceutical and medicine waste' },
      { type: 'CHEMICAL', dept: 'Pathology Lab', waste: 'Chemical and solvent waste' },
      { type: 'CHEMICAL', dept: 'Radiology', waste: 'Chemical and solvent waste' },
      { type: 'RECYCLABLE', dept: 'General Ward', waste: 'Recyclable plastic and paper waste' },
      { type: 'RECYCLABLE', dept: 'Outpatient Department', waste: 'Recyclable plastic and paper waste' },
      { type: 'GENERAL_WASTE', dept: 'Emergency', waste: 'General non-hazardous waste' },
      { type: 'RECYCLABLE', dept: 'General Ward', waste: 'Recyclable plastic and paper waste' },
      { type: 'INFECTIOUS', dept: 'Pathology Lab', waste: 'Infectious and biohazard waste' },
    ]

    const connectionStatuses: string[] = []
    for (let i = 0; i < 38; i++) connectionStatuses.push('ONLINE')
    for (let i = 0; i < 5; i++) connectionStatuses.push('OFFLINE')
    for (let i = 0; i < 5; i++) connectionStatuses.push('WARNING')

    const cameraStatuses = ['Camera OK', 'Camera OK', 'Camera OK', 'Camera OK', 'Camera Warning']
    const triggerStatuses = ['Operational', 'Operational', 'Operational', 'Fault Detected']
    const storageStatuses = ['OK', 'OK', 'OK', '75% utilized', '90% utilized']
    const softwareVersions = ['v3.2.1', 'v3.2.1', 'v3.2.1', 'v3.2.0']

    const wasteClassesData = [
      { name: 'SYRINGE', category: 'SHARPS', risk: 'HIGH', review: true },
      { name: 'NEEDLE_SHARP', category: 'SHARPS', risk: 'CRITICAL', review: true },
      { name: 'GLOVES', category: 'INFECTIOUS', risk: 'MEDIUM', review: false },
      { name: 'FACE_MASK', category: 'GENERAL', risk: 'LOW', review: false },
      { name: 'GAUZE_DRESSING', category: 'INFECTIOUS', risk: 'MEDIUM', review: false },
      { name: 'MEDICINE_VIAL', category: 'PHARMACEUTICAL', risk: 'HIGH', review: true },
      { name: 'AMPOULE', category: 'SHARPS', risk: 'HIGH', review: true },
      { name: 'PLASTIC_BOTTLE', category: 'RECYCLABLE', risk: 'LOW', review: false },
      { name: 'MEDICAL_CONTAINER', category: 'INFECTIOUS', risk: 'MEDIUM', review: false },
      { name: 'PAPER_PACKAGING', category: 'RECYCLABLE', risk: 'LOW', review: false },
      { name: 'GENERAL_WASTE', category: 'GENERAL', risk: 'LOW', review: false },
      { name: 'UNKNOWN_ITEM', category: 'UNKNOWN', risk: 'MEDIUM', review: true },
    ]

    const ruleDefs: { wasteClass: string, binType: string, result: string, severity: string, confidence: number }[] = [
      { wasteClass: 'SYRINGE', binType: 'GENERAL_WASTE', result: 'CRITICAL_VIOLATION', severity: 'CRITICAL', confidence: 0.75 },
      { wasteClass: 'SYRINGE', binType: 'SHARPS', result: 'CORRECT', severity: 'INFO', confidence: 0.65 },
      { wasteClass: 'NEEDLE_SHARP', binType: 'GENERAL_WASTE', result: 'CRITICAL_VIOLATION', severity: 'CRITICAL', confidence: 0.75 },
      { wasteClass: 'NEEDLE_SHARP', binType: 'SHARPS', result: 'CORRECT', severity: 'INFO', confidence: 0.65 },
      { wasteClass: 'GLOVES', binType: 'GENERAL_WASTE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'GLOVES', binType: 'INFECTIOUS', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'FACE_MASK', binType: 'GENERAL_WASTE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'GAUZE_DRESSING', binType: 'GENERAL_WASTE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'GAUZE_DRESSING', binType: 'INFECTIOUS', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'MEDICINE_VIAL', binType: 'PHARMACEUTICAL', result: 'CORRECT', severity: 'INFO', confidence: 0.65 },
      { wasteClass: 'MEDICINE_VIAL', binType: 'GENERAL_WASTE', result: 'PROBABLE_VIOLATION', severity: 'HIGH', confidence: 0.7 },
      { wasteClass: 'AMPOULE', binType: 'SHARPS', result: 'CORRECT', severity: 'INFO', confidence: 0.65 },
      { wasteClass: 'AMPOULE', binType: 'GENERAL_WASTE', result: 'PROBABLE_VIOLATION', severity: 'HIGH', confidence: 0.7 },
      { wasteClass: 'PLASTIC_BOTTLE', binType: 'RECYCLABLE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'PLASTIC_BOTTLE', binType: 'GENERAL_WASTE', result: 'PROBABLE_VIOLATION', severity: 'LOW', confidence: 0.6 },
      { wasteClass: 'MEDICAL_CONTAINER', binType: 'INFECTIOUS', result: 'CORRECT', severity: 'INFO', confidence: 0.65 },
      { wasteClass: 'MEDICAL_CONTAINER', binType: 'GENERAL_WASTE', result: 'PROBABLE_VIOLATION', severity: 'MEDIUM', confidence: 0.65 },
      { wasteClass: 'PAPER_PACKAGING', binType: 'RECYCLABLE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'PAPER_PACKAGING', binType: 'GENERAL_WASTE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'GENERAL_WASTE', binType: 'GENERAL_WASTE', result: 'CORRECT', severity: 'INFO', confidence: 0.6 },
      { wasteClass: 'SYRINGE', binType: 'INFECTIOUS', result: 'CRITICAL_VIOLATION', severity: 'CRITICAL', confidence: 0.75 },
      { wasteClass: 'NEEDLE_SHARP', binType: 'INFECTIOUS', result: 'CRITICAL_VIOLATION', severity: 'CRITICAL', confidence: 0.75 },
      { wasteClass: 'MEDICINE_VIAL', binType: 'SHARPS', result: 'PROBABLE_VIOLATION', severity: 'HIGH', confidence: 0.7 },
      { wasteClass: 'SYRINGE', binType: 'RECYCLABLE', result: 'CRITICAL_VIOLATION', severity: 'CRITICAL', confidence: 0.75 },
    ]

    const usersData = [
      { name: 'Alex Chen', email: 'alex.chen@mediguard.com', role: 'SUPERVISOR' as const },
      { name: 'Dr. Sarah Miller', email: 'sarah.miller@mediguard.com', role: 'COMPLIANCE_OFFICER' as const },
      { name: 'James Wilson', email: 'james.wilson@mediguard.com', role: 'WASTE_OPERATOR' as const },
      { name: 'Maria Garcia', email: 'maria.garcia@mediguard.com', role: 'FACILITY_ADMIN' as const },
      { name: 'Dr. Robert Kim', email: 'robert.kim@mediguard.com', role: 'COMPLIANCE_OFFICER' as const },
    ]

    const decisionPool = [
      ...Array(357).fill('CORRECT'),
      ...Array(76).fill('PROBABLE_VIOLATION'),
      ...Array(51).fill('CRITICAL_VIOLATION'),
      ...Array(10).fill('LOW_CONFIDENCE_REVIEW'),
      ...Array(6).fill('UNKNOWN_ITEM'),
      ...Array(5).fill('AI_ANALYSIS_FAILED'),
      ...Array(3).fill('SENSOR_ERROR'),
      ...Array(2).fill('BIN_CAPACITY_WARNING'),
    ]

    const wasteClassNames = ['SYRINGE', 'NEEDLE_SHARP', 'GLOVES', 'FACE_MASK', 'GAUZE_DRESSING', 'MEDICINE_VIAL', 'AMPOULE', 'PLASTIC_BOTTLE', 'MEDICAL_CONTAINER', 'PAPER_PACKAGING', 'GENERAL_WASTE', 'UNKNOWN_ITEM']

    const alertDefs: { severity: string, title: string, description: string, status: string }[] = [
      { severity: 'CRITICAL', title: 'Critical Segregation Violation - Syringe in General Waste', description: 'A syringe was detected in a General Waste bin at Emergency department. Immediate review required.', status: 'OPEN' },
      { severity: 'CRITICAL', title: 'Critical Segregation Violation - Needle in Infectious Waste', description: 'A needle/sharp was detected in an Infectious Waste bin at Pathology Lab. Hazardous mis-segregation.', status: 'OPEN' },
      { severity: 'HIGH', title: 'Probable Violation - Medicine Vial in General Waste', description: 'A medicine vial was detected in a General Waste bin at ICU. Possible pharmaceutical waste mis-segregation.', status: 'ACKNOWLEDGED' },
      { severity: 'MEDIUM', title: 'Bin Capacity Warning - Radiology Chemical Bin', description: 'Chemical waste bin in Radiology has reached 87% capacity. Schedule collection soon.', status: 'OPEN' },
      { severity: 'LOW', title: 'Device Offline - Edge Gateway Malfunction', description: 'Device EDGE-042 at NHI has been offline for 4 hours. Maintenance team notified.', status: 'ACKNOWLEDGED' },
      { severity: 'HIGH', title: 'Probable Violation - Ampoule in General Waste', description: 'A glass ampoule was detected in General Waste at Surgery. Possible sharps mis-segregation.', status: 'RESOLVED' },
      { severity: 'CRITICAL', title: 'Critical Violation - Syringe in Recyclable Bin', description: 'A syringe was detected in a Recyclable bin at Outpatient Department. Immediate investigation required.', status: 'OPEN' },
      { severity: 'HIGH', title: 'Camera Obstruction Detected', description: 'Camera on device EDGE-SMM-008 at Surgery is obstructed. Image quality degraded.', status: 'ACKNOWLEDGED' },
      { severity: 'MEDIUM', title: 'Probable Violation - Medical Container in General Waste', description: 'A medical container was detected in General Waste at General Ward. Review suggested.', status: 'OPEN' },
      { severity: 'LOW', title: 'Storage Capacity Warning', description: 'Device EDGE-CGH-003 at ICU has 90% storage utilization. Cleanup recommended.', status: 'RESOLVED' },
      { severity: 'CRITICAL', title: 'Critical Violation - Needle Sharp in General Waste', description: 'A needle/sharp was detected in General Waste at Emergency. High-risk violation detected.', status: 'ACKNOWLEDGED' },
      { severity: 'HIGH', title: 'Probable Violation - Medicine Vial in Sharps Container', description: 'A medicine vial was detected in a Sharps container at Surgery. Review required.', status: 'OPEN' },
      { severity: 'MEDIUM', title: 'Low Confidence Detection Requires Review', description: 'AI analysis on event at Pathology Lab had low confidence (0.52). Manual review required.', status: 'OPEN' },
      { severity: 'LOW', title: 'Software Update Available', description: 'New software version v3.2.2 is available for 12 devices. Schedule update window.', status: 'RESOLVED' },
      { severity: 'HIGH', title: 'Probable Violation - Plastic Bottle in General Waste', description: 'A plastic bottle was detected in General Waste at Outpatient Department. Recycling opportunity missed.', status: 'ACKNOWLEDGED' },
      { severity: 'MEDIUM', title: 'Fill Level Warning - Emergency General Bin', description: 'General waste bin in Emergency has reached 82% capacity.', status: 'OPEN' },
      { severity: 'CRITICAL', title: 'Critical System Alert - AI Pipeline Failure', description: 'AI analysis pipeline failed for 3 consecutive events. NVIDIA API may be unreachable.', status: 'OPEN' },
      { severity: 'LOW', title: 'Routine Maintenance Reminder', description: 'Scheduled maintenance for devices at NHI is due within 7 days.', status: 'RESOLVED' },
      { severity: 'HIGH', title: 'Probable Violation - Gauze Dressing Discrepancy', description: 'Gauze dressing detected in a bin with anomalous fill pattern. Investigation recommended.', status: 'ACKNOWLEDGED' },
      { severity: 'MEDIUM', title: 'Sensor Fault - Trigger Sensor Warning', description: 'Trigger sensor on device EDGE-CGH-014 at General Ward showing intermittent faults.', status: 'OPEN' },
      { severity: 'CRITICAL', title: 'Critical Compliance Risk - Multiple Violations', description: 'Facility CGH has recorded 5+ critical violations in the past 24 hours. Escalation required.', status: 'OPEN' },
      { severity: 'LOW', title: 'Queue Depth Alert', description: 'Device EDGE-SMM-006 at Pathology Lab has a queue depth of 5. Process pending events.', status: 'RESOLVED' },
      { severity: 'HIGH', title: 'Probable Violation - Ampoule Disposal Concern', description: 'Ampoule detected in General Waste at ICU. Potential sharps hazard.', status: 'ACKNOWLEDGED' },
      { severity: 'MEDIUM', title: 'Device Reconnected After Outage', description: 'Device EDGE-NHI-004 at Surgery has reconnected after 2 hours offline.', status: 'RESOLVED' },
      { severity: 'CRITICAL', title: 'Critical Violation - Needle Sharp in Infectious Bin', description: 'Needle sharp detected in Infectious Waste at Emergency. Critical biohazard risk.', status: 'OPEN' },
      { severity: 'HIGH', title: 'Probable Violation - Medicine Vial Disposal', description: 'Medicine vial detected in General Waste at Pharmacy. Pharmaceutical waste protocol violated.', status: 'ACKNOWLEDGED' },
      { severity: 'LOW', title: 'Device Heartbeat Irregularity', description: 'Device EDGE-CGH-007 at Radiology has irregular heartbeat pattern. Monitor connectivity.', status: 'OPEN' },
      { severity: 'MEDIUM', title: 'Unknown Item Detected - Review Required', description: 'AI analysis unable to classify item in bin at General Ward. Manual inspection scheduled.', status: 'OPEN' },
      { severity: 'HIGH', title: 'Critical Capacity Alert - Sharps Container', description: 'Sharps container at ICU has reached 93% capacity. Immediate collection needed.', status: 'ACKNOWLEDGED' },
      { severity: 'LOW', title: 'Weekly Compliance Report Available', description: 'Weekly compliance report for all facilities is now available in the dashboard.', status: 'RESOLVED' },
      { severity: 'MEDIUM', title: 'Cross-Department Violation Trend Detected', description: 'Pattern of GAUZE_DRESSING violations detected across multiple departments at SMM.', status: 'OPEN' },
      { severity: 'HIGH', title: 'Probable Violation - Syringe Disposal Protocol', description: 'Syringe detected in General Waste at Outpatient Department. Training可能需要 reinforcement.', status: 'ACKNOWLEDGED' },
      { severity: 'CRITICAL', title: 'Critical - Unauthorized Waste Disposal', description: 'Unauthorized chemical waste detected in general waste stream at Pathology Lab.', status: 'OPEN' },
      { severity: 'LOW', title: 'System Update - Model Version Available', description: 'New AI model version v1.2.0 is available for deployment.', status: 'RESOLVED' },
      { severity: 'MEDIUM', title: 'Compliance Score Drop Detected', description: 'Facility NHI compliance score has dropped by 5% this week. Review recommended.', status: 'OPEN' },
    ]

    const reviewDefs: { decision: string, notes: string, action: string }[] = [
      { decision: 'CONFIRMED_VIOLATION', notes: 'Syringe clearly visible in general waste stream. Staff training needed for Emergency department.', action: 'Immediate retraining of Emergency department staff on sharps disposal protocol. Warning issued.' },
      { decision: 'CORRECT_DISPOSAL', notes: 'Gloves are permitted in general waste. Detection was accurate but disposal was correct.', action: 'None required.' },
      { decision: 'CONFIRMED_VIOLATION', notes: 'Needle sharp found in infectious waste bin. Critical safety hazard.', action: 'Engineering controls review requested. Additional sharps containers ordered for Pathology Lab.' },
      { decision: 'FALSE_DETECTION', notes: 'Item was a plastic packaging sleeve, not a syringe. False positive from AI model.', action: 'Flagged for model retraining dataset.' },
      { decision: 'WRONG_CLASSIFICATION', notes: 'Item was actually a glass vial, not an ampoule. Disposal was correct for the actual item type.', action: 'Model reclassification logged.' },
      { decision: 'CONFIRMED_VIOLATION', notes: 'Medicine vial disposed in general waste at ICU. Pharmaceutical waste protocol violated.', action: 'Pharmaceutical waste containers to be placed in all ICU patient rooms.' },
      { decision: 'CORRECT_DISPOSAL', notes: 'Paper packaging in recyclable bin - correct disposal confirmed.', action: 'None required.' },
      { decision: 'UNABLE_TO_DETERMINE', notes: 'Image quality too poor to make definitive determination. Item appears to be a medical container but classification uncertain.', action: 'Request physical inspection of bin contents.' },
      { decision: 'CONFIRMED_VIOLATION', notes: 'Ampoule in general waste at Surgery. Glass sharps hazard confirmed.', action: 'Additional sharps containers placed in Surgery suites.' },
      { decision: 'CORRECT_DISPOSAL', notes: 'Gauze dressing in infectious waste - correct disposal pathway.', action: 'None required.' },
      { decision: 'CONFIRMED_VIOLATION', notes: 'Plastic bottle in general waste. Should have been recycled.', action: 'Recycling bins to be relocated for better accessibility.' },
      { decision: 'WRONG_CLASSIFICATION', notes: 'Item misidentified as medical container; was actually a clean packaging box. Disposal was appropriate.', action: 'Model training data updated with more packaging examples.' },
      { decision: 'FALSE_DETECTION', notes: 'Shadow in image caused false detection of needle. No violation present.', action: 'Camera angle adjusted to reduce shadow interference.' },
      { decision: 'CONFIRMED_VIOLATION', notes: 'Needle sharp disposed in infectious waste at Emergency. Critical safety concern.', action: 'Immediate staff retraining. Disciplinary review initiated.' },
      { decision: 'TEST_EVENT', notes: 'This was a scheduled test event to verify system alerting. All systems functioned correctly.', action: 'Test completed successfully. Results logged.' },
    ]

    const auditActions = [
      { action: 'LOGIN', actor: 'Alex Chen', role: 'SUPERVISOR', resource: 'System', status: 'SUCCESS' },
      { action: 'LOGIN', actor: 'Dr. Sarah Miller', role: 'COMPLIANCE_OFFICER', resource: 'System', status: 'SUCCESS' },
      { action: 'LOGIN', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'System', status: 'SUCCESS' },
      { action: 'LOGIN', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'System', status: 'SUCCESS' },
      { action: 'LOGIN', actor: 'Dr. Robert Kim', role: 'COMPLIANCE_OFFICER', resource: 'System', status: 'SUCCESS' },
      { action: 'EVENT_REVIEW', actor: 'Alex Chen', role: 'SUPERVISOR', resource: 'disposalEvents', status: 'SUCCESS' },
      { action: 'EVENT_REVIEW', actor: 'Dr. Sarah Miller', role: 'COMPLIANCE_OFFICER', resource: 'disposalEvents', status: 'SUCCESS' },
      { action: 'EVENT_REVIEW', actor: 'Dr. Robert Kim', role: 'COMPLIANCE_OFFICER', resource: 'disposalEvents', status: 'SUCCESS' },
      { action: 'EVENT_REVIEW', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'disposalEvents', status: 'SUCCESS' },
      { action: 'ALERT_ACKNOWLEDGED', actor: 'Alex Chen', role: 'SUPERVISOR', resource: 'alerts', status: 'SUCCESS' },
      { action: 'ALERT_ACKNOWLEDGED', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'alerts', status: 'SUCCESS' },
      { action: 'ALERT_RESOLVED', actor: 'Alex Chen', role: 'SUPERVISOR', resource: 'alerts', status: 'SUCCESS' },
      { action: 'ALERT_RESOLVED', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'alerts', status: 'SUCCESS' },
      { action: 'BIN_UPDATE', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'bins', status: 'SUCCESS' },
      { action: 'BIN_UPDATE', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'bins', status: 'SUCCESS' },
      { action: 'DEVICE_MAINTENANCE', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'devices', status: 'SUCCESS' },
      { action: 'DEVICE_REBOOT', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'devices', status: 'SUCCESS' },
      { action: 'COMPLIANCE_REPORT', actor: 'Dr. Sarah Miller', role: 'COMPLIANCE_OFFICER', resource: 'reports', status: 'SUCCESS' },
      { action: 'COMPLIANCE_REPORT', actor: 'Dr. Robert Kim', role: 'COMPLIANCE_OFFICER', resource: 'reports', status: 'SUCCESS' },
      { action: 'CONFIG_UPDATE', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'segregationRules', status: 'SUCCESS' },
      { action: 'LOGIN_FAILED', actor: 'Unknown', role: 'UNKNOWN', resource: 'System', status: 'FAILED' },
      { action: 'EVENT_REVIEW', actor: 'Dr. Sarah Miller', role: 'COMPLIANCE_OFFICER', resource: 'disposalEvents', status: 'SUCCESS' },
      { action: 'ALERT_ACKNOWLEDGED', actor: 'Dr. Robert Kim', role: 'COMPLIANCE_OFFICER', resource: 'alerts', status: 'SUCCESS' },
      { action: 'USER_MANAGEMENT', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'users', status: 'SUCCESS' },
      { action: 'SYSTEM_CONFIG', actor: 'Alex Chen', role: 'SUPERVISOR', resource: 'modelVersions', status: 'SUCCESS' },
      { action: 'EXPORT_DATA', actor: 'Dr. Sarah Miller', role: 'COMPLIANCE_OFFICER', resource: 'disposalEvents', status: 'SUCCESS' },
      { action: 'EXPORT_DATA', actor: 'Dr. Robert Kim', role: 'COMPLIANCE_OFFICER', resource: 'alerts', status: 'SUCCESS' },
      { action: 'PASSWORD_CHANGE', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'users', status: 'SUCCESS' },
      { action: 'LOGIN', actor: 'Alex Chen', role: 'SUPERVISOR', resource: 'System', status: 'SUCCESS' },
      { action: 'DEVICE_DIAGNOSTICS', actor: 'Maria Garcia', role: 'FACILITY_ADMIN', resource: 'devices', status: 'SUCCESS' },
      { action: 'BIN_COLLECTION_SCHEDULED', actor: 'James Wilson', role: 'WASTE_OPERATOR', resource: 'bins', status: 'SUCCESS' },
      { action: 'SYSTEM_BACKUP', actor: 'System', role: 'SYSTEM', resource: 'System', status: 'SUCCESS' },
      { action: 'REPORT_GENERATED', actor: 'Dr. Sarah Miller', role: 'COMPLIANCE_OFFICER', resource: 'reports', status: 'SUCCESS' },
      { action: 'LOGIN', actor: 'Dr. Robert Kim', role: 'COMPLIANCE_OFFICER', resource: 'System', status: 'SUCCESS' },
    ]

    const notificationDefs: { category: string, title: string, description: string, read: boolean }[] = [
      { category: 'CRITICAL_ALERT', title: 'Critical Violation Detected', description: 'A critical segregation violation was detected at CGH Emergency department.', read: false },
      { category: 'WASTE_VIOLATION', title: 'Probable Violation Reported', description: 'Medicine vial detected in general waste at SMM Pharmacy.', read: false },
      { category: 'CAPACITY_WARNING', title: 'Bin Near Capacity', description: 'Chemical waste bin at NHI Radiology is at 87% capacity.', read: true },
      { category: 'DEVICE_WARNING', title: 'Device Offline Alert', description: 'Device EDGE-NHI-002 has been offline for 2 hours.', read: false },
      { category: 'SYSTEM', title: 'AI Model Updated', description: 'AI analysis model has been updated to v1.1.0.', read: true },
      { category: 'CRITICAL_ALERT', title: 'Multiple Critical Alerts', description: 'Facility CGH has 3 open critical alerts requiring attention.', read: false },
      { category: 'WASTE_VIOLATION', title: 'Sharps Disposal Violation', description: 'Needle detected in general waste at SMM Emergency.', read: true },
      { category: 'CAPACITY_WARNING', title: 'General Waste Bin Full', description: 'General waste bin at CGH ICU is at 92% capacity.', read: true },
      { category: 'DEVICE_WARNING', title: 'Camera Fault Detected', description: 'Camera on device at NHI Surgery requires cleaning.', read: false },
      { category: 'SYSTEM', title: 'Weekly Report Ready', description: 'Weekly compliance report is available for download.', read: true },
      { category: 'CRITICAL_ALERT', title: 'Biohazard Risk Detected', description: 'Infectious waste mis-segregation detected at SMM Pathology Lab.', read: false },
      { category: 'WASTE_VIOLATION', title: 'Pharmaceutical Waste Alert', description: 'Pharmaceutical waste detected in incorrect bin at ICU.', read: true },
      { category: 'CAPACITY_WARNING', title: 'Sharps Container Full', description: 'Sharps container at CGH Surgery requires immediate collection.', read: false },
      { category: 'DEVICE_WARNING', title: 'Storage Almost Full', description: 'Device storage at 90% on EDGE-CGH-015. Cleanup needed.', read: true },
      { category: 'SYSTEM', title: 'Maintenance Schedule', description: 'Scheduled maintenance for devices at SMM next Tuesday.', read: true },
      { category: 'CRITICAL_ALERT', title: 'Compliance Escalation', description: 'Facility NHI compliance dropped below threshold. Escalation triggered.', read: false },
      { category: 'WASTE_VIOLATION', title: 'Recycling Protocol Violation', description: 'Recyclable materials found in general waste at OPD.', read: true },
      { category: 'CAPACITY_WARNING', title: 'Multiple Bins Near Capacity', description: '5 bins across SMM are above warning threshold.', read: true },
      { category: 'DEVICE_WARNING', title: 'Trigger Sensor Malfunction', description: 'Trigger sensor on EDGE-CGH-009 needs replacement.', read: false },
      { category: 'SYSTEM', title: 'Seed Data Loaded', description: 'Initial seed data has been successfully loaded into the system.', read: true },
      { category: 'CRITICAL_ALERT', title: 'Unauthorized Access Attempt', description: 'Multiple failed login attempts detected from unknown IP.', read: false },
      { category: 'WASTE_VIOLATION', title: 'Cross-Contamination Risk', description: 'Chemical waste detected in general waste stream at Radiology.', read: true },
      { category: 'CAPACITY_WARNING', title: 'Collection Schedule Updated', description: 'Collection schedule has been updated for NHI General Ward bins.', read: true },
      { category: 'DEVICE_WARNING', title: 'Queue Depth Warning', description: 'Event processing queue depth exceeds threshold on 3 devices.', read: false },
      { category: 'SYSTEM', title: 'Database Optimization Complete', description: 'Scheduled database maintenance completed successfully.', read: true },
    ]

    // ===== FACILITIES =====
    const facilityIds: string[] = []
    for (let i = 0; i < facilityNames.length; i++) {
      const f = facilityNames[i]
      const id = await ctx.db.insert('facilities', {
        name: f.name,
        code: f.code,
        location: f.location,
        departments: departments,
        bins: 16,
        devices: 16,
        eventsToday: 0,
        activeAlerts: rand(1, 5),
        complianceScore: rand(78, 98),
        deviceUptime: randf(94, 99.9),
      } as any)
      facilityIds.push(id)
    }

    // ===== BINS =====
    const binIds: string[] = []
    const binsByFacility: string[][] = [[], [], []]
    const binsByDept: Record<string, string[]> = {}

    const typeCounters: Record<string, number> = {}
    for (let fi = 0; fi < 3; fi++) {
      for (const bp of binPatterns) {
        typeCounters[bp.type] = (typeCounters[bp.type] || 0) + 1
        const num = String(typeCounters[bp.type]).padStart(3, '0')
        const binId = `BIN-${bp.type}-${num}`
        const fill = rand(5, 95)
        const id = await ctx.db.insert('bins', {
          name: `${binId} - ${bp.dept}`,
          binId,
          facilityId: facilityIds[fi],
          department: bp.dept,
          type: bp.type,
          wasteStream: bp.waste,
          fillLevel: fill,
          status: Math.random() > 0.9 ? 'MAINTENANCE' : 'ACTIVE',
          lastCollection: now - rand(1, 30) * DAY,
          lastDisposal: now - rand(1, 7) * DAY,
          openAlerts: rand(0, 2),
          warningThreshold: rand(70, 80),
          criticalThreshold: rand(90, 95),
        } as any)
        binIds.push(id)
        binsByFacility[fi].push(id)
        if (!binsByDept[bp.dept]) binsByDept[bp.dept] = []
        binsByDept[bp.dept].push(id)
      }
    }

    // ===== DEVICES =====
    const deviceIds: string[] = []
    const deviceIdsByFacility: string[][] = [[], [], []]
    let deviceCounter = 0
    for (let fi = 0; fi < 3; fi++) {
      for (let bi = 0; bi < 16; bi++) {
        deviceCounter++
        const devNum = String(deviceCounter).padStart(3, '0')
        const deviceId = `EDGE-${devNum}`
        const binIndex = fi * 16 + bi
        const id = await ctx.db.insert('devices', {
          deviceId,
          binId: binIds[binIndex],
          facilityId: facilityIds[fi],
          department: binPatterns[bi].dept,
          connection: connectionStatuses[deviceCounter - 1],
          lastHeartbeat: now - rand(0, 60) * MINUTE,
          camera: pick(cameraStatuses),
          triggerSensor: pick(triggerStatuses),
          fillSensor: 'Operational',
          storage: pick(storageStatuses),
          softwareVersion: pick(softwareVersions),
          aiIntegrationVersion: 'v2.1.0',
          queueDepth: rand(0, 5),
        } as any)
        deviceIds.push(id)
        deviceIdsByFacility[fi].push(id)
        await ctx.db.patch(binIds[binIndex] as any, { deviceId } as any)
      }
    }

    // ===== WASTE CLASSES =====
    const wasteClassIds: string[] = []
    for (const wc of wasteClassesData) {
      const id = await ctx.db.insert('wasteClasses', {
        name: wc.name,
        category: wc.category,
        riskIndicator: wc.risk,
        requiresReview: wc.review,
      } as any)
      wasteClassIds.push(id)
    }

    // ===== SEGREGATION RULES =====
    for (const rule of ruleDefs) {
      await ctx.db.insert('segregationRules', {
        ruleId: `RULE-${rule.wasteClass}-${rule.binType}`,
        facilityId: facilityIds[0],
        binType: rule.binType,
        wasteClass: rule.wasteClass,
        result: rule.result,
        severity: rule.severity,
        minimumConfidence: rule.confidence,
        effectiveDate: now - 90 * DAY,
        status: 'ACTIVE',
      } as any)
    }

    // ===== USERS =====
    const userIds: string[] = []
    for (const u of usersData) {
      const id = await ctx.db.insert('users', {
        name: u.name,
        email: u.email,
        role: u.role,
        facilityId: u.role === 'FACILITY_ADMIN' ? facilityIds[0] : undefined,
      } as any)
      userIds.push(id)
    }

    // ===== DISPOSAL EVENTS =====
    const eventDbIds: string[] = []
    const eventIdStrings: string[] = []

    for (let day = 0; day < 30; day++) {
      const eventsToday = rand(14, 22)
      const dayDate = new Date(now - day * DAY)
      const dateStr = dayDate.toISOString().slice(0, 10).replace(/-/g, '')

      for (let e = 0; e < eventsToday; e++) {
        const fi = rand(0, 2)
        const dept = pick(departments)
        const facilityBins = binsByFacility[fi]
        const deptBins = binsByDept[dept] || []
        const candidateBins = deptBins.length > 0 ? deptBins.filter(b => facilityBins.includes(b)) : facilityBins
        const binId = pick(candidateBins.length > 0 ? candidateBins : facilityBins)
        const deviceIdx = binIds.indexOf(binId)
        const deviceId = deviceIdx >= 0 ? deviceIds[deviceIdx] : undefined

        const decision = pick(decisionPool)
        const isViolation = decision === 'CRITICAL_VIOLATION' || decision === 'PROBABLE_VIOLATION'
        const severityMap: Record<string, string> = {
          'CRITICAL_VIOLATION': 'CRITICAL',
          'PROBABLE_VIOLATION': 'HIGH',
          'LOW_CONFIDENCE_REVIEW': 'LOW',
          'UNKNOWN_ITEM': 'MEDIUM',
          'CORRECT': 'INFO',
        }

        let detectedClass: string | undefined
        let confidence: number | undefined

        if (isViolation) {
          const vialWaste = ['MEDICINE_VIAL', 'SYRINGE', 'NEEDLE_SHARP', 'AMPOULE']
          detectedClass = pick(vialWaste)
          confidence = randf(0.65, 0.95)
        } else if (decision === 'LOW_CONFIDENCE_REVIEW') {
          detectedClass = pick(wasteClassNames)
          confidence = randf(0.5, 0.65)
        } else if (decision === 'CORRECT') {
          detectedClass = pick(['GLOVES', 'FACE_MASK', 'GAUZE_DRESSING', 'PAPER_PACKAGING', 'PLASTIC_BOTTLE', 'GENERAL_WASTE'])
          confidence = randf(0.75, 0.99)
        } else {
          detectedClass = pick(wasteClassNames)
          confidence = randf(0.5, 0.7)
        }

        const seq = Math.floor(Math.random() * 90000 + 10000).toString()
        const eventId = `EVT-${dateStr}-${seq}`

        const createdAt = dayDate.getTime() - rand(0, DAY - 1)

        const eventDbId = await ctx.db.insert('disposalEvents', {
          eventId,
          facilityId: facilityIds[fi],
          department: dept,
          binId,
          deviceId,
          decision,
          severity: severityMap[decision] || 'INFO',
          detectedClass,
          confidence,
          createdAt,
        } as any)

        eventDbIds.push(eventDbId)
        eventIdStrings.push(eventId)
      }
    }

    // ===== AI ANALYSES =====
    const aiProviders = ['NVIDIA']
    const aiModels = ['minimaxai/minimax-m3']
    const imageQualities = ['GOOD', 'GOOD', 'GOOD', 'FAIR', 'FAIR', 'POOR']

    for (let i = 0; i < eventDbIds.length; i++) {
      if (Math.random() > 0.55) {
        const eventId = eventDbIds[i]
        const completedAt = now - rand(1, 30) * DAY
        await ctx.db.insert('aiAnalyses', {
          eventId,
          provider: pick(aiProviders),
          model: pick(aiModels),
          status: 'COMPLETED',
          primaryClass: 'GENERAL_WASTE',
          overallConfidence: randf(0.5, 0.99),
          imageQuality: pick(imageQualities),
          requiresReview: Math.random() < 0.15,
          latencyMs: rand(200, 3000),
          createdAt: completedAt - rand(1, 10) * MINUTE,
          completedAt,
        } as any)
      }
    }

    // ===== ALERTS =====
    for (const ad of alertDefs) {
      const fi = rand(0, 2)
      const dept = pick(departments)
      const facilityBins = binsByFacility[fi]
      const deptBins = binsByDept[dept] || []
      const candidateBins = deptBins.length > 0 ? deptBins.filter(b => facilityBins.includes(b)) : facilityBins
      const binId = pick(candidateBins.length > 0 ? candidateBins : facilityBins)
      const deviceIdx = binIds.indexOf(binId)
      const deviceId = deviceIdx >= 0 ? deviceIds[deviceIdx] : undefined

      const dateStr = new Date(now - rand(0, 14) * DAY).toISOString().slice(0, 10).replace(/-/g, '')
      const seq = String(rand(1000, 9999))
      const alertId = `ALT-${dateStr}-${seq}`

      let acknowledgedAt: number | undefined
      let resolvedAt: number | undefined

      if (ad.status === 'ACKNOWLEDGED') {
        acknowledgedAt = now - rand(1, 7) * DAY
      } else if (ad.status === 'RESOLVED') {
        acknowledgedAt = now - rand(8, 14) * DAY
        resolvedAt = now - rand(1, 7) * DAY
      }

      await ctx.db.insert('alerts', {
        alertId,
        facilityId: facilityIds[fi],
        department: dept,
        binId,
        deviceId,
        severity: ad.severity,
        status: ad.status,
        title: ad.title,
        description: ad.description,
        detectedClass: pick(wasteClassNames),
        confidence: randf(0.5, 0.95),
        acknowledgedBy: ad.status !== 'OPEN' ? pick(['Alex Chen', 'Maria Garcia', 'Dr. Robert Kim']) : undefined,
        acknowledgedAt,
        resolvedBy: ad.status === 'RESOLVED' ? pick(['Alex Chen', 'James Wilson', 'Maria Garcia']) : undefined,
        resolvedAt,
        createdAt: now - rand(1, 14) * DAY,
      } as any)
    }

    // ===== REVIEWS =====
    let reviewEventIndex = 0
    for (const rd of reviewDefs) {
      const eventIdx = reviewEventIndex * 3 + 1
      if (eventIdx < eventDbIds.length) {
        const eventId = eventDbIds[eventIdx]
        const reviewer = pick(['Alex Chen', 'Dr. Sarah Miller', 'James Wilson', 'Dr. Robert Kim'])
        const roleMap: Record<string, string> = {
          'Alex Chen': 'SUPERVISOR',
          'Dr. Sarah Miller': 'COMPLIANCE_OFFICER',
          'James Wilson': 'WASTE_OPERATOR',
          'Dr. Robert Kim': 'COMPLIANCE_OFFICER',
        }

        await ctx.db.insert('reviews', {
          eventId,
          reviewer,
          role: roleMap[reviewer] || 'COMPLIANCE_OFFICER',
          decision: rd.decision,
          notes: rd.notes,
          correctiveAction: rd.action,
          createdAt: now - rand(1, 20) * DAY,
        } as any)

        if (rd.decision === 'CONFIRMED_VIOLATION' || rd.decision === 'CORRECT_DISPOSAL') {
          const reviewDecisionMap: Record<string, string> = {
            'CONFIRMED_VIOLATION': 'CONFIRMED_VIOLATION',
            'CORRECT_DISPOSAL': 'CORRECT_DISPOSAL',
            'UNABLE_TO_DETERMINE': 'UNABLE_TO_DETERMINE',
            'FALSE_DETECTION': 'FALSE_DETECTION',
            'WRONG_CLASSIFICATION': 'WRONG_CLASSIFICATION',
            'TEST_EVENT': 'TEST_EVENT',
          }
          await ctx.db.patch(eventId as any, {
            reviewedBy: reviewer,
            reviewDecision: reviewDecisionMap[rd.decision],
            reviewNotes: rd.notes,
            correctiveAction: rd.action,
            reviewedAt: now - rand(1, 10) * DAY,
          } as any)
        }
      }
      reviewEventIndex++
    }

    // ===== AUDIT LOGS =====
    for (const aa of auditActions) {
      await ctx.db.insert('auditLogs', {
        timestamp: now - rand(0, 30) * DAY,
        actor: aa.actor,
        role: aa.role,
        action: aa.action,
        resource: aa.resource,
        ipAddress: `${rand(10, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`,
        status: aa.status,
      } as any)
    }

    // ===== NOTIFICATIONS =====
    for (const nd of notificationDefs) {
      await ctx.db.insert('notifications', {
        category: nd.category,
        title: nd.title,
        description: nd.description,
        read: nd.read,
        createdAt: now - rand(0, 14) * DAY,
      } as any)
    }

    // ===== DEVICE HEARTBEATS =====
    for (let di = 0; di < deviceIds.length; di++) {
      const numHeartbeats = rand(3, 5)
      for (let h = 0; h < numHeartbeats; h++) {
        const hoursAgo = rand(1, 168)
        await ctx.db.insert('deviceHeartbeats', {
          deviceId: deviceIds[di],
          timestamp: now - hoursAgo * HOUR,
          connection: connectionStatuses[di % connectionStatuses.length],
        } as any)
      }
    }

    // ===== FILL LEVEL READINGS =====
    for (let bi = 0; bi < binIds.length; bi++) {
      const numReadings = rand(10, 15)
      let currentFill = rand(5, 20)
      for (let r = 0; r < numReadings; r++) {
        const daysAgo = 30 - Math.floor((r / numReadings) * 30)
        currentFill = Math.min(100, currentFill + rand(2, 12))
        if (currentFill > 85 && Math.random() > 0.6) {
          currentFill = rand(5, 15)
        }
        await ctx.db.insert('fillLevelReadings', {
          binId: binIds[bi],
          timestamp: now - daysAgo * DAY + rand(0, DAY - 1),
          fillLevel: currentFill,
        } as any)
      }
    }

    // ===== MODEL VERSIONS =====
    await ctx.db.insert('modelVersions', {
      provider: 'NVIDIA',
      model: 'minimaxai/minimax-m3',
      version: 'v1.1.0',
      deployedAt: now - 60 * DAY,
      status: 'DEPRECATED',
    } as any)

    await ctx.db.insert('modelVersions', {
      provider: 'NVIDIA',
      model: 'minimaxai/minimax-m3',
      version: 'v1.0.0',
      deployedAt: now - 30 * DAY,
      status: 'ACTIVE',
    } as any)
  },
})
