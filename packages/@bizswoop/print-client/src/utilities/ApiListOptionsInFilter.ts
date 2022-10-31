export type ApiListOptionsInFilter<Key extends string, Entity> = {
	[key in Key]: Entity | EntityInFilter<Entity> | EntityNotInFilter<Entity>;
};

type EntityInFilter<Entity> = {
	in: Entity | Entity[];
	notIn?: never;
};

type EntityNotInFilter<Entity> = {
	in?: never;
	notIn: Entity | Entity[];
};
