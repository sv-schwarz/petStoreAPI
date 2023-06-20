import pet from '../fixtures/pet.json'
import { faker } from '@faker-js/faker';

pet.id =faker.number.int()
pet.name = faker.animal.cat.name
pet.category.id = faker.number.int()
pet.category.name = faker.animal.type()

it('Create pet', () => {
  cy.log(`Create pet with id: ${pet.id}`)

  cy.request ('POST', '/pet', pet).then( response => {
    // cy.log(`Pet id: ${pet.id}`)
    // cy.log(`Pet name: ${pet.name}`)

    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
  })
})

it('Get pet by ID', () => {
  cy.log(`Get pet with id: ${pet.id}`)

  cy.request ('GET', `/pet/${pet.id}`, pet).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

it('Update pet', () => {
  cy.log(`Update pet with id: ${pet.id}`)

  pet.name = "QWEqwe";
  pet.status = 'sold';
  cy.request ('PUT', '/pet', pet).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.status).to.be.equal(pet.status);
  })

  cy.request ('GET', `/pet/${pet.id}`, pet).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(pet.id);
    expect(response.body.name).to.be.equal(pet.name);
    expect(response.body.category.id).to.be.equal(pet.category.id);
    expect(response.body.category.name).to.be.equal(pet.category.name);
  })
})

it('Find pet by status', () => {
  cy.log(`Find pet with id: ${pet.id}`)

  cy.request ('GET', `/pet/findByStatus?status=${pet.status}`).then( response => {
    expect(response.status).to.be.equal(200);
    
    let pets = response.body;
    let resultPetArray = pets.filter(myPet => {
      return myPet.id === pet.id
    })

    console.log(resultPetArray);

    expect(resultPetArray[0]).to.be.eql(pet);
  })
})

it.only('Update pet with form data', () => {
  const updatedPet = {
    id: 2537295756394496,
    name: "Jane",
    status: 'available'
  };

  cy.log(`Update pet with id: ${updatedPet.id} using form data`);
  
  cy.request ({
    method: 'POST', 
    url: `/pet/${updatedPet.id}`,
    form: true, 
    body: {
      id: updatedPet.id,
      name: updatedPet.name,
      status: updatedPet.status,
    }
  }).then( response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.message).to.be.equal(updatedPet.id.toString());
  })

  cy.request ({
    method: 'GET', 
    url: `/pet/${updatedPet.id}`,
    body: {
      id: updatedPet.id,
      name: updatedPet.name,
      status: updatedPet.status,
    }
  }).then( response => {
    cy.log(response); 
    expect(response.status).to.be.equal(200);
    expect(response.body.id).to.be.equal(updatedPet.id);
    expect(response.body.name).to.be.equal(updatedPet.name);
    expect(response.body.status).to.be.equal(updatedPet.status);
  })
})

it.only('Delete pet', () => {
  const petToDelete = {
    id: 0
  };
  cy.log(`Delete pet with id ${petToDelete.id}`)

  cy.request ({
    failOnStatusCode: false,
    method: 'DELETE', 
    url: `/pet/${petToDelete.id}`,
    body: {
      id: petToDelete.id,
    }
  }).then( response => {
    expect(response.status).to.be.equal(404);
  })

  cy.request ({
    failOnStatusCode: false,
    method: 'GET', 
    url: `/pet/${petToDelete.id}`,
    body: {
      id: petToDelete.id,
    }
  }).then( response => {
    cy.log(response); 
    expect(response.status).to.be.equal(404);
    expect(response.body.code).to.be.equal(1);
    expect(response.body.type).to.be.equal('error');
    expect(response.body.message).to.be.equal('Pet not found');
  })
})

