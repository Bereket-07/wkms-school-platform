import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface Campaign {
    id: string;
    title: string;
    description: string;
    goal_amount_usd: number;
    goal_amount_etb: number;
    current_raised_usd: number;
    current_raised_etb: number;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
    slug: string;
    cover_image_url?: string;
}

export interface MediaItem {
    id: string;
    url: string;
    media_type: string; // 'IMAGE' | 'VIDEO' | 'YOUTUBE_URL'
    title?: string;
    description?: string;
    is_featured: boolean;
    created_at: string;
}

export interface Donation {
    id: string;
    amount: number;
    currency: string;
    donor_name?: string;
    donor_email?: string;
    status: string;
    created_at: string;
    payment_gateway: string;
    transaction_id?: string;
    campaign_title?: string;
}

export const getCampaigns = async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns/');
    return response.data;
};

export const getCampaign = async (slug: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${slug}`);
    return response.data;
};

export const getMedia = async (skip = 0, limit = 100, type?: string): Promise<MediaItem[]> => {
    let url = `/media/?skip=${skip}&limit=${limit}`;
    if (type) {
        url += `&media_type=${type}`;
    }
    const response = await api.get(url);
    return response.data;
};

export const getDonations = async (skip = 0, limit = 100, campaignId?: string): Promise<Donation[]> => {
    let url = `/donate/?skip=${skip}&limit=${limit}`;
    if (campaignId) {
        url += `&campaign_id=${campaignId}`;
    }
    const response = await api.get(url);
    return response.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
    await api.delete(`/media/${id}`);
};

export const createCampaign = async (campaignData: any) => {
    const response = await api.post('/campaigns/', campaignData);
    return response.data;
};

export const uploadMedia = async (currentFile: File) => {
    // In a real scenario, this would likely upload to S3/Cloudinary and get a URL.
    // For this prototype, we might be sending a URL or handling multipart/form-data.
    // Assuming the backend endpoint expects a URL or handling file upload differently.
    // Let's stick to the current backend implementation which likely takes a JSON body with a URL
    // (based on previous context of "uploading URLs").
    // If we need true file upload, we'd need a different endpoint or storage service.
    // adapting to current backend which seems to accept JSON with 'url'.
    // Use a placeholder function or clarification if needed.
    // For now, let's assume we are sending a JSON object with a 'url' field.
    throw new Error("File upload not fully implemented in frontend client yet - requires backend storage integration");
};

export const submitMediaUrl = async (url: string, type: 'image' | 'video', title?: string) => {
    const response = await api.post('/media/', { url, type, title });
    return response.data;
};

export const initializeChapaPayment = async (amount: number, email: string, firstName: string, lastName: string, campaignTitle?: string) => {
    const response = await api.post('/donate/chapa/initialize', {
        amount,
        email,
        first_name: firstName,
        last_name: lastName,
        campaign_title: campaignTitle
    });
    return response.data;
};


// Site Content / CMS
export interface SiteContent {
    id: string;
    section: string;
    key: string;
    content: string;
    content_type: "TEXT" | "IMAGE" | "VIDEO";
    label?: string;
}

export const getSiteContent = async (section?: string): Promise<SiteContent[]> => {
    const url = section ? `/site-content/?section=${section}` : '/site-content/';
    const response = await api.get(url);
    return response.data;
};

export const bulkUpdateSiteContent = async (updates: Record<string, string>) => {
    const response = await api.post('/site-content/bulk-update', updates);
    return response.data;
};

// File Upload (Direct using FastAPI UploadFile if we implement it, or separate endpoint)
// For now, let's assume we implement a generic upload endpoint in media or site-content.
// Since we promised the user upload capability, we need a real upload endpoint.
// Let's add it to api.ts expecting it exists at /media/upload (we need to build this!)
export const uploadFile = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/media/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Contact
export interface ContactMessage {
    id?: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    is_read?: boolean;
    created_at?: string;
}

export const submitContactMessage = async (data: ContactMessage) => {
    const response = await api.post('/contact/', data);
    return response.data;
};

export const getContactMessages = async (skip = 0, limit = 100): Promise<ContactMessage[]> => {
    const response = await api.get(`/contact/?skip=${skip}&limit=${limit}`);
    return response.data;
};

export default api;
