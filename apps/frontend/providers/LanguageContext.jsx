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
        select_competency: 'Select Competency',
        select_year: 'Select Year',
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
        select_competency: 'เลือกสมรรถนะ',
        select_year: 'เลือกปี',
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
    const [language, setLanguage] = useState('th');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
