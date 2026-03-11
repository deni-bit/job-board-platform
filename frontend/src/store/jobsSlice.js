import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    const res = await api.get(`/jobs?${query}`)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

export const fetchJobById = createAsyncThunk('jobs/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/jobs/${id}`)
    return res.data
  } catch (error) {
    return rejectWithValue(error.response.data.message)
  }
})

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    currentJob: null,
    total: 0,
    pages: 1,
    currentPage: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload.jobs
        state.total = action.payload.total
        state.pages = action.payload.pages
        state.currentPage = action.payload.currentPage
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchJobById.pending, (state) => { state.loading = true })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false
        state.currentJob = action.payload
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearCurrentJob } = jobsSlice.actions
export default jobsSlice.reducer