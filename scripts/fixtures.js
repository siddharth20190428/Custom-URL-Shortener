const faker = require("faker");
const pool = require("../config/db"); // Adjust the path to your DB configuration

(async () => {
  try {
    // Clear existing data (optional)
    await pool.query(
      "TRUNCATE TABLE analytics, urls, users RESTART IDENTITY CASCADE"
    );

    const userIds = [];
    const urlIds = [];
    const logs = [];

    // Generate 10 users
    for (let i = 0; i < 10; i++) {
      const userResult = await pool.query(
        `INSERT INTO users (google_id, display_name, email, profile_picture) 
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          faker.datatype.uuid(),
          faker.name.findName(),
          faker.internet.email(),
          faker.internet.avatar(),
        ]
      );
      userIds.push(userResult.rows[0].id);
    }

    console.log(`${userIds.length} users created.`);

    // Generate 10-15 URLs per user
    for (const userId of userIds) {
      const urlCount = faker.datatype.number({ min: 10, max: 15 });
      for (let j = 0; j < urlCount; j++) {
        const urlResult = await pool.query(
          `INSERT INTO urls (user_id, alias, original_url, topic) 
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [
            userId,
            faker.internet.domainWord() + faker.datatype.number(),
            faker.internet.url(),
            faker.commerce.department(),
          ]
        );
        urlIds.push(urlResult.rows[0].id);
      }
    }

    console.log(`${urlIds.length} URLs created.`);

    // Generate approximately 10,000 logs for the last 10 days
    const totalLogs = 10000;
    for (let i = 0; i < totalLogs; i++) {
      const urlId = faker.random.arrayElement(urlIds);
      const createdAt = faker.date.recent(10); // Generate a random date in the last 10 days
      const log = {
        url_id: urlId,
        user_agent: faker.internet.userAgent(),
        ip_address: faker.internet.ip(),
        geolocation: JSON.stringify({
          country: faker.address.country(),
          city: faker.address.city(),
        }),
        created_at: createdAt,
      };
      logs.push(log);

      // Batch insert every 1000 logs
      if (logs.length >= 1000 || i === totalLogs - 1) {
        const values = logs
          .map(
            (log, index) =>
              `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
                index * 5 + 4
              }, $${index * 5 + 5})`
          )
          .join(", ");

        const query = `
          INSERT INTO analytics (url_id, user_agent, ip_address, geolocation, created_at)
          VALUES ${values}
        `;

        const queryParams = logs.flatMap((log) => [
          log.url_id,
          log.user_agent,
          log.ip_address,
          log.geolocation,
          log.created_at,
        ]);

        await pool.query(query, queryParams);
        console.log(`${logs.length} logs inserted.`);
        logs.length = 0; // Clear the logs array
      }
    }

    console.log("Demo data generation complete.");
  } catch (err) {
    console.error("Error generating demo data:", err);
  } finally {
    pool.end();
  }
})();
