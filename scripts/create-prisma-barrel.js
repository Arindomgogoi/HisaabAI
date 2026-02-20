const { writeFileSync } = require('fs');
writeFileSync(
  './src/generated/prisma/index.ts',
  'export * from "./client";\n'
);
console.log('✔ Created Prisma barrel index.ts');
