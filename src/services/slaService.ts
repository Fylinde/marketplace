import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

const slaService = {
    async getSLACompliance(params: { dateRange?: [string, string] | null; category?: string }) {
        const { data } = await axios.get(`/api/sla/compliance`, { params });
        return {
            tableData: data.tableData,
            chartData: {
                labels: data.chart.labels,
                data: data.chart.data,
            },
        };
    },

    async saveSlaGoal(goal: string) {
        const { data } = await axios.post(`/api/sla/goal`, { goal });
        return data;
    },
};

export default slaService;

