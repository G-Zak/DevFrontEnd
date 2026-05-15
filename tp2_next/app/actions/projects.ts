'use server';

import { revalidatePath } from 'next/cache';

const API_URL = 'http://localhost:3000';

export async function addProject(formData: FormData) {
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;

  await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, color }),
  });

  revalidatePath('/dashboard');
}

export async function renameProject(formData: FormData) {
  const id = formData.get('id') as string;
  const newName = formData.get('newName') as string;

  // First, get the current project to get the color
  const getRes = await fetch(`${API_URL}/api/projects/${id}`);
  const project = await getRes.json();

  // Update with the same color but new name
  await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: newName, color: project.color }),
  });

  revalidatePath('/dashboard');
}

export async function deleteProject(formData: FormData) {
  const id = formData.get('id') as string;

  await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'DELETE',
  });

  revalidatePath('/dashboard');
}
