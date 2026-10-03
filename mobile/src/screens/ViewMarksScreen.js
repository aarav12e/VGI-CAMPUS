import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DropdownSelect from '../components/DropdownSelect';

const SEMESTER_MARKS = {
    5: [
        { code: 'BCS501', subject: 'Database Management Systems', credits: 4, internal: 28, maxInt: 30, endSem: 62, maxEnd: 70, grade: 'A+', points: 9 },
        { code: 'BCS502', subject: 'Design & Analysis of Algorithms', credits: 4, internal: 26, maxInt: 30, endSem: 58, maxEnd: 70, grade: 'A', points: 8 },
        { code: 'BCS503', subject: 'Compiler Design', credits: 3, internal: 27, maxInt: 30, endSem: 59, maxEnd: 70, grade: 'A', points: 8 },
        { code: 'BCS504', subject: 'Machine Learning Fundamentals', credits: 4, internal: 29, maxInt: 30, endSem: 65, maxEnd: 70, grade: 'O', points: 10 },
        { code: 'BCS551', subject: 'DBMS Laboratory', credits: 2, internal: 48, maxInt: 50, endSem: 46, maxEnd: 50, grade: 'O', points: 10 }
    ],
    4: [
        { code: 'BCS401', subject: 'Operating Systems', credits: 4, internal: 27, maxInt: 30, endSem: 60, maxEnd: 70, grade: 'A', points: 8 },
        { code: 'BCS402', subject: 'Theory of Computation', credits: 3, internal: 24, maxInt: 30, endSem: 55, maxEnd: 70, grade: 'B+', points: 7 },
        { code: 'BCS403', subject: 'Computer Networks', credits: 4, internal: 26, maxInt: 30, endSem: 61, maxEnd: 70, grade: 'A', points: 8 }
    ]
};

export default function ViewMarksScreen() {
    const [selectedSem, setSelectedSem] = useState(5);
    const semesters = [5, 4, 3, 2, 1];

    const currentMarks = SEMESTER_MARKS[selectedSem] || SEMESTER_MARKS[5];

    const downloadTranscript = () => {
        Alert.alert(
            'Official Grade Card',
            `Generating digitally signed AKTU/VGI Grade Transcript for Semester ${selectedSem}. PDF downloaded to local storage.`
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* CGPA Summary Banner */}
            <View style={styles.cgpaCard}>
                <View style={styles.cgpaLeft}>
                    <Text style={styles.cgpaLabel}>CUMULATIVE GRADE POINT AVERAGE</Text>
                    <Text style={styles.cgpaScore}>7.78 <Text style={styles.cgpaScale}>/ 10.0</Text></Text>
                    <Text style={styles.cgpaSub}>First Class with Distinction • Zero Backlogs</Text>
                </View>
                <View style={styles.cgpaMedal}>
                    <Ionicons name="ribbon-outline" size={32} color="#FFFFFF" />
                </View>
            </View>

            {/* Semester Selector Dropdown */}
            <View style={{ marginBottom: 12 }}>
                <DropdownSelect
                    label="SELECT ACADEMIC TERM / SEMESTER"
                    value={selectedSem}
                    options={semesters.map(sem => ({
                        label: `Semester ${sem} Results`,
                        value: sem,
                        subtitle: `${(SEMESTER_MARKS[sem] || []).length} Courses Evaluated`
                    }))}
                    onSelect={(val) => setSelectedSem(val)}
                    icon="calendar-outline"
                />
            </View>

            {/* Marks Breakdown Table */}
            <View style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                    <Text style={[styles.colHeader, { flex: 2 }]}>SUBJECT</Text>
                    <Text style={[styles.colHeader, { width: 44, textAlign: 'center' }]}>INT</Text>
                    <Text style={[styles.colHeader, { width: 44, textAlign: 'center' }]}>END</Text>
                    <Text style={[styles.colHeader, { width: 44, textAlign: 'center' }]}>GRADE</Text>
                </View>

                {currentMarks.map((item, idx) => (
                    <View key={item.code} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.subCode}>{item.code} ({item.credits} Cr)</Text>
                            <Text style={styles.subTitle}>{item.subject}</Text>
                        </View>
                        <Text style={[styles.markText, { width: 44, textAlign: 'center' }]}>
                            {item.internal}
                        </Text>
                        <Text style={[styles.markText, { width: 44, textAlign: 'center' }]}>
                            {item.endSem}
                        </Text>
                        <View style={[styles.gradePillWrap, { width: 44, alignItems: 'center' }]}>
                            <View style={[
                                styles.gradeBadge,
                                item.grade === 'O' ? styles.gradeO :
                                    item.grade === 'A+' ? styles.gradeAPlus : styles.gradeA
                            ]}>
                                <Text style={styles.gradeText}>{item.grade}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Download Official Transcript Button */}
            <TouchableOpacity
                style={styles.downloadBtn}
                activeOpacity={0.88}
                onPress={downloadTranscript}
            >
                <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>DOWNLOAD SEMESTER GRADE CARD (PDF)</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 30
    },
    cgpaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2563EB',
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 3
    },
    cgpaLeft: {
        flex: 1
    },
    cgpaLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#BFDBFE',
        letterSpacing: 0.8,
        marginBottom: 4
    },
    cgpaScore: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 4
    },
    cgpaScale: {
        fontSize: 16,
        fontWeight: '600',
        color: '#93C5FD'
    },
    cgpaSub: {
        fontSize: 11,
        color: '#DBEAFE',
        fontWeight: '500'
    },
    cgpaMedal: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    semSelectorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14
    },
    semLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        marginRight: 10
    },
    semList: {
        flexDirection: 'row',
        gap: 8
    },
    semChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    semChipActive: {
        backgroundColor: '#FFEDD5',
        borderColor: '#FDBA74'
    },
    semChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B'
    },
    semChipTextActive: {
        color: '#EA580C',
        fontWeight: '800'
    },
    tableCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        marginBottom: 16
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0'
    },
    colHeader: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    tableRowAlt: {
        backgroundColor: '#FAFAFA'
    },
    subCode: {
        fontSize: 10,
        color: '#64748B',
        fontWeight: '600'
    },
    subTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 1
    },
    markText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#334155'
    },
    gradePillWrap: {
        justifyContent: 'center'
    },
    gradeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6
    },
    gradeO: {
        backgroundColor: '#ECFDF5'
    },
    gradeAPlus: {
        backgroundColor: '#EFF6FF'
    },
    gradeA: {
        backgroundColor: '#FEF3C7'
    },
    gradeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1E293B'
    },
    downloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#EA580C',
        paddingVertical: 13,
        borderRadius: 12,
        shadowColor: '#EA580C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3
    },
    downloadBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5
    }
});
