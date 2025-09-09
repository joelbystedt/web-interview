export const CONFIG = {
  DEFAULT_LIST: {
    ID: 'default',
    NAME: 'Default List',
  },
  MESSAGES: {
    HELLO_WORLD: 'Hello World!',
    SERVER_LISTENING: 'Example app listening on port',
  },
  ERROR_MESSAGES: {
    TODO_NOT_FOUND: 'Todo not found',
    INVALID_INPUT: 'Invalid input provided',
    LIST_NOT_FOUND: 'List not found',
  },
  VALIDATION: {
    MIN_TEXT_LENGTH: 1,
    MAX_TEXT_LENGTH: 500,
    MAX_TODOS_PER_LIST: 1000,
  },
}

export type Config = typeof CONFIG
