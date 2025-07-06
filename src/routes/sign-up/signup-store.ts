import { writable } from 'svelte/store';

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dob: string;
}

export const signupStore = writable<SignupData>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dob: ''
});
