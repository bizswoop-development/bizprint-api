export type Printer = {
	id: number;
	name: string;
	key: string;
	status: 'online' | 'offline';
	station: {
		id: number;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
};
