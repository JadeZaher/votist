import { writable } from 'svelte/store';

interface SignupState {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  phoneNumber: string;
  captchaToken: string;
}

const initialState: SignupState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dob: '',
  phoneNumber: '',
  captchaToken: ''
};

export const signupStore = writable<SignupState>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dob: '',
  phoneNumber: '',
  captchaToken: ''
});

export const resetSignupStore = () => {
  signupStore.set(initialState);
};
