const dropQuery = `
    DROP TABLE IF EXISTS person
`;

const insertQuery = `
  CREATE TABLE IF NOT EXISTS person(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name VARCHAR(20),
    user_password VARCHAR(20)
  )
`;

const dummyDataQuery = `
  INSERT INTO person(user_name, user_password) VALUES  
  ('doraemong', 'daenamuhelicopter'),
  ('kukaro', 'wordpass'),
  ('jiharu', 'password')
`;


module.exports = {
    dropQuery,
    insertQuery,
    dummyDataQuery
};
