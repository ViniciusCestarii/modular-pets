import { seedDb } from "@/test";

const DEFAULT_VALUE = 50;

const getCount = () => {
  const args = process.argv.slice(2);
  const countArg = args[0];

  if (!countArg) {
    return DEFAULT_VALUE;
  }

  const count = parseInt(countArg.slice("--count=".length));

  if (isNaN(count)) {
    return DEFAULT_VALUE;
  }

  return count;
};

const count = getCount();

console.log(`Seeding database with ${count} records`);

await seedDb(count);

console.log(`${count} records seeded successfully`);
