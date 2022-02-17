/**
 * M3O Database
 * -------------------------
 *
 * This is a snippet of how you may want to consume the db api.
 */

import { m3oRequest } from '..'

const DB_API_NAME = 'db'

// ------------------------------
// Example 1 -> Individual Functions
// ------------------------------

export function count(table) {
  return m3oRequest(DB_API_NAME, 'Count', {
    table
  })
}

export function create(table, record) {
  return m3oRequest(DB_API_NAME, 'Create', {
    table,
    record
  })
}

export function deleteItem(table, id) {
  return m3oRequest(DB_API_NAME, 'Delete', {
    table,
    id
  })
}

export function dropTable(table) {
  return m3oRequest(DB_API_NAME, 'DropTable', { table })
}

export function read(table, query) {
  return m3oRequest(DB_API_NAME, 'Read', {
    table,
    query
  })
}

export function rename(from, to) {
  return m3oRequest(DB_API_NAME, 'Rename', {
    from,
    to
  })
}

export function truncate(table) {
  return m3oRequest(DB_API_NAME, 'Truncate', { table })
}

export function update(table, record) {
  return m3oRequest(DB_API_NAME, 'Update', {
    table,
    record
  })
}

// todos.js
import { create } from './db'

async function createTodo(todo) {
  const response = await create('todos', {
    todo,
    checked: false
  })

  console.log(response)
}

createTodo('Use M3O')

// ------------------------------
// Example 2 -> Class
// ------------------------------

class Database {
  constructor(table) {
    this.table = table
  }

  count() {
    return m3oRequest(DB_API_NAME, 'Count', {
      table: this.table
    })
  }

  create(record) {
    return m3oRequest(DB_API_NAME, 'Create', {
      table: this.table,
      record
    })
  }

  deleteItem(id) {
    return m3oRequest(DB_API_NAME, 'Delete', {
      table: this.table,
      id
    })
  }

  dropTable() {
    return m3oRequest(DB_API_NAME, 'DropTable', { table: this.table })
  }

  read(query) {
    return m3oRequest(DB_API_NAME, 'Read', {
      table: this.table,
      query
    })
  }

  async rename(to) {
    await m3oRequest(DB_API_NAME, 'Rename', {
      from: this.table,
      to
    })

    this.table = to
  }

  truncate() {
    return m3oRequest(DB_API_NAME, 'Truncate', { table: this.table })
  }

  update(record) {
    return m3oRequest(DB_API_NAME, 'Update', {
      table: this.table,
      record
    })
  }
}

// todo.js

import { Database } from './db'

const todos = new Database('todos')

todos.create({
  todo,
  checked: false
})
