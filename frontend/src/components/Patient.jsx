import React, { useContext, useEffect, useState, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Stack, Input, Button, Select, Header, Badge, Toast, ToastGroup } from "@nordhealth/react";
import axios from 'axios';
import Frappe from '../utils/Frappe';
import { UserContext } from '../context/UserContext';
import { isValid, parse, isFuture } from 'date-fns';
import validator, { toBoolean } from 'validator'
import { MessageContext } from '../context/MessageContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const frappe = Frappe()

const badgeStatus = {
  "": "Neutral",
  "warning": "Not Saved",
  "danger": "Save Failed",
  "success": "Active",
  "info": "Saving ...",
  "highlight": "Already Exists"
};

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


function validateDOB(dob) {
  // Parse the date string into a valid Date object
  const parsedDate = parse(dob, 'yyyy-MM-dd', new Date());

  // Check if the parsed date is valid
  if (!isValid(parsedDate)) {
    return { valid: false, message: 'Invalid date format' };
  }

  // Check if the person is old enough
  if (isFuture(parsedDate)) {
    return { valid: false, message: 'Date of birth cannot be in the future' };
  }

  return { valid: true, message: 'Valid date of birth' };
}



export const Patient = () => {
  const { authTokens } = useContext(AuthContext); // Get auth tokens from context
  const { id } = useParams(); // Get the patient ID from the URL parameters

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("success");

  const [original, setOriginal] = useState(null)
  const [change, setChanged] = useState(false)

  const { showToaster, showNotification } = useContext(MessageContext)

  const { setUserLoading } = useContext(UserContext)
  const navigate = useNavigate()

  // Form fields
  const first_name = useField("first_name");
  const sex = useField("sex");
  const middle_name = useField("middle_name");
  const blood_group = useField("blood_group");
  const last_name = useField("last_name");
  const phone = useField("phone");
  const email = useField("email");
  const dob = useField("dob");

  function modified(formObject, original) {
    for (let key in formObject) {
      if (formObject.hasOwnProperty(key) && original.hasOwnProperty(key)) {
        if (original[key] === null) {
          original[key] = ''
        }
        if (formObject[key] !== original[key]) {
          setChanged(true)
          return true
        }
        else {
          continue
        }

      }
    }
    return false

  }


  function validForm() {
    if (first_name.value == '') {
      first_name.setError("This field is required");
      first_name.focus()
      return false
    }

    if (sex.value == '') {
      sex.setError("This field is required");
      sex.focus()
      return false
    }
    if (toBoolean(email.value)) {
      if (!validator.isEmail(email.value)) {
        email.setError("Invalid email address");
        return false
      }
    }

    if (toBoolean(dob.value)) {
      let validDOB = validateDOB(dob.value)
      if (!validDOB.valid) {
        dob.setError(validDOB.message)
        return false
      }
    }
    if (toBoolean(phone.value)) {
      if (phone.value.length < 10) {
        console.log(phone.value == '')
        phone.setError("Phone number cannot be less than 10 characters");
        return false
      }
    }
    return true

  }


  // Local getPatient function
  const getPatient = async (id) => {
    const getPatientUrl = `${BACKEND_URL}/api/patient/${id}`;
    let reqOptions = {
      method: 'GET',
      url: getPatientUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens?.access,
      },
    };

    try {
      const response = await axios.request(reqOptions);
      return response;
    } catch (error) {
      console.log(error);
      setStatus("danger");
      return null;
    }
  };

  useEffect(() => {
    document.title = 'Patient';
  }, []);

  useEffect(() => {
    // Only update the status if it actually needs to change
    if (change && status !== "info") {
      setStatus("warning");
    } else if (!change && status !== "success") {
      setStatus("success");
    }
  }, [change, status]);

  useEffect(() => {
    const currentValues = {
      first_name: first_name.value,
      middle_name: middle_name.value,
      last_name: last_name.value,
      blood_group: blood_group.value,
      sex: sex.value,
      phone: phone.value,
      email: email.value,
      dob: dob.value,
    };

    // Use your modified function to check if the current values are different from the original ones
    if (original && modified(currentValues, original)) {
      setChanged(true); // Set change to true if any field has modified
    } else {
      setChanged(false); // Set to false if no changes are detected
    }

  }, [first_name.value, middle_name.value, last_name.value, blood_group.value, sex.value, phone.value, email.value, dob.value, original]);

  useEffect(() => {
    async function fetchPatientData() {

      const response = await getPatient(id); // Use local getPatient
      if (response?.data) {
        const data = response.data;
        // setUserLoading(false)
        // setLoading(false)
        setOriginal(data)
        // Map fetched patient data to form fields
        first_name.setValue(data.first_name || "");
        middle_name.setValue(data.middle_name || "");
        last_name.setValue(data.last_name || "");
        blood_group.setValue(data.blood_group || "");
        sex.setValue(data.sex || "");
        phone.setValue(data.phone || "");
        email.setValue(data.email || "");
        dob.setValue(data.dob || "");

        setStatus("success");
        // setUserLoading(false)

      } else {
        navigate("/patient")

      }
    }

    if (id) {
      setUserLoading(true)
      fetchPatientData();
      setUserLoading(false)
    }
  }, [id]); // Add `id` as a dependency to re-fetch on ID change

  async function updatePeriPatient(patient) {
    const updatePatientUrl = `${BACKEND_URL}/api/update-patient/${id}`;
    let reqOptions = {
      method: 'POST',
      url: updatePatientUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authTokens?.access,

      },
      data: JSON.stringify(patient)

    };

    try {
      const response = await axios.request(reqOptions);
      return response;
    } catch (error) {
      return null;
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Convert FormData to an object
    const formObject = Object.fromEntries(formData.entries());


    if (modified(formObject, original)) {
      if (validForm()) {
        setStatus("info");
        try {
          setLoading(true);
          const [apiResponse, frappeResponse] = await Promise.all([
            updatePeriPatient(formObject),
            frappe.updateDoctype("Patient", id, formObject)
          ]);

          if (apiResponse?.data && frappeResponse?.data) {
            showToaster("success", "Patient Updated")
            setChanged(false)
          }
          else {
            setStatus("danger");
          }
        } catch (error) {
          console.log(error);
          setStatus("danger");
        } finally {
          setLoading(false);
        }
      }
    }
    else {
      showToaster("danger", "No changes detected")
    }


  }

  return (
    <form action="#" method="post" onSubmit={handleSubmit}>
      <Header expand>
        <h2 className="n-typescale-l">{first_name.value + ' ' + middle_name.value + ' ' + last_name.value}</h2>
        <Badge variant={status}>{badgeStatus[status]}</Badge>
        <Button type="submit" loading={loading} slot="end" variant="primary">
          Save
        </Button>
      </Header>

      <Stack className="n-padding-i-l n-padding-b-l">
        <Card>
          <Stack direction="horizontal">
            <Stack>
              <Input
                type="text"
                name="first_name"
                label="First Name"
                expand
                required
                {...first_name.inputProps} onChange={() => modified()}
              />
              <Input type="text" name="middle_name" label="Middle Name" expand {...middle_name.inputProps} onChange={() => modified()} />
              <Input type="text" name="last_name" label="Last Name" expand {...last_name.inputProps} onChange={() => modified()} />
              <Select label="Sex" name="sex" expand required {...sex.inputProps} onChange={() => modified()}>
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Genderqueer">Genderqueer</option>
                <option value="Non-Conforming">Non-Conforming</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Transgender">Transgender</option>
              </Select>
            </Stack>
            <Stack>
              <Input type="text" name="phone" label="Phone" expand {...phone.inputProps} onChange={() => modified()} />
              <Input type="email" name="email" label="Email" expand {...email.inputProps} onChange={() => modified()} />
              <Input type="date" name="dob" label="Date of Birth" expand {...dob.inputProps} onChange={() => modified()} oninput={() => modified()} />
              <Select label="Blood Group" name='blood_group' expand {...blood_group.inputProps} onChange={() => modified()}>
                <option value="">Select Blood Group</option>
                <option value="A Positive">A Positive</option>
                <option value="A Negative">A Negative</option>
                <option value="B Positive">B Positive</option>
                <option value="B Negative">B Negative</option>
                <option value="O Positive">O Positive</option>
                <option value="O Negative">O Negative</option>
                <option value="AB Positive">AB Positive</option>
                <option value="AB Negative">AB Negative</option>
              </Select>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
};
