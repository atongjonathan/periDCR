import axios from 'axios';

export const Frappe = () => {
    const baseUrl = import.meta.env.VITE_FRAPPE_BASE_URL;
    const token = import.meta.env.VITE_FRAPPE_TOKEN;

    const headers = {
        "Authorization": "Basic " + token,
        'Content-Type': 'application/json',
        "Accept": "application/json"
    };

    // Get the currently logged-in user
    const getLoggedUser = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/method/frappe.auth.get_logged_user`, { headers });
            return response.data.message;
        } catch (error) {
            console.error('Error getting logged user:', error);
            return false;
        }
    };

    // Create a new document for a given doctype
    const createDocument = async (body, doctype) => {
        try {
            const response = await axios.post(`${baseUrl}/api/resource/${doctype}`, body, { headers });
            return response;
        } catch (error) {
            console.error('Error creating document:', error.response?.data || error);
            return { error: error.response?.data?.exc_type || 'Error' };
        }
    };

    // Get a specific doctype with parameters
    const getDoctype = async (doctype, id, params = {}) => {
        let reqOptions = {
            url: `${baseUrl}/api/resource/${doctype}/${id}`,
            method: 'GET',
            headers: {
                "Accept": "*/*",
                "Authorization": "Basic " + token
            },
            params: params

        }
        try {
            const response = await axios.request(reqOptions);
            return response.data;
        } catch (error) {
            console.log('Error getting doctype:', error.response?.data || error);
            return null;
        }
    };
    const getDocList = async (doctype, params = {}) => {
        let reqOptions = {
            url: `${baseUrl}/api/resource/${doctype}`,
            method: 'GET',
            headers: {
                "Accept": "*/*",
                "Authorization": "Basic " + token
            },
            params: params

        }
        try {
            const response = await axios.request(reqOptions);
            return response.data;
        } catch (error) {
            console.log('Error getting doclist:', error.response?.data || error);
            return null;
        }
    };
    const updateDoctype = async (doctype, id, body = {}) => {
        try {
            const response = await axios.put(`${baseUrl}/api/resource/${doctype}/${id}`, body, { headers });
            return response.data;
        } catch (error) {
            console.error('Error creating document:', error.response?.data || error);
            return { error: error.response?.data?.exc_type || 'Error' };
        }
        // try {
        //     const response = await axios.request(reqOptions);
        //     return response.data;
        // } catch (error) {
        //     console.log('Error updating doctype:', error.response?.data || error);
        //     return null;
        // }
    };

    // Post an RPC call to a specific function path
    const postRPC = async (functionPath, body) => {
        try {
            const response = await axios.post(`${baseUrl}/api/method/${functionPath}`, body, { headers });
            return response.data;
        } catch (error) {
            console.error('Error posting RPC:', error.response?.data || error);
            return null;
        }
    };

    // Create a new healthcare practitioner
    const createPractitioner = async (firstName, lastName) => {
        const body = {
            data: { first_name: firstName, last_name: lastName }
        };
        const response = await createDocument(body, 'Healthcare Practitioner');
        const data = response?.data;
        const message = response?.message;
        if (data) return response;
        throw new Error(message || 'Error creating practitioner');
    };

    // Create a new patient
    const createPatient = async (patientData) => {
        const body = { data: patientData };
        return await createDocument(body, 'Patient');
    };

    // Get stock data, including details from stock balance
    const getStockData = async (params = null) => {
        if (!params) {
            params = {
                fields: '["item_name", "item_code", "item_group", "modified", "stock_uom"]',
                as_dict: 'true'
            };
        }
        try {
            const response = await getDocList('Item', params);
            const items = response?.data || [];

            for (const item of items) {
                const body = {
                    warehouse: "Finished Goods - PB",
                    date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
                    item: item.item_code
                };
                const stockDetails = await postRPC('erpnext.stock.doctype.quick_stock_balance.quick_stock_balance.get_stock_item_details', body);
                item.stockDetails = stockDetails?.message || {};
            }

            return items;
        } catch (error) {
            console.error('Error getting stock data:', error);
            return [];
        }
    };

    // Make a stock entry (Material Receipt)
    const makeStockEntry = async (itemCode, qty, basicRate) => {
        const body = {
            data: {
                naming_series: 'MAT-STE-.YYYY.-',
                stock_entry_type: 'Material Receipt',
                company: 'Peri Bloom',
                docstatus: 1,
                items: [
                    {
                        t_warehouse: 'Finished Goods - PB',
                        item_code: itemCode,
                        qty: qty,
                        basic_rate: basicRate
                    }
                ]
            }
        };
        return await createDocument(body, 'Stock Entry');
    };

    // Create a new drug item
    const createDrugItem = async (itemCode, itemName, stockUom) => {
        const body = {
            data: {
                item_code: itemCode,
                item_name: itemName,
                item_group: 'Drug',
                stock_uom: stockUom
            }
        };
        return await createDocument(body, 'Item');
    };

    return {
        getLoggedUser,
        createDocument,
        getDoctype,
        updateDoctype,
        postRPC,
        createPractitioner,
        createPatient,
        getStockData,
        makeStockEntry,
        createDrugItem
    };
};

export default Frappe;
