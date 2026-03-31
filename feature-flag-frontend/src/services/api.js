const BASE_URL = 'http://localhost:5000/api';

// Get all flags
export const getFlags = async () => {
  const res = await fetch(`${BASE_URL}/flags`);
  return res.json();
};

// Create flag
export const createFlag = async (data) => {
  const res = await fetch(`${BASE_URL}/flags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// ✅ ADD THIS (missing piece)
export const updateFlag = async (id, data) => {
  const res = await fetch(`${BASE_URL}/flags/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteFlag = async (id) => {
  await fetch(`${BASE_URL}/flags/${id}`, {
    method: 'DELETE',
  });
};