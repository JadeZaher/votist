import { writable } from 'svelte/store';

interface SignupState {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	dob: string;
	phoneNumber: string;
}

const initialState: SignupState = {
	email: '',
	password: '',
	firstName: '',
	lastName: '',
	dob: '',
	phoneNumber: ''
};

export const signupStore = writable<SignupState>({
	email: '',
	password: '',
	firstName: '',
	lastName: '',
	dob: '',
	phoneNumber: ''
});

export const resetSignupStore = () => {
	signupStore.set(initialState);
};
