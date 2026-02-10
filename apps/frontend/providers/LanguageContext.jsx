'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        dashboard: 'Dashboard',
        profile: 'Profile',
        verify: 'Verify Data',
        logout: 'Logout',
        theme: 'Theme',
        language: 'Language',
        light: 'Light',
        dark: 'Dark',
        search: 'Search...',
        competency_growth: 'Competency Growth',
        competency_chart: 'Competency Chart',
        chart_title: 'Competency Radar Chart',
        filter_year: 'Filter by Year',
        filter_range: 'Filter by Date Range',
        activity_history: 'Activity History',
        verified: 'Verified',
        pending: 'Pending',
        score: 'Score',
        date: 'Date',
        type: 'Type',
        activities: 'Activities',
        average_competency: 'Average Competency',
        growth_rate: 'Growth Rate',
        passed_criteria: 'Passed Criteria',
        total_competencies: 'Total Competencies',
        gap_analysis: 'Gap Analysis',
        gap_chart_title: 'Gap Analysis Chart',
        loading: 'Loading...',
        error_loading: 'Error loading data',
        requirement: 'Requirement',
        requirement_criteria: 'Requirement Criteria',
        select_competency: 'Select Competency',
        select_year: 'Select Year',
        year: 'Year',
        click_for_details: '(Click for details)',
        filter: 'Filters',
        select_competency_label: 'Select Competency',
        filter_mode: 'Filter Mode',
        compare_years: 'Compare Years',
        date_range_mode: 'Date Range',
        academic_year: 'Academic Year (multi-select)',
        start_range: 'Start Range',
        end_range: 'End Range',
        show_requirement: 'Show Requirement',
        compared_to_requirement: 'Compared to requirement',
        target: 'Target',
        avg_score: 'Average Score',
        growth: 'Growth',
        no_activities_this_year: 'No activities in this year',
        scored_activities: 'Scored Activities',
        available_activities: 'Available Activities',
        competency: 'Competency',
        // Competencies
        tst_comm: 'Communication',
        tst_ct: 'Critical Thinking',
        tst_team: 'Teamwork',
        tst_lead: 'Leadership',
        tst_ethic: 'Ethics',
        tst_digi: 'Digital Literacy',
    },
    th: {
        dashboard: 'แดชบอร์ด',
        profile: 'ประวัติส่วนตัว',
        verify: 'ตรวจสอบข้อมูล',
        logout: 'ออกจากระบบ',
        theme: 'ธีม',
        language: 'ภาษา',
        light: 'โหมดสว่าง',
        dark: 'โหมดมืด',
        search: 'ค้นหา...',
        competency_growth: 'การเติบโตของสมรรถนะ',
        competency_chart: 'กราฟสมรรถนะ',
        chart_title: 'แผนภูมิเรดาร์สมรรถนะ',
        filter_year: 'กรองตามปี',
        filter_range: 'กรองตามช่วงเวลา',
        activity_history: 'ประวัติกิจกรรม',
        verified: 'ยืนยันแล้ว',
        pending: 'รอตรวจสอบ',
        score: 'คะแนน',
        date: 'วันที่',
        type: 'ประเภท',
        activities: 'กิจกรรม',
        average_competency: 'สมรรถนะเฉลี่ย',
        growth_rate: 'อัตราการเติบโต',
        passed_criteria: 'ผ่านเกณฑ์',
        total_competencies: 'สมรรถนะทั้งหมด',
        gap_analysis: 'การวิเคราะห์ช่องว่าง',
        gap_chart_title: 'แผนภูมิวิเคราะห์ช่องว่าง',
        loading: 'กำลังโหลด...',
        error_loading: 'โหลดข้อมูลไม่สำเร็จ',
        requirement: 'เกณฑ์ที่กำหนด',
        requirement_criteria: 'เกณฑ์หลักสูตร',
        select_competency: 'เลือกสมรรถนะ',
        select_year: 'เลือกปี',
        year: 'ปี',
        click_for_details: '(คลิกเพื่อดูรายละเอียด)',
        filter: 'ตัวกรอง',
        select_competency_label: 'เลือกสมรรถนะ',
        filter_mode: 'โหมดการกรอง',
        compare_years: 'เปรียบเทียบปี',
        date_range_mode: 'ช่วงเวลา',
        academic_year: 'ปีการศึกษา (เลือกได้หลายปี)',
        start_range: 'ช่วงเวลาเริ่มต้น',
        end_range: 'ช่วงเวลาสิ้นสุด',
        show_requirement: 'แสดงเกณฑ์หลักสูตร',
        compared_to_requirement: 'เทียบกับเกณฑ์หลักสูตร',
        target: 'เป้าหมาย',
        avg_score: 'คะแนนเฉลี่ย',
        growth: 'การเติบโต',
        no_activities_this_year: 'ไม่มีกิจกรรมในปีนี้',
        scored_activities: 'กิจกรรมที่ได้รับคะแนนแล้ว',
        available_activities: 'กิจกรรมที่สามารถทำได้',
        competency: 'สมรรถนะ',
        // Competencies (fallback if api doesn't provide)
        tst_comm: 'การสื่อสาร',
        tst_ct: 'การคิดเชิงวิพากษ์',
        tst_team: 'การทำงานเป็นทีม',
        tst_lead: 'ความเป็นผู้นำ',
        tst_ethic: 'จริยธรรม',
        tst_digi: 'ความรอบรู้ทางดิจิทัล',
    }
};

export function LanguageProvider({ children }) {
    // Always start with 'th' to match server render and avoid hydration mismatch
    const [language, setLanguage] = useState('th');

    // Sync from localStorage after hydration
    useEffect(() => {
        const saved = localStorage.getItem('language');
        if (saved && saved !== language) {
            setLanguage(saved);
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
