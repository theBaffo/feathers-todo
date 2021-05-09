const assert = require('assert');
const app = require('../../src/app');

describe('\'todos\' service', () => {
  let user1;

  before(async () => {
    // Create a user for testing
    user1 = await app.service('users').create({
      email: 'test.todo@example.com',
      password: 'supersecret'
    });
  });

  it('registered the service', () => {
    const service = app.service('todos');

    assert.ok(service, 'Registered the service');
  });

  it('creates a todo', async () => {
    const params = { user: user1 };
    
    const todo = await app.service('todos').create({
      title: 'Buy milk',
    }, params);

    assert.equal(todo.title, 'Buy milk');
    assert.equal(todo.done, false);
    
    // `userId` should be set to passed users it
    assert.equal(todo.userId, user1._id);
  });

  it('reads a todo', async () => {
    const params = { user: user1 };

    const todo = await app.service('todos').create({
      title: 'Buy milk',
    }, params);

    const retrievedTodo = await app.service('todos').get(todo._id, params);

    assert.equal(retrievedTodo._id, todo._id);
    assert.equal(retrievedTodo.title, todo.title);
    assert.equal(retrievedTodo.done, false);
  });

  it('reads all todos', async () => {
    const params = { user: user1 };

    const todo = await app.service('todos').create({
      title: 'Buy milk',
    }, params);

    const existingTodos = await app.service('todos').find(params);
    const createdTodo = existingTodos.data.find((existingTodo) => existingTodo._id === todo._id);

    assert.equal(createdTodo._id, todo._id);
    assert.equal(createdTodo.title, todo.title);
    assert.equal(createdTodo.done, false);
  });

  it('updates a todo', async () => {
    const params = { user: user1 };
    
    const todo = await app.service('todos').create({
      title: 'Buy milk',
    }, params);

    // Mark the todo as done
    todo.done = true;

    // Updates Todo
    const updatedTodo = await app.service('todos').update(todo._id, { ...todo }, params);

    assert.equal(updatedTodo._id, todo._id);
    assert.equal(updatedTodo.title, todo.title);
    assert.equal(updatedTodo.done, true);
  });

  it('patches a todo', async () => {
    const params = { user: user1 };
    
    const todo = await app.service('todos').create({
      title: 'Buy milk',
    }, params);

    // Marks todo as 'done'
    const updatedTodo = await app.service('todos').patch(todo._id, { done: true }, params);

    assert.equal(updatedTodo._id, todo._id);
    assert.equal(updatedTodo.title, todo.title);
    assert.equal(updatedTodo.done, true);
  });

  it('deletes a todo', async () => {
    const params = { user: user1 };
    
    const todo = await app.service('todos').create({
      title: 'Buy milk',
    }, params);

    // Deletes Todo
    const deletedTodo = await app.service('todos').remove(todo._id, params);

    assert.equal(deletedTodo._id, todo._id);
    assert.equal(deletedTodo.title, todo.title);
    assert.equal(deletedTodo.done, false);
  });
});
