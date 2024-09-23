import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Stack, Input, Button, Modal, Header, Badge, ButtonGroup } from "@nordhealth/react";
import Frappe from '../utils/Frappe';
import { UserContext } from '../context/UserContext';
import { MessageContext } from '../context/MessageContext';

const frappe = Frappe()

function useField(name, initialValue = "") {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState();
    const ref = useRef(null);

    useEffect(() => {
        if (value) {
            setError(undefined);
        }
    }, [value]);

    return {
        value,
        setValue,
        setError,
        inputProps: {
            name,
            value,
            onInput: (e) => setValue(e.target.value),
            ref,
            error,
        },
    };
}

export const Stock = () => {
    const { id } = useParams(); // Get the patient ID from the URL parameters
    const [stock, setStock] = useState(null)
    const [data, setData] = useState(null)

    const { showToaster } = useContext(MessageContext)

    const { setUserLoading, setTitle } = useContext(UserContext)
    const [open, setOpen] = useState(false);
    const qty = useField("qty");
    const rate = useField("rate");


    async function fetchStockData() {
        const body = {
            warehouse: "Finished Goods - PB",
            date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
            item: id
        };
        const rpcResponse = await frappe.postRPC('erpnext.stock.doctype.quick_stock_balance.quick_stock_balance.get_stock_item_details', body);
        const stockDetails = rpcResponse.message
        const response = await frappe.getDoctype("Item", id)
        const data = response.data
        setStock(stockDetails)
        setData(data)
        setTitle(data.item_name)

    }
    useEffect(() => {


        if (id) {
            setUserLoading(true)
            fetchStockData();
            setUserLoading(false)
        }
    }, [id]); // Add `id` as a dependency to re-fetch on ID change

    function showModal() {
        setOpen(true);  // Open the modal by updating state
    }

    function closeModal() {
        setOpen(false); // Close the modal by updating state
        qty.setValue(''); // Reset the qty field after modal is closed
        rate.setValue(''); // Reset the rate field after modal is closed
    }

    async function addStock(e) {
        e.preventDefault();

        // Perform validation
        if (qty.value === '' || rate.value === '') {
            setOpen(true);  // Keep the modal open
            if (rate.value === '') {
                rate.setError("This field is required");
            }
            if (qty.value === '') {
                qty.setError("This field is required");
            }
        } else {
            // Close the modal after successful validation
            const response = await frappe.makeStockEntry(id, qty.value, rate.value);  // Use `id` instead of `code`

            if (response.status === 200) {
                showToaster("success", `${data.item_name} stocks updated successfully`);
                closeModal();  // Close the modal and reset form after successful submission
                fetchStockData()
            } else {
                showToaster("danger", `${data.item_name} update failed`);
            }
        }
    }




    return (
        <Stack>
            <Header expand>
                <h2 className="n-typescale-l">{data?.item_name}</h2>
                <Badge variant="success">Enabled</Badge>
                <Button type="submit" slot="end" variant="primary" onClick={() => showModal()}>
                    Add Stock
                </Button>
                <Modal id="stockModal" aria-labelledby="stockModal" open={open} onClose={closeModal}>
                    <h2 id="title" slot="header">Add Stock for "{data?.item_name}"</h2>
                    <form onSubmit={addStock} id="stockForm">
                        <Stack direction="horizontal">
                            <Input
                                type="number"
                                name="qty"
                                label="Quantity"
                                expand
                                required
                                {...qty.inputProps}
                            >
                                <div slot="end">{data?.stock_uom}</div>
                            </Input>
                            <Input
                                type="number"
                                name="rate"
                                label="Rate"
                                expand
                                required
                                {...rate.inputProps}
                            >
                                <div slot="start">Kshs.</div>
                            </Input>
                        </Stack>
                    </form>
                    <Stack slot="footer" direction="horizontal">
                        <ButtonGroup variant="spaced">
                            <Button type="button" onClick={closeModal}>Cancel</Button>
                            <Button id="add" type="submit" variant="primary" form="stockForm">Add</Button>
                        </ButtonGroup>
                    </Stack>
                </Modal>



            </Header>

            <Stack className="n-padding-i-l n-padding-b-l">
                <Card>
                    <Stack direction="horizontal">
                        <Stack>
                            <Input type="text" name="item_code" label="Code" value={data?.item_code} expand readOnly />
                            <Input type="text" name="item_code" label="Quantity" value={stock?.qty} expand readOnly />
                        </Stack>
                        <Stack>
                            <Input type="text" name="stock_uom" label="Unit of Measure" value={data?.stock_uom} expand readOnly />
                            <Input type="text" name="stock_uom" label="Value" value={stock?.value} expand readOnly ><div slot="start">Kshs</div></Input>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>
        </Stack>)
}
