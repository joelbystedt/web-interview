export const CONFIG = {
  MESSAGES: {
    HELLO_WORLD: 'Hello World!',
    SERVER_LISTENING: 'Example app listening on port',
    TODO_DELETED_SUCCESS: 'Todo deleted successfully',
  },
  ERROR_MESSAGES: {
    TODO_NOT_FOUND: 'Todo not found',
    TODO_TEXT_REQUIRED: 'Todo text is required',
    INVALID_INPUT: 'Invalid input provided',
    LIST_NOT_FOUND: 'List not found',
  },
}

export type Config = typeof CONFIG
