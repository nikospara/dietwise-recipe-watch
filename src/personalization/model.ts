export type BiologicalGender = 'FEMALE' | 'MALE';

export interface PersonalInfo {
	gender?: BiologicalGender;
	yearOfBirth?: number;
}

export type PersonalInfoValidity = {
	isValid: boolean;
	errors?: {
		[k in keyof PersonalInfo]: string[];
	};
};
