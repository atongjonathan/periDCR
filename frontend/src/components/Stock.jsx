import { Stack, Spinner, Button, ButtonGroup, Table, Card, Modal, Input, Icon } from '@nordhealth/react'
import React, { useEffect, useState, useContext, useRef } from 'react'
import { UserContext } from '../context/UserContext';
import Frappe from "../utils/Frappe";
import { MessageContext } from '../context/MessageContext';


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
        valid,
        value,
        focus: () => ref.current?.focus(),
        inputProps: {
            name,
            value,
            onInput: (e) => {
                const input = e.target;
                setValue(input.value);
            },
            error,
            ref,
        },
    };
}

export const Stock = () => {
    const [items, setItems] = useState(null)
    let { setTitle } = useContext(UserContext)
    const [loading, setLoading] = useState(false)

    const [stockName, setStockName] = useState("")
    const [stock_uom, setStock_uom] = useState("")
    const [code, setCode] = useState(null)
    const [stockValue, setStockValue] = useState(0)
    const [open, setOpen] = useState(false)
    const [updated, setUpdated] = useState(false)

    const { showToaster, showNotification } = useContext(MessageContext)



    const qty = useField("qty");
    const rate = useField("rate");


    useEffect(() => {
        async function getItems() {
            try {
                const data = await frappe.getStockData()
                setItems(data); // Set the fetched user data
            } catch (error) {
                console.log(error); // Log any error
            }
            finally {
                setLoading(false)
            }
        }
        setLoading(true)
        getItems(); // Call the function to fetch user data
        setTitle("All Items")


    }, [updated]);

    function showModal(item) {
        rate.value = ''
        qty.value = ''
        setOpen(true)
        setStockName(item.item_name)
        setStock_uom(item.stock_uom)
        setCode(item.item_code)
    }
    async function addStock(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const formObject = Object.fromEntries(formData.entries())
        if (qty.value == '' || rate.value == '') {
            setOpen(true)
            if (rate.value == '') {
                rate.setError("This field is required");
                rate.focus()
            }

            if (qty.value == '') {
                setOpen(true)
                qty.setError("This field is required");
                qty.focus()
            }
        }

        else {
            setOpen(false)
            const response = await frappe.makeStockEntry(code, formObject.qty, formObject.rate)
            if (response.status == 200) {
                setUpdated(true)
                showToaster("success", stockName + " stocks updated successfully")
                
            }
            else {
                showToaster("danger", stockName + " update failed")
            }
            
        }
    }


    return (
        <Stack>


            <Stack className="n-padding-i-l n-padding-b-l">

                <Card padding='none'>
                    <h2 slot="header">Drugs</h2>
                    <Button slot='header-end' id='drugBtn' type="button" variant="primary" onClick={() => drugModal.showModal()}>Add Drug</Button>
                    <Modal id="drugModal" aria-labelledby="drugModal">
                        <h2 id="title" slot="header">Add Drug</h2>
                        <form method="dialog" id="drugForm">
                            <Stack>
                                <Stack direction='horizontal'>
                                    <Input type='search' label='Drug' expand required></Input>
                                    <Input type='search' label='Unit of Measure' expand required></Input>
                                </Stack>
                            </Stack>
                        </form>
                        <ButtonGroup slot='footer' variant='spaced'>
                            <Button expand form='drugForm'>Cancel</Button>
                            <Button variant='primary' expand form='drugForm'>Add</Button>
                        </ButtonGroup>
                    </Modal>
                    <Modal id="stockModal" aria-labelledby="stockModal" open={open}>
                        <h2 id="title" slot="header">Add Stock for {`"${stockName}"`}</h2>
                        <form onSubmit={addStock} method='dialog' id='stockForm'>
                            <Stack direction='horizontal'>
                                <Input type='number' disallow-pattern="[^\d+(\.)]" name='qty' label='Quantity' value={stockValue} expand required {...qty.inputProps}>
                                    <div slot="end">{stock_uom}</div>
                                </Input>
                                <Input type='number' disallow-pattern="[^\d+(\.)]" name='rate' label='Rate' value={stockValue} expand required {...rate.inputProps}>
                                    <div slot="start">Kshs.</div>
                                </Input>
                            </Stack>


                        </form>
                        <Stack slot='footer' direction='horizontal'>
                            <Stack style={{ flex: 1 }} direction="horizontal" gap="s" align-items="center">
                                <Icon name="interface-warning"></Icon>
                                <p>This cannot be undone</p>
                            </Stack>
                            <ButtonGroup variant='spaced'>
                                <Button type='button' onClick={() => document.getElementById("stockModal").open=false} expand form='stockForm'>Cancel</Button>
                                <Button type='submit' variant='primary' expand form='stockForm'>Add</Button>
                            </ButtonGroup>
                        </Stack>

                    </Modal>
                    {loading ? <div className="spinner"><Spinner size="l" className='spinner'></Spinner></div> :
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
                                    {
                                        items?.length == 0 ? (
                                            <tr>
                                                <td><h1>No Items yet</h1>
                                                </td>

                                            </tr>
                                        ) :

                                            items?.map((item, idx) => {
                                                return (
                                                    <tr title={item.item_name} className='item' key={item.item_code} onClick={() => showModal(item)}>
                                                        <td className='n-table-ellipsis'>{item.item_code}</td>
                                                        <td className=''>{item.item_name}</td>
                                                        <td>{item.stockDetails.qty}</td>
                                                        <td>{item.stock_uom}</td>
                                                        <td>{item.stockDetails.value}</td>
                                                    </tr>
                                                )

                                            })

                                    }



                                </tbody>
                            </table>
                        </Table>
                    }
                </Card>

            </Stack>
        </Stack>
    )
}
