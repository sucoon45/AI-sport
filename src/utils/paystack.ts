import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

const paystack = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
});

export const initializeTransaction = async (email: string, amount: number) => {
    try {
        const response = await paystack.post('/transaction/initialize', {
            email,
            amount: amount * 100, // Paystack amount is in kobo/cents
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet/callback`,
        });
        return response.data;
    } catch (error: any) {
        console.error('Paystack Initialization Error:', error.response?.data || error.message);
        throw error;
    }
};

export const verifyTransaction = async (reference: string) => {
    try {
        const response = await paystack.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error: any) {
        console.error('Paystack Verification Error:', error.response?.data || error.message);
        throw error;
    }
};

export const initiateTransfer = async (amount: number, recipient: string, reason: string = 'Wallet Withdrawal') => {
    try {
        const response = await paystack.post('/transfer', {
            source: 'balance',
            amount: amount * 100,
            recipient,
            reason,
        });
        return response.data;
    } catch (error: any) {
        console.error('Paystack Transfer Error:', error.response?.data || error.message);
        throw error;
    }
};

export const createTransferRecipient = async (name: string, accountNumber: string, bankCode: string) => {
    try {
        const response = await paystack.post('/transferrecipient', {
            type: 'nuban',
            name,
            account_number: accountNumber,
            bank_code: bankCode,
            currency: 'NGN',
        });
        return response.data;
    } catch (error: any) {
        console.error('Paystack Recipient Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getBanks = async () => {
    try {
        const response = await paystack.get('/bank');
        return response.data;
    } catch (error: any) {
        console.error('Paystack Banks Error:', error.response?.data || error.message);
        throw error;
    }
};
