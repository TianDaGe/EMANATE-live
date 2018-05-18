// Returns true when there's an error
export const required = (value) => {
  return value.toString().trim().length <= 0;
};

// Returns true when there's an error
export const email = (value) => {
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !validEmail.test(value);
};