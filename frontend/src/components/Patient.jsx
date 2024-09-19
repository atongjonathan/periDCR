import React, { useContext, useEffect, useState, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Stack, Input, Button, Select, Header, Badge, Toast, ToastGroup } from "@nordhealth/react";
import axios from 'axios';
import Frappe from '../utils/Frappe';
import { UserContext } from '../context/UserContext';

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

export const Patient = () => {
  const { authTokens } = useContext(AuthContext); // Get auth tokens from context
  const { id } = useParams(); // Get the patient ID from the URL parameters

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("success");

  const [original, setOriginal] = useState(null)
  const [change, setChanged] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [updated, setUpdated] = useState(false)

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

  function changed(obj1, obj2) {
    for (let key in obj1) {
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        if (obj1[key] != obj2[key] && (obj1[key] != null && obj2[key] != null)) {
          setChanged(true)
          return true
        }
        continue
      }
    }
    return false
  
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

    // Use your changed function to check if the current values are different from the original ones
    if (original && changed(currentValues, original)) {
      setChanged(true); // Set change to true if any field has changed
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
      console.log(error);
      setStatus("danger");
      return null;
    }
  }


  async function handleSubmit(e) {
    e.preventDefault();
    const formObject = {
      first_name: first_name.value,
      middle_name: middle_name.value,
      last_name: last_name.value,
      blood_group: blood_group.value,
      sex: sex.value,
      phone: phone.value,
      email: email.value,
      dob: dob.value
    };


    if (changed(formObject, original)) {
      if (first_name.value == '') {
        first_name.setError("This field is required");
      }

      if (sex.value == '') {
        sex.setError("This field is required");
      }
      else if (first_name.value != '' || first_name.value != '') {
        setStatus("info");
        try {
          setLoading(true);
          const [apiResponse, frappeResponse] = await Promise.all([
            updatePeriPatient(formObject),
            frappe.updateDoctype("Patient", id, formObject)
          ]);

          if (apiResponse?.data && frappeResponse?.data) {
            setUpdated(true);
            setTimeout(() => {
              setShowToast(false);
              setChanged(false);
              setUpdated(false);
            }, 1000);
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
      setShowToast(false)
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
        setChanged(false);

      }, 1000)
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
                {...first_name.inputProps} onChange={() => changed()}
              />
              <Input type="text" name="middle_name" label="Middle Name" expand {...middle_name.inputProps} onChange={() => changed()} />
              <Input type="text" name="last_name" label="Last Name" expand {...last_name.inputProps} onChange={() => changed()} />
              <Select label="Sex" name="sex" expand required {...sex.inputProps} onChange={() => changed()}>
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
              <Input type="text" name="phone" label="Phone" expand {...phone.inputProps} onChange={() => changed()} />
              <Input type="email" name="email" label="Email" expand {...email.inputProps} onChange={() => changed()} />
              <Input type="date" name="dob" label="Date of Birth" expand {...dob.inputProps} onChange={() => changed()} />
              <Select label="Blood Group" name='blood_group' expand {...blood_group.inputProps} onChange={() => changed()}>
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
      {
        showToast &&
        (
          <ToastGroup>
            <Toast variant='danger'>No changes is the document</Toast>
          </ToastGroup>
        )

      }
      {
        updated &&
        (
          <ToastGroup>
            <Toast variant='primary'>Document updated</Toast>
          </ToastGroup>
        )

      }

    </form>
  );
};
