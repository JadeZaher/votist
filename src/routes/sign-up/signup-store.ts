import { writable } from 'svelte/store';

interface SignupData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	dob: string;
	phoneNumber: string;
	captchaToken: string;
}

export const signupStore = writable<SignupData>({
	email: '',
	password: '',
	firstName: '',
	lastName: '',
	dob: '',
	phoneNumber: '',
	captchaToken: ''
});
