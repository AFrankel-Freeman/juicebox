const { client, getAllUsers, createUser } = require('./index.js');

const dropTables = async () => {
    try{
        console.log("starting to drop tables...")

        await client.query(`
            DROP TABLE IF EXISTS users;
        `);
        
        console.log("starting to drop tables....")
    } catch (err){
        console.error("ERROR dropping tables!")
       throw err;
    }
}

const createTables = async () => {
    try {
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
        `);
    } catch{
        throw err;
    }
}

const createInitialUsers = async() => {
    try {
        console.log("Starting to Create Users...");

        const albert = await createUser ({username: 'albert', password:'bertie99'})
        const sandra = await createUser({ username: 'sandra', password: '2sandy4me' })
        const glamgal=await createUser({ username: 'glamgal', password: 'soglam'});
        console.log(albert, sandra, glamgal);
        console.log("Finished creating users!");
    } catch (err) {
        console.error("Error Creating users!");
        throw err
    }
}

const rebuildDB = async () => {
    try{
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (err) {
        console.error(err);
    } 
}

const testDB = async () => {
    try{
        console.log("Starting to test database");

        const users= await getAllUsers();
        console.log("Get All USERS:",users);
        console.log("Finish Database Tests!");
    } catch (err){
    console.error("Error Testing Database!");
    throw err;
    } 
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());
