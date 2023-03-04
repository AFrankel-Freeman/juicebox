const { client, getAllUsers, createUser, updateUser, createPost, updatePost, getAllPosts, getPostsByUser, getUserById } = require('./index.js');

const dropTables = async () => {
    try{
        console.log("starting to drop tables...")

        await client.query(`
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
        `);
        
        console.log("FINISHED dropping tables")
    } catch (err){
        console.error("ERROR dropping tables!");
       throw err;
    }
}

const createTables = async () => {
    try {
        console.log("Beginning to create tables");
        
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                location varchar(255) NOT NULL,
                active boolean DEFAULT true
            );
            CREATE TABLE posts(
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id),
                 title varchar(255) NOT NULL,
                 content TEXT NOT NULL,
                 active BOOLEAN DEFAULT true
            );
        `);
        console.log("finished building tables")
    } catch (err) {
        console.error("Error Building Tables!");
        throw err;
    };
}

const createInitialUsers = async() => {
    try {
        console.log("Starting to Create Users...");

        await createUser({ username: 'albert', password:'bertie99', name: 'Albert', location: 'New York'})
        await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sandy', location: 'Kansas'})
        await createUser({ username: 'glamgal', password: 'soglam', name: 'Adarsha', location: 'California'});
        
        console.log("Finished creating users!");
    } catch (err) {
        console.error("Error Creating users!");
        throw err;
    }
}

const createInitialPosts = async () => {
    try{
        const [albert, sandra, glamgal] = await getAllUsers();

        console.log("starting to create posts")

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post.  I hope I love writing blogs as much as I love reading them "
        });
        await createPost({
            authorId: sandra.id,
            title: "How does this work?",
            content: "Seriously, does this even do anything?"
          });
      
          await createPost({
            authorId: glamgal.id,
            title: "Living the Glam Life",
            content: "Do you even? I swear that half of you are posing."
          });
          console.log("Finished creating posts!");
    } catch (err) {
        console.log("error creating posts!")
        throw err;
    }
}

const rebuildDB = async () => {
    try{
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (err) {
        console.error("error during rebuiilDB");
        throw err;
    } 
}


const testDB = async () => {
    try{
        console.log("Starting to test database");

        console.log("calling getAllUsers")

        const users= await getAllUsers();
        console.log("Get All USERS result:", users);

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("result", updateUserResult);

        console.log( "Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("result", posts);

        console.log( "Calling updatePOsts on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "new title",
            content: "update content"
        });
        console.log( "result", updatePostResult);

        console.log("calling getUserById with 1");
        const albert = await getUserById(1);
        console.log ("result", albert)

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
