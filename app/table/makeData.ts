import { faker } from "@faker-js/faker";

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: "relationship" | "complicated" | "single";
  subRows?: Person[];
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (index) => {
  return {
    stt: index,
    id: faker.datatype.uuid(),
    unit: faker.address.streetName(),
    levelOrganization: faker.address.streetName(),
    history: faker.date.past(30),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle(["relationship", "complicated", "single"])[0],
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d, index): Person => {
      return {
        ...newPerson(index + 1),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
