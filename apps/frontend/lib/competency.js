import { apiFetch } from './api';

export async function fetchCompetencyDashboard() {
    return apiFetch('/api/v1/competency/dashboard');
}
