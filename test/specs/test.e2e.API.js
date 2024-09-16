const axios = require('axios');

describe('Petstore User API', function() {
    it('should create a user', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        let user = {
            id: 0,
            username: "TestUser",
            firstName: "Test",
            lastName: "User",
            email: "testUser@gmail.com",
            password: "Test1234",
            phone: "1234567890",
            userStatus: 0
        };

        let response = await axios.post(`${baseURL}/user`, user);

        // Check that the status code is 200
        expect(response.status).toBe(200);
         
        //Verify the username of the user that was just created
        let createdUser = await axios.get(`${baseURL}/user/${user.username}`);
        expect(createdUser.data.username).toBe(user.username);
    })

    it('should allow logging in as a user', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        let user = {
            username: "TestUser",
            password: "Test1234"
        };

        let response = null;

        try {
            response = await axios.get(`${baseURL}/user/login`, {
                params: {
                    username: user.username,
                    password: user.password
                }
            });

            // Check the response status
            expect(response.status).toBe(200);

            // Check if response has token (assuming it is in the response body)
            expect(response.data).toHaveProperty('token');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    console.log('Invalid username/password supplied');
                }
            }
        }
    });

    it('should allow creating a list of users', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        let users = [
            {
                id: 0,
                username: "TestUser1",
                firstName: "Test1",
                lastName: "User1",
                email: "testUser1@gmail.com",
                password: "Test1234",
                phone: "1234567890",
                userStatus: 0
            },
            {
                id: 1,
                username: "TestUser2",
                firstName: "Test2",
                lastName: "User2",
                email: "testUser2@gmail.com",
                password: "Test1234",
                phone: "0987654321",
                userStatus: 1
            }
        ];

        let response = await axios.post(`${baseURL}/user/createWithList`, users);

        // Check that the status code is 200
        expect(response.status).toBe(200);

        // Verify that the users were created
        for (let user of users) {
            let createdUserRes = await axios.get(`${baseURL}/user/${user.username}`);
            expect(createdUserRes.data.username).toBe(user.username);
            expect(createdUserRes.data.email).toBe(user.email);
        }
    });

    it('should allow logging out the user', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        let response = null;

        try {
            response = await axios.get(`${baseURL}/user/logout`);

            // Check the response status
            expect(response.status).toBe(200);

        } catch (error) {
            console.error('Error logging out:', error);
        }
    })

    it('should add a new pet', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        let pet = {
            id: 985632,
            category: {
                id: 1356,
                name: "Dogs",
            },
            name: "doggie",
            photoUrls: ["http://photos.com/doggie.jpg"],
            tags: [
                {
                    id: 985632,
                    name: "tag1",
                },
                {
                    id: 8561,
                    name: "tag2",
                },
            ],
            status: "available",
        };

        let response = await axios.post(`${baseURL}/pet`, pet);

        // Check that the status code is 200
        expect(response.status).toBe(200);
         
        //Verify the name of the pet that was just added
        let addedPet = await axios.get(`${baseURL}/pet/${pet.id}`);
        expect(addedPet.data.name).toBe(pet.name);
    })

    it('should update a pet’s image', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        // Original pet data
        let pet = {
            id: 985632,
            category: {
              id: 1356,
              name: "Dogs",
            },
            name: "doggy",
            photoUrls: ["http://photos.com/doggy.jpg"],
            tags: [
              {
                id: 985632,
                name: "tag1",
              }
            ],
            status: "available",
        };

        // Update pet's image
        pet.photoUrls = ["http://photos.com/doggy-updated.jpg"];

        let response = await axios.put(`${baseURL}/pet`, pet);

        // Check that the status code is 200
        expect(response.status).toBe(200);
         
        // Verify the pet's image has been updated
        let updatedPet = await axios.get(`${baseURL}/pet/${pet.id}`);
        expect(updatedPet.data.photoUrls[0]).toBe(pet.photoUrls[0]);
    })

    it('should update a pet’s name and status', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        const petId = 985632; // Replace with your pet's ID 
        const newPetName = 'NewName';
        const newPetStatus = 'sold';

        let response = await axios.post(`${baseURL}/pet/${petId}`, {
            name: newPetName,
            status: newPetStatus
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Check that the status code is 200
        expect(response.status).toBe(200);

        // Verify that the pet's name and status were updated by 
        // sending a GET request to `/pet/{petId}` and comparing the pet's name and status
        let updatedPet = await axios.get(`${baseURL}/pet/${petId}`);
        expect(updatedPet.data.name).toBe(newPetName);
        expect(updatedPet.data.status).toBe(newPetStatus);
    });

    it.only('should allow deleting a pet', async function() {
        const baseURL = 'https://petstore.swagger.io/v2';

        const petId = 985632; // Replace with the ID of your pet
        const apiKey = 'YOUR_API_KEY'; // Replace with your API Key

        try {
            let response = await axios.delete(`${baseURL}/pet/${petId}`, {
                headers: { api_key: apiKey }
            });

            // Check that the status code is 200
            expect(response.status).toBe(200);

            // Verify the pet has been deleted by sending a GET request to `/pet/{petId}`
            // This should now return a 404 error
            response = await axios.get(`${baseURL}/pet/${petId}`);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });
});