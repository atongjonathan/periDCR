import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // For UUID generation

export const EHRBase = () => {
    const BASE_URL = import.meta.env.VITE_EHRBASE_URL;
    const TOKEN = import.meta.env.VITE_EHRBASE_TOKEN;

    const headersList = {
        "Accept": "*/*",
        "Authorization": `Basic ${TOKEN}`
    };

    // Status check function
    const status = async () => {
        const reqUrl = `${BASE_URL}/rest/status`;
        try {
            const response = await axios.request({
                method: 'GET',
                url: reqUrl,
                headers: headersList
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Upload Template function
    const uploadTemplate = async (optFile) => {
        const reqUrl = `${BASE_URL}/rest/openehr/v1/definition/template/adl1.4`;
        const fileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.onload = async (event) => {
                const data = event.target.result;
                try {
                    const response = await axios.request({
                        method: 'POST',
                        url: reqUrl,
                        headers: {
                            ...headersList,
                            "Content-Type": "application/xml"
                        },
                        data: data
                    });
                    if (response.status === 201) {
                        resolve({ success: true, message: `${optFile} posted` });
                    } else {
                        resolve(response.data);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsText(optFile);
        });
    };

    // List Templates function
    const listTemplates = async () => {
        const reqUrl = `${BASE_URL}/rest/openehr/v1/definition/template/adl1.4`;
        try {
            const response = await axios.request({
                method: 'GET',
                url: reqUrl,
                headers: headersList
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Create EHR function
    const createEHR = async () => {
        const reqUrl = `${BASE_URL}/rest/openehr/v1/ehr`;
        const uuid = uuidv4();
        const payload = {
            "_type": "EHR_STATUS",
            "name": { "_type": "DV_TEXT", "value": "EHR status" },
            "subject": {
                "_type": "PARTY_SELF",
                "external_ref": {
                    "namespace": "DEMOGRAPHIC",
                    "type": "PERSON",
                    "id": { "_type": "HIER_OBJECT_ID", "value": uuid }
                }
            },
            "archetype_node_id": "openEHR-EHR-EHR_STATUS.generic.v1",
            "uid": { "_type": "OBJECT_VERSION_ID", "value": `${uuid}::openEHRSys.example.com::1` },
            "is_queryable": true,
            "is_modifiable": true
        };

        try {
            const response = await axios.request({
                method: 'POST',
                url: reqUrl,
                headers: {
                    ...headersList,
                    "Prefer": "return=representation",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(payload)
            });
            const ehr = response.data;
            return {
                ehr_id: ehr.ehr_id.value,
                time_created: timeCreated,
                version_id: ehr.ehr_status.uid.value,
                uuid: uuid
            };
        } catch (error) {
            console.log(error)
            return error;
        }
    };

    // Post Flat Composition
    const postFlatComposition = async (data, ehrId, templateId) => {
        const reqUrl = `${BASE_URL}/rest/openehr/v1/ehr/${ehrId}/composition?format=FLAT&templateId=${templateId}`;
        try {
            const response = await axios.request({
                method: 'POST',
                url: reqUrl,
                headers: {
                    ...headersList,
                    "Prefer": "return=representation",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data)
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Get Composition
    const getComposition = async (ehrId, versionedObjectUid) => {
        const reqUrl = `${BASE_URL}/rest/openehr/v1/ehr/${ehrId}/composition/${versionedObjectUid}?format=FLAT`;
        try {
            const response = await axios.request({
                method: 'GET',
                url: reqUrl,
                headers: {
                    ...headersList,
                    "Prefer": "return=representation"
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Query EHRs
    const queryEHRs = async () => {
        const reqUrl = `${BASE_URL}/rest/openehr/v1/query/aql`;
        const payload = {
            "q": "select e/ehr_id/value, c/uid/value, c/archetype_details/template_id/value, c/context/start_time/value FROM EHR e CONTAINS COMPOSITION c"
        };

        try {
            const response = await axios.request({
                method: 'POST',
                url: reqUrl,
                headers: {
                    ...headersList,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(payload)
            });
            return response.data.rows;
        } catch (error) {
            console.error('Error:', error);
        }
    };

  

    return { status, uploadTemplate, listTemplates, createEHR, postFlatComposition, getComposition, queryEHRs };
};

export default EHRBase;
