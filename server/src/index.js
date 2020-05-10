const {GraphQLServer} = require('graphql-yoga');
const initSQL = require('./db/initSQL');
const port = process.env.PORT || 3000;

// https://www.sqlitetutorial.net/sqlite-nodejs/query/
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/my.db', sqlite3.OPEN_READWRITE, err => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the mydb database.');
    }
});

db.serialize(() => {
    db.each(initSQL.dropQuery);
    db.each(initSQL.insertQuery);
    db.each(initSQL.dummyDataQuery);
});

// db.close((err) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log('Close the database connection.');
//     }
// });

// 1. graphQL 스키마 정의
// const typeDefs = `
// type Query {
//   info: String!
//   feed: [Link!]!
// }
//
// type Link {
//     id: ID!
//     description: String!
//     url: String!
//  }
// `;

let links = [
    {
        id: 'link-0',
        url: 'www.howtographql.com',
        description: 'Fullstack tutorial for GraphQL'
    },
    {
        id: 'link-1',
        url: 'www.howtographql.com',
        description: '그래프큐엘 좀 어렵누?'
    }
];
let idCount = links.length;

// query {
//     info
//     feed {
//         id
//         url
//         description
//     }
// }

// 2. resolvers 객체는 스키마 구현체
// Somehow get data from DB
const resolvers = {

    // 조회(R)
    Query: {
        info: () => `info 를 조회하다?`,
        feed: () => links,
        person: async () => {
            const result = await new Promise(((resolve, reject) => {
                const query = `SELECT * FROM person`;
                db.all(query, [], (err, rows) => {

                    if (err) {
                        console.log(err);
                        reject({err});
                        return false;
                    }

                    resolve([...rows]);
                });

            }));

            if (result.hasOwnProperty('err')) {
                return [];
            } else {
                return [...result];
            }
        }
    },

    // 생성, 변경, 삭제(CUD)
    Mutation: {
        createLink: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        },

        updateLink: (parent, {targetId, description, url}) => {
            const targetLink = links.find(link => link.id === targetId);
            targetLink.description = description ? description : '';
            targetLink.url = url ? url : '';
            return targetLink;
        },

        deleteLink: (parent, {targetId}) => {
            const targetLinkIndex = links.findIndex(link => link.id === targetId);
            if (targetLinkIndex != -1) {
                links.splice(targetLinkIndex, 1);
                return {
                    msg: 'success'
                }
            } else {
                return {
                    msg: 'undefined'
                }
            }

        },

        createPerson: async (parent, {userName, userPassword}) => {
            // https://www.sqlitetutorial.net/sqlite-nodejs/insert/

            const result = await new Promise((resolve, reject) => {
                const query = `INSERT INTO person (user_name, user_password) VALUES (?,?)`;
                const selectQuery = `SELECT * FROM person WHERE user_id=?`;
                db.run(query, [userName, userPassword], function (err) {
                    // success 시, this 에 lastID, changes 속성이 있다.
                    if (err) {
                        console.log(`err : ${err}`);
                        reject({err});
                        return false;
                    }

                    db.get(selectQuery, [this.lastID], function (err, row) {
                        if (err) {
                            console.log(`err : ${err}`);
                            reject({err});
                            return false;
                        }

                        resolve({...row});
                    });
                });

            });

            if (result.hasOwnProperty('err')) {
                return {
                    user_id: -1,
                    user_name: 'error',
                    user_password: ''
                }
            } else {
                return {...result};
            }
        }
    },

    // Link: {
    //     id: parent => parent.id,
    //     description: parent => parent.description,
    //     url: parent => parent.url
    // }
};

const options = {
    port: 8000,
    endpoint: '/graphql',
    // subscriptions: '/subscriptions',
    // playground: '/playground',
};

// 3. 스키마 + 구현체를 graphQL 서버에 전달
const graphQLServer = new GraphQLServer({
    typeDefs: './src/schema/schema.graphql',
    resolvers,
});

// auth
graphQLServer.express.use((request, response, next) => {
    const  { authorization } = request.headers;
    console.log('인증 구현');

    next();
});

graphQLServer.start(options, ({port}) =>
    console.log(`http://localhost:${port}에서 서버 가동중`)
);
