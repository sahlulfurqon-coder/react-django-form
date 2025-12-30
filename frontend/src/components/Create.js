import React, { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import dayjs from 'dayjs'

import MyDatePickerField from '../forms/MyDatePickerField'
import MySelectField from '../forms/MySelectField'
import MyTextField from '../forms/MyTextField'

import AxiosInstance from './Axios'
import { generateSampleCode } from '../shared/sampleCode/generateSampleCode'

/* =======================
   VALIDATION SCHEMA
======================= */
const schema = yup.object({
  type: yup.string().required(),

  status: yup.string().required(),
  comments: yup.string().nullable(),

  tank: yup.string().when('type', {
    is: 'raw_material',
    then: (s) => s.required('Tank wajib'),
  }),

  pengisian_ke: yup.number().when(['type', 'tank'], {
    is: (type, tank) =>
      type === 'raw_material' &&
      ['TA', 'TB', 'TC', 'TD', 'TE', 'TF'].includes(tank),
    then: (s) => s.required('Pengisian ke wajib'),
  }),

  tanggal_pengisian: yup.date().when('type', {
    is: 'raw_material',
    then: (s) => s.required(),
  }),

  tanggal_produksi: yup.date().when('type', {
    is: (v) => ['fatblend', 'finished_product'].includes(v),
    then: (s) => s.required(),
  }),

  line: yup.string().when('type', {
    is: (v) => ['fatblend', 'finished_product'].includes(v),
    then: (s) => s.required(),
  }),

  nomor_urut: yup.number().when('type', {
    is: (v) => ['fatblend', 'finished_product'].includes(v),
    then: (s) => s.required(),
  }),
})

/* =======================
   DEFAULT VALUES
======================= */
const defaultValues = {
  type: '',
  name: '',

  tank: '',
  pengisian_ke: '',
  tanggal_pengisian: null,

  tanggal_produksi: null,
  line: '',
  nomor_urut: '',

  comments: '',
  status: '',
}

/* =======================
   COMPONENT
======================= */
const Create = () => {
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })

  const formValues = watch()

  /* =======================
     AUTO GENERATE CODE
  ======================= */
  useEffect(() => {
    const code = generateSampleCode(formValues.type, {
      tank: formValues.tank,
      pengisian_ke: formValues.pengisian_ke,
      tanggal_pengisian: formValues.tanggal_pengisian,
      tanggal_produksi: formValues.tanggal_produksi,
      line: formValues.line,
      nomor_urut: formValues.nomor_urut,
    })

    setValue('name', code)
  }, [
    formValues.type,
    formValues.tank,
    formValues.pengisian_ke,
    formValues.tanggal_pengisian,
    formValues.tanggal_produksi,
    formValues.line,
    formValues.nomor_urut,
    setValue,
  ])

  /* =======================
     SUBMIT
  ======================= */
  const onSubmit = (data) => {
    const payload = {
      ...data,
      tanggal_pengisian: data.tanggal_pengisian
        ? dayjs(data.tanggal_pengisian).format('YYYY-MM-DD')
        : null,
      tanggal_produksi: data.tanggal_produksi
        ? dayjs(data.tanggal_produksi).format('YYYY-MM-DD')
        : null,
    }

    AxiosInstance.post('project/', payload)
      .then(() => navigate('/', { state: { refresh: true } }))
      .catch(console.error)
  }

  /* =======================
     RENDER
  ======================= */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          width: '100%',
          boxShadow: 3,
          p: 4,
        }}
      >
        {/* TYPE */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <MySelectField
            label="Type"
            name="type"
            control={control}
            width="30%"
            options={[
              { value: 'raw_material', label: 'Raw Material' },
              { value: 'fatblend', label: 'Fatblend' },
              { value: 'finished_product', label: 'Finished Product' },
            ]}
          />
        </Box>

        {/* RAW MATERIAL */}
        {formValues.type === 'raw_material' && (
          <>
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <MySelectField
                label="Tank"
                name="tank"
                control={control}
                width="30%"
                options={[
                  { value: 'TA', label: 'TA' },
                  { value: 'TB', label: 'TB' },
                  { value: 'TC', label: 'TC' },
                  { value: 'TD', label: 'TD' },
                  { value: 'TE', label: 'TE' },
                  { value: 'TF', label: 'TF' },
                  { value: 'J2', label: 'J2' },
                  { value: 'J3', label: 'J3' },
                  { value: 'J4', label: 'J4' },
                ]}
              />

              {['TA', 'TB', 'TC', 'TD', 'TE', 'TF'].includes(formValues.tank) && (
                <MyTextField
                  label="Pengisian ke"
                  name="pengisian_ke"
                  control={control}
                  type="number"
                  width="30%"
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <MyDatePickerField
                label="Tanggal Pengisian"
                name="tanggal_pengisian"
                control={control}
                width="30%"
              />
            </Box>
          </>
        )}

        {/* FATBLEND & FINISHED */}
        {['fatblend', 'finished_product'].includes(formValues.type) && (
          <>
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <MyDatePickerField
                label="Tanggal Produksi"
                name="tanggal_produksi"
                control={control}
                width="30%"
              />

              <MySelectField
                label="Line"
                name="line"
                control={control}
                width="30%"
                options={[
                  { value: 'A', label: 'A' },
                  { value: 'B', label: 'B' },
                  { value: 'C', label: 'C' },
                  { value: 'D', label: 'D' },
                  { value: 'E', label: 'E' },
                  { value: 'W', label: 'W' },
                  { value: 'Y', label: 'Y' },
                  { value: 'Z', label: 'Z' },
                ]}
              />

              <MyTextField
                label="Nomor Urut"
                name="nomor_urut"
                control={control}
                type="number"
                width="30%"
              />
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
        <MyTextField
          label="Sample Code"
          name="name"
          control={control}
          disabled
          width="30%"
        />

        <Box sx={{ width: '30%' }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ width: '100%', height: '56px' }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default Create
