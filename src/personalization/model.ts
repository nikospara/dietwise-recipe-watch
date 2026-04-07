export type BiologicalGender = 'FEMALE' | 'MALE';

export interface PersonalInfo {
	gender?: BiologicalGender;
	yearOfBirth?: number;
	country?: string;
}

export type PersonalInfoValidity = {
	isValid: boolean;
	errors?: {
		[k in keyof PersonalInfo]: string[];
	};
};
