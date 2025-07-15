import axios from 'axios';

const apiRequest = async (table, method, data = null, id = null) => {
  try {
    const url = id ? `http://localhost:3001/api/${table}/${id}` : `http://localhost:3001/api/${table}`;
    const response = await axios({
      method,
      url,
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
      data,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 && error.response.data.error === 'Invalid token') {
      try {
        const refreshResponse = await axios.post('http://localhost:3001/auth/refresh-token', {}, { withCredentials: true });
        if (refreshResponse.data.success) {
          const retryResponse = await axios({
            method,
            url,
            headers: {
              'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
            },
            data,
            withCredentials: true,
          });
          return retryResponse.data;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }
    throw error;
  }
};

export default apiRequest;
