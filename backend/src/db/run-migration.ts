import dataSource from "./data-source";


async function main() {
  await dataSource.initialize();
  await dataSource.runMigrations();
  console.log('✅ Migrations ran');
  await dataSource.destroy();
}

main().catch((e) => {
  console.error('❌ Migration failed', e);
  process.exit(1);
});
