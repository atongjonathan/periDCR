import { Stack, Spinner, Button, ButtonGroup, Table, Card, Modal, Input, Popout, DropdownGroup, DropdownItem, Icon } from '@nordhealth/react'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from '../context/UserContext';
import Frappe from "../utils/Frappe";
import { MessageContext } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce';
import axios from 'axios';

const frappe = Frappe()

function useField(name, initialValue = "") {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState("");
    const ref = useRef(null);
    const valid = value;

    useEffect(() => {
        if (valid) {
            setError(undefined);
        }
    }, [valid]);

    return {
        setError,
        setValue,  // Expose setValue so you can use it externally
        valid,
        value,
        focus: () => ref.current?.focus(),
        inputProps: {
            name,
            value,
            onInput: (e) => {
                const input = e.target;
                setValue(input.value);  // Correctly update the value
            },
            error,
            ref,
        },
    };
}
export const Stocks = () => {
    const [items, setItems] = useState([]);
    const { setTitle } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [itemsLoading, setItemsLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false); // Manage modal visibility
    const [updated, setUpdated] = useState(false);
    const [drugs, setDrugs] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [open, setOpen] = useState(false);
    const [drugOpen, setDrugOpen] = useState(false);
    const [drugCode, setDrugCode] = useState(false);

    const { showToaster } = useContext(MessageContext);
    const drug = useField("drug");
    const uom = useField("uom");

    const navigate = useNavigate();

    // Fetch items on component mount
    useEffect(() => {
        async function getItems() {
            try {
                const data = await frappe.getStockData();
                setItems(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        setLoading(true);
        getItems();
        setTitle("All Items");
        setUoms([1, 2, 3]);
    }, [updated]);


    function showModal() {
        setOpenModal(false);
        setOpenModal(true);  // Open the modal by updating state
    }
    function closeModal() {
        setOpen(false)
        setOpenModal(false);
        // drug.setValue('');  // Properly reset the input field
        // uom.setValue('');   // Reset UOM input as well
    }
    async function addDrug(e) {
        e.preventDefault();
        setOpen(false)

        // Check for validation errors
        if (drug.value === '') {
            drug.setError("This field is required");
            // setOpenModal(true); // Ensure the modal remains open if there's an error
        }
        if (uom.value === '') {
            uom.setError("This field is required");
            // setOpenModal(true); // Keep the modal open for fixing errors
        }

        if (drug.value && uom.value) {

            const response = await frappe.createDrugItem(drugCode, drug.value, uom.value)

            if (response?.status == 200) {
                closeModal()
                showToaster("default", drug.value + " added successfully")
            }
            else if (response?.error == 'DuplicateEntryError') {
                drug.setError(drug.value + " already exists");
            }

            else if (response?.error == "LinkValidationError") {
                uom.setError("Invalid UOM provided");

            }
            else
            {
                closeModal()
                showToaster("danger", "Something went wrong")
            }

        }


    }

    const handleUomInput = (e) => {
        const value = e.target.value;
        uom.setValue(value);  // Update using setValue from useField
        getUoms(value);  // Call debounced function
    };
    const handleDrugInput = (e) => {
        const value = e.target.value;
        drug.setValue(value);  // Update using setValue from useField
        getDrugs(value);
    }

    const getUoms = debounce(async (value) => {
        setItemsLoading(true)
        setOpen(true);
        const response = await frappe.getDocList("UOM", {
            filters: JSON.stringify([["name", "like", `%${value}%`]])  // Correct filter
        });
        setUoms(response.data);
        setItemsLoading(false)
    }, 300); // 300ms delay


    const getDrugs = debounce(async (value) => {
        setDrugOpen(true);
        let headersList = {
            "Accept": "*/*",
        }
        let reqOptions = {
            url: `https://rxnav.nlm.nih.gov/REST/Prescribe/drugs.json?name=${value}`,
            method: "GET",
            headers: headersList,
        }
        if (value) {
            setItemsLoading(true)
            let response = await axios.request(reqOptions);
            let groups = response?.data?.drugGroup?.conceptGroup;
            if (groups) {
                let data = [];
                groups.forEach(element => {
                    if (element.conceptProperties) {
                        element.conceptProperties.forEach(prop => {
                            data.push(prop);  // Push the relevant drug data
                        });
                    }
                });
                setDrugs(data);  // Ensure you're setting a non-empty array

            }

        }
        setItemsLoading(false)
    }, 300); // 300ms delay

    return (
        <Stack>
            <Stack className="n-padding-i-l n-padding-b-l">
                <Card padding='none'>
                    <h2 slot="header">Drugs</h2>
                    <Button slot='header-end' type="button" variant="primary" onClick={showModal}>Add Drug</Button>
                    <Modal id="drugModal" size='l' aria-labelledby="drugModal" open={openModal} onClose={closeModal}>
                        <h2 id="title" slot="header">Add Drug</h2>
                        <form action="post" id="drugForm" onSubmit={addDrug}>
                            <Stack direction="horizontal">
                                <Stack gap='xs'>
                                    <Input
                                        type="search"
                                        label="Drug"
                                        name="drug"
                                        expand
                                        required
                                        {...drug.inputProps}
                                        onInput={handleDrugInput}
                                    />
                                    <Stack className={drugOpen ? '' : 'close'}>

                                        {itemsLoading ? <DropdownGroup><DropdownItem className="loader-line"></DropdownItem></DropdownGroup> :

                                            drugs.length == 0 ? <DropdownItem slot='start'>No results</DropdownItem> :
                                                <DropdownGroup>
                                                    {
                                                        drugs.map((item, idx) => {
                                                            return (
                                                                <DropdownGroup>
                                                                    <DropdownItem title={item.name} key={item.rxcui} onClick={() => {
                                                                        showModal();
                                                                        drug.setValue(item.name);
                                                                        setDrugCode(item.rxcui)
                                                                        setDrugOpen(false);
                                                                    }}>
                                                                        {item.name}
                                                                    </DropdownItem>
                                                                </DropdownGroup>
                                                            );
                                                        })
                                                    }
                                                </DropdownGroup>

                                        }

                                    </Stack>

                                </Stack>
                                <Stack gap='xs'>
                                    <Input
                                        type="search"
                                        label="UOM"
                                        name="uom"
                                        expand
                                        required
                                        {...uom.inputProps}
                                        onInput={handleUomInput}  // Use debounced handler
                                    />
                                    {uoms.length > 0 && (
                                        <Stack className={open ? '' : 'close'}>
                                            <DropdownGroup>
                                                {uoms.slice(0, 11).map((item, idx) => (
                                                    <DropdownItem key={idx} onClick={() => {
                                                        showModal()
                                                        uom.setValue(item.name)
                                                        setOpen(false)
                                                    }}>{item.name}</DropdownItem>
                                                ))}
                                            </DropdownGroup>

                                        </Stack>

                                    )}
                                </Stack>
                            </Stack>

                        </form>
                        <ButtonGroup slot="footer" variant="spaced">
                            <Button type="button" expand form="drugForm" onClick={closeModal}>Cancel</Button>
                            <Button type="submit" variant="primary" expand form="drugForm">Add</Button>
                        </ButtonGroup>
                    </Modal>
                    {loading ? (
                        <div className="spinner"><Spinner size="l" className="spinner" /></div>
                    ) : (
                        <Table>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>UOM</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items?.length === 0 ? (
                                        <tr><td colSpan="5"><h1>No Items yet</h1></td></tr>
                                    ) : (
                                        items?.map((item) => (
                                            <tr key={item.item_code} onClick={() => navigate(`/stock/${item.item_code}`)}>
                                                <td>{item.item_code}</td>
                                                <td>{item.item_name}</td>
                                                <td>{item.stockDetails.qty}</td>
                                                <td>{item.stock_uom}</td>
                                                <td>{item.stockDetails.value}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </Table>
                    )}
                </Card>
            </Stack>
        </Stack>
    );

}
