const BASE_URL = 'http://localhost:5000/api';

export const getFlags = async (env) => {
  const res = await fetch(`${BASE_URL}/flags?env=${env}`);
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

export const updateFlag = async (id, data, env) => {
  const res = await fetch(`${BASE_URL}/flags/${id}?env=${env}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteFlag = async (id) => {
  await fetch(`${BASE_URL}/flags/${id}`, {
    method: 'DELETE',
  });
};